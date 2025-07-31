/**
 * Utility functions for generating shadow images using Pollinations API
 */

/**
 * Generates a URL for a shadow image based on its characteristics
 * @param params Shadow characteristics
 * @returns Direct URL to the generated image
 */
export const pollinationsPrompt = ({ 
  name, 
  type, 
  rarity, 
  emotion 
}: { 
  name: string; 
  type: string; 
  rarity: string; 
  emotion: string;
}): string => {
  // Encode parameters for URL
  const encodedName = encodeURIComponent(name);
  const encodedType = encodeURIComponent(type);
  const encodedRarity = encodeURIComponent(rarity);
  const encodedEmotion = encodeURIComponent(emotion);
  
  // Create the URL with encoded parameters
  return `https://image.pollinations.ai/prompt/A%20${encodedRarity}%20shadow%20creature%20named%20${encodedName},%20${encodedType}-type,%20born%20from%20${encodedEmotion},%20glowing%20runes,%20ethereal%20smoke,%20floating,%20transparent%20background,%20Hades%20style,%20512x512?width=512&height=512&nologo=true`;
};

/**
 * Maps shadow class to appropriate type and emotion for image generation
 * @param shadowClass The class of the shadow
 * @returns Object with type and emotion
 */
export const getShadowImageAttributes = (shadowClass: string): { type: string; emotion: string } => {
  switch (shadowClass) {
    case 'warrior':
      return { type: 'fire', emotion: 'courage' };
    case 'mage':
      return { type: 'arcane', emotion: 'wisdom' };
    case 'archer':
      return { type: 'wind', emotion: 'precision' };
    case 'assassin':
      return { type: 'void', emotion: 'stealth' };
    default:
      return { type: 'shadow', emotion: 'mystery' };
  }
};

/**
 * Generates a shadow image URL based on shadow properties
 * @param name Shadow name
 * @param shadowClass Shadow class
 * @param rarity Shadow rarity
 * @returns URL to the generated image
 */
export const generateShadowImageUrl = (
  name: string,
  shadowClass: string,
  rarity: string
): string => {
  const { type, emotion } = getShadowImageAttributes(shadowClass);
  
  return pollinationsPrompt({
    name,
    type,
    rarity,
    emotion
  });
};