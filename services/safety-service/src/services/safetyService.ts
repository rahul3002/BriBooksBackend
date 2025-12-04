import { AgeGroup } from '@bribooks/shared';
import { profanityFilter, ProfanityCheckResult } from './profanityFilter';

export interface SafetyCheckResult {
    isSafe: boolean;
    score: number; // 0-1, where 1 is completely safe
    issues: string[];
    recommendations?: string;
    profanityCheck?: ProfanityCheckResult;
}

export interface BatchSafetyCheckItem {
    text: string;
    ageGroup: AgeGroup;
}

export class SafetyService {

    /**
     * Comprehensive content safety check
     */
    async checkContentSafety(text: string, ageGroup: AgeGroup): Promise<SafetyCheckResult> {
        const issues: string[] = [];

        // 1. Check for profanity
        const profanityResult = profanityFilter.checkProfanity(text);
        if (profanityResult.hasProfanity) {
            issues.push(`Inappropriate language detected: ${profanityResult.detectedWords.join(', ')}`);
        }

        // 2. Check for sensitive topics
        const sensitiveTopics = profanityFilter.checkSensitiveTopics(text);
        if (sensitiveTopics.length > 0) {
            issues.push(`Sensitive topics found: ${sensitiveTopics.join(', ')}`);
        }

        // 3. Calculate base safety score
        const severityScore = profanityFilter.getSeverityScore(profanityResult, sensitiveTopics);
        let safetyScore = 1 - severityScore;

        // 4. Check age appropriateness
        const ageIssues = this.checkAgeAppropriateness(text, ageGroup);
        if (ageIssues.length > 0) {
            issues.push(...ageIssues);
            safetyScore *= 0.8; // Reduce score for age-inappropriate content
        }

        // 5. Determine if content is safe
        const isSafe = safetyScore >= 0.7 && issues.length === 0;

        return {
            isSafe,
            score: Math.max(0, Math.min(1, safetyScore)),
            issues,
            recommendations: this.getRecommendations(issues, ageGroup),
            profanityCheck: profanityResult,
        };
    }

    /**
     * Check age appropriateness
     */
    private checkAgeAppropriateness(text: string, ageGroup: AgeGroup): string[] {
        const issues: string[] = [];
        const lowerText = text.toLowerCase();

        // Age-specific checks
        if (ageGroup === AgeGroup.TODDLER || ageGroup === AgeGroup.PRESCHOOL) {
            // Very young children - strictest checks
            if (lowerText.includes('scary') || lowerText.includes('afraid')) {
                issues.push('Content may be too scary for toddlers/preschoolers');
            }
            if (text.split(' ').length > 200) {
                issues.push('Content may be too long for this age group');
            }
        }

        if (ageGroup === AgeGroup.TODDLER) {
            // Check for complex words (more than 3 syllables)
            const complexWords = this.findComplexWords(text);
            if (complexWords.length > 5) {
                issues.push('Language may be too complex for toddlers');
            }
        }

        return issues;
    }

    /**
     * Find complex words (simple heuristic: words with many syllables)
     */
    private findComplexWords(text: string): string[] {
        const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
        return words.filter(word => {
            // Simple syllable count heuristic
            const syllables = word.match(/[aeiouy]+/g)?.length || 0;
            return syllables > 3 && word.length > 8;
        });
    }

    /**
     * Get recommendations for improving content
     */
    private getRecommendations(issues: string[], ageGroup: AgeGroup): string {
        if (issues.length === 0) {
            return 'Content appears safe and age-appropriate!';
        }

        const recommendations: string[] = [];

        if (issues.some(i => i.includes('Inappropriate language'))) {
            recommendations.push('Remove or replace inappropriate words with child-friendly alternatives');
        }

        if (issues.some(i => i.includes('Sensitive topics'))) {
            recommendations.push('Consider removing or softening sensitive topics for children\'s content');
        }

        if (issues.some(i => i.includes('too scary'))) {
            recommendations.push('Use gentler language and avoid frightening scenarios');
        }

        if (issues.some(i => i.includes('too complex'))) {
            recommendations.push(`Simplify language for ${ageGroup} age group`);
        }

        return recommendations.join('. ');
    }

    /**
     * Batch check multiple content items
     */
    async batchCheckContent(items: BatchSafetyCheckItem[]): Promise<SafetyCheckResult[]> {
        const results: SafetyCheckResult[] = [];

        for (const item of items) {
            const result = await this.checkContentSafety(item.text, item.ageGroup);
            results.push(result);
        }

        return results;
    }

    /**
     * Check only for profanity (quick check)
     */
    checkProfanityOnly(text: string): ProfanityCheckResult {
        return profanityFilter.checkProfanity(text);
    }
}

export const safetyService = new SafetyService();
