// Content Moderation Service using Gemini API
// Note: For production, consider moving API calls to your backend for security

interface ModerationResult {
    isAbusive: boolean;
    filteredText: string;
    confidence?: number;
    categories?: string[];
    reason?: string;
  }
  
  class ContentModerationService {
    private apiKey: string;
    private baseUrl: string = 'https://generativelanguage.googleapis.com';
    
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    /**
     * Check content using Gemini API for abusive language
     */
    async moderateContent(text: string): Promise<ModerationResult> {
      try {
        const response = await fetch(
          `${this.baseUrl}/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: this.createModerationPrompt(text)
                }]
              }],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 300,
                topP: 0.1,
                topK: 1
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_LOW_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH", 
                  threshold: "BLOCK_LOW_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_LOW_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_LOW_AND_ABOVE"
                }
              ]
            })
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }
  
        const data = await response.json();
        
        // Check if content was blocked by safety settings
        if (data.candidates?.[0]?.finishReason === 'SAFETY') {
          return {
            isAbusive: true,
            filteredText: this.censorText(text),
            reason: 'Content blocked by safety filters',
            categories: ['SAFETY_VIOLATION']
          };
        }
  
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!aiResponse) {
          throw new Error('No response from Gemini API');
        }
  
        return this.parseAIResponse(aiResponse, text);
        
      } catch (error) {
        console.error('Gemini API moderation error:', error);
        // Fallback to local filtering
        return this.fallbackModeration(text);
      }
    }
  
    /**
     * Create a detailed prompt for content moderation
     */
    private createModerationPrompt(text: string): string {
      return `You are a content moderation AI. Analyze the following message for inappropriate content.
  
  Check for:
  - Hate speech or discriminatory language
  - Harassment, bullying, or threats
  - Profanity or vulgar language
  - Spam or excessive repetition
  - Personal attacks or insults
  - Inappropriate sexual content
  - Violence or dangerous content
  
  Message to analyze: "${text}"
  
  Respond with ONLY a valid JSON object in this exact format:
  {
    "isAbusive": boolean,
    "confidence": number (0-1), 
    "categories": ["category1", "category2"],
    "filteredText": "message with inappropriate words replaced with asterisks",
    "reason": "brief explanation if abusive"
  }
  
  Be strict but fair in your assessment. Even mild profanity should be flagged.`;
    }
  
    /**
     * Parse AI response and extract moderation result
     */
    private parseAIResponse(aiResponse: string, originalText: string): ModerationResult {
      try {
        // Extract JSON from response (sometimes AI adds extra text)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
          throw new Error('No JSON found in AI response');
        }
  
        const result = JSON.parse(jsonMatch[0]);
        
        return {
          isAbusive: Boolean(result.isAbusive),
          filteredText: result.filteredText || originalText,
          confidence: result.confidence || 0,
          categories: result.categories || [],
          reason: result.reason || ''
        };
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // If parsing fails, use fallback
        return this.fallbackModeration(originalText);
      }
    }
  
    /**
     * Fallback content moderation using local patterns
     */
    private fallbackModeration(text: string): ModerationResult {
      const patterns = {
        profanity: /\b(fuck|shit|damn|hell|bitch|asshole|bastard|crap|piss)\b/gi,
        insults: /\b(stupid|idiot|fool|dumb|moron|retard|loser|pathetic)\b/gi,
        hate: /\b(hate|kill|die|death|murder|racist|sexist|nazi|terrorist)\b/gi,
        harassment: /\b(shut up|stfu|kys|kill yourself|go die)\b/gi,
        spam: /(.)\1{4,}|([!@#$%^&*]){3,}/g
      };
  
      let isAbusive = false;
      let filteredText = text;
      const detectedCategories: string[] = [];
  
      Object.entries(patterns).forEach(([category, pattern]) => {
        if (pattern.test(text)) {
          isAbusive = true;
          detectedCategories.push(category.toUpperCase());
          filteredText = filteredText.replace(pattern, (match) => '*'.repeat(match.length));
        }
      });
  
      return {
        isAbusive,
        filteredText,
        confidence: isAbusive ? 0.8 : 0.1,
        categories: detectedCategories,
        reason: isAbusive ? `Detected ${detectedCategories.join(', ').toLowerCase()}` : ''
      };
    }
  
    /**
     * Simple text censoring function
     */
    private censorText(text: string): string {
      return text.replace(/\b\w+\b/g, (word) => {
        if (word.length <= 3) return word;
        return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
      });
    }
  }
  
  // Updated Chat component with proper Gemini integration
  const checkContentWithGemini = async (text: string): Promise<{ isAbusive: boolean; filteredText: string }> => {
    // Get API key from environment variables
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      console.warn('Gemini API key not configured, using fallback moderation');
      return fallbackContentFilter(text);
    }
  
    const moderationService = new ContentModerationService(apiKey);
    const result = await moderationService.moderateContent(text);
    
    return {
      isAbusive: result.isAbusive,
      filteredText: result.filteredText
    };
  };
  
  // Enhanced fallback filter
  const fallbackContentFilter = (text: string): { isAbusive: boolean; filteredText: string } => {
    const abusivePatterns = [
      // Profanity
      /\b(fuck|shit|damn|hell|bitch|asshole|bastard|crap|piss|cock|dick|pussy|cunt)\b/gi,
      // Insults
      /\b(stupid|idiot|fool|dumb|moron|retard|loser|pathetic|worthless|useless)\b/gi,
      // Hate speech
      /\b(hate|kill|die|death|murder|racist|sexist|nazi|terrorist|faggot|nigger)\b/gi,
      // Harassment
      /\b(shut up|stfu|kys|kill yourself|go die|neck yourself)\b/gi,
      // Spam patterns
      /(.)\1{4,}/g, // Repeated characters
      /[!@#$%^&*]{3,}/g, // Excessive special characters
      // Threats
      /\b(threat|bomb|attack|violence|hurt|harm|destroy)\b/gi
    ];
    
    let isAbusive = false;
    let filteredText = text;
    
    abusivePatterns.forEach(pattern => {
      if (pattern.test(text)) {
        isAbusive = true;
        filteredText = filteredText.replace(pattern, (match) => {
          // Keep first and last character, replace middle with asterisks
          if (match.length <= 2) return '*'.repeat(match.length);
          return match[0] + '*'.repeat(Math.max(1, match.length - 2)) + match[match.length - 1];
        });
      }
    });
    
    return { isAbusive, filteredText };
  };
  
  // Export for use in your Chat component
  export { ContentModerationService, checkContentWithGemini, fallbackContentFilter };