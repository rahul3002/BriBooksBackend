import { AgeGroup } from '@bribooks/shared';

// Story generation prompts
export const getStoryGenerationPrompt = (
    userPrompt: string,
    ageGroup: AgeGroup,
    maxLength?: number
) => {
    const ageGroupGuidelines = {
        [AgeGroup.TODDLER]: {
            vocabulary: 'very simple words (1-2 syllables)',
            sentenceLength: '3-5 words per sentence',
            themes: 'daily routines, animals, colors, shapes',
            style: 'repetitive and rhythmic',
        },
        [AgeGroup.PRESCHOOL]: {
            vocabulary: 'simple, concrete words',
            sentenceLength: '5-8 words per sentence',
            themes: 'friendship, family, emotions, simple adventures',
            style: 'engaging with simple plot',
        },
        [AgeGroup.EARLY_READER]: {
            vocabulary: 'age-appropriate with some new words',
            sentenceLength: '8-12 words per sentence',
            themes: 'problem-solving, imagination, school, nature',
            style: 'clear narrative with beginning, middle, and end',
        },
        [AgeGroup.MIDDLE_GRADE]: {
            vocabulary: 'expanded vocabulary with context clues',
            sentenceLength: '12-15 words per sentence',
            themes: 'complex relationships, challenges, growth, adventure',
            style: 'engaging plot with character development',
        },
        [AgeGroup.YOUNG_ADULT]: {
            vocabulary: 'sophisticated vocabulary',
            sentenceLength: 'varied sentence structure',
            themes: 'identity, relationships, social issues, coming-of-age',
            style: 'nuanced storytelling with depth',
        },
    };

    const guidelines = ageGroupGuidelines[ageGroup];
    const lengthGuidance = maxLength
        ? `Keep the story to approximately ${maxLength} words.`
        : '';

    return `You are a creative children's book author specializing in age-appropriate content.

Create a story based on this prompt: "${userPrompt}"

Age Group: ${ageGroup}

Guidelines for this age group:
- Vocabulary: ${guidelines.vocabulary}
- Sentence Length: ${guidelines.sentenceLength}
- Themes: ${guidelines.themes}
- Style: ${guidelines.style}
${lengthGuidance}

Important:
- Keep content positive, educational, and age-appropriate
- Avoid scary, violent, or inappropriate themes
- Use inclusive language and diverse characters
- Make it engaging and fun to read
- Include opportunities for illustration descriptions

Please write the story now:`;
};

// Grammar checking prompt
export const getGrammarCheckPrompt = (text: string) => {
    return `You are an expert editor for children's books. Review the following text for grammar, spelling, and style issues.

Text to review:
"${text}"

Provide corrections in the following JSON format:
{
  "corrections": [
    {
      "original": "the incorrect text",
      "suggestion": "the corrected text",
      "position": 0,
      "reason": "explanation of the issue"
    }
  ]
}

If there are no issues, return an empty corrections array.`;
};

// Content improvement prompt
export const getContentImprovementPrompt = (text: string, ageGroup: AgeGroup) => {
    return `You are an expert children's book editor. Analyze the following text and provide suggestions to improve it for ${ageGroup} readers.

Text:
"${text}"

Provide suggestions for:
1. Vocabulary enhancement (age-appropriate)
2. Sentence structure improvements
3. Engagement and pacing
4. Clarity and readability
5. Emotional resonance

Format your response as actionable suggestions.`;
};

// Illustration description prompt
export const getIllustrationPrompt = (chapterContent: string, ageGroup: AgeGroup) => {
    return `You are an art director for children's books. Based on the following chapter content, create detailed illustration descriptions that would help an illustrator create engaging, age-appropriate artwork for ${ageGroup} readers.

Chapter Content:
"${chapterContent}"

Provide 2-3 illustration descriptions that:
- Capture key moments or scenes
- Are visually engaging for the target age group
- Include details about characters, setting, mood, and composition
- Are suitable for children's book illustration styles

Format each description clearly and concisely.`;
};

// Content safety check prompt
export const getContentSafetyPrompt = (text: string, ageGroup: AgeGroup) => {
    return `You are a content safety expert for children's literature. Analyze the following text for age-appropriateness and safety for ${ageGroup} readers.

Text:
"${text}"

Check for:
1. Inappropriate language or themes
2. Violence or scary content
3. Age-inappropriate topics
4. Potentially harmful stereotypes
5. Any content that might be disturbing for this age group

Respond in JSON format:
{
  "isSafe": true/false,
  "issues": [
    {
      "type": "category of issue",
      "severity": "LOW/MEDIUM/HIGH",
      "description": "explanation of the concern"
    }
  ],
  "recommendations": "suggestions for improvement if issues found"
}`;
};
