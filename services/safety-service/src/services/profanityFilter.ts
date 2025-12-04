/**
 * Profanity Filter Service
 * Detects inappropriate language and content
 */

export interface ProfanityCheckResult {
    hasProfanity: boolean;
    detectedWords: string[];
    positions: Array<{ word: string; index: number }>;
}

// List of inappropriate words/phrases for children's content
const PROFANITY_LIST = [
    'damn', 'hell', 'crap', 'stupid', 'idiot', 'dumb',
    'shut up', 'hate', 'kill', 'die', 'death',
    // Add more as needed
];

// Sensitive topics that may not be age-appropriate
const SENSITIVE_TOPICS = [
    'violence', 'blood', 'weapon', 'gun', 'knife',
    'scary', 'nightmare', 'monster',
    'alcohol', 'drug', 'cigarette', 'smoke',
];

export class ProfanityFilter {
    /**
     * Check text for profanity and inappropriate content
     */
    checkProfanity(text: string): ProfanityCheckResult {
        const lowerText = text.toLowerCase();
        const detectedWords: string[] = [];
        const positions: Array<{ word: string; index: number }> = [];

        // Check for profanity
        for (const word of PROFANITY_LIST) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = lowerText.matchAll(regex);

            for (const match of matches) {
                if (!detectedWords.includes(word)) {
                    detectedWords.push(word);
                }
                positions.push({
                    word,
                    index: match.index || 0,
                });
            }
        }

        return {
            hasProfanity: detectedWords.length > 0,
            detectedWords,
            positions,
        };
    }

    /**
     * Check for sensitive topics
     */
    checkSensitiveTopics(text: string): string[] {
        const lowerText = text.toLowerCase();
        const found: string[] = [];

        for (const topic of SENSITIVE_TOPICS) {
            const regex = new RegExp(`\\b${topic}\\b`, 'i');
            if (regex.test(lowerText)) {
                found.push(topic);
            }
        }

        return found;
    }

    /**
     * Get severity score (0-1, where 1 is most severe)
     */
    getSeverityScore(profanityResult: ProfanityCheckResult, sensitiveTopics: string[]): number {
        const profanityWeight = 0.7;
        const topicWeight = 0.3;

        const profanityScore = Math.min(profanityResult.detectedWords.length / 5, 1);
        const topicScore = Math.min(sensitiveTopics.length / 3, 1);

        return profanityWeight * profanityScore + topicWeight * topicScore;
    }
}

export const profanityFilter = new ProfanityFilter();
