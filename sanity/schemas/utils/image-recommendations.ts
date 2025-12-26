/**
 * Image Recommendation Utilities for Articles
 * Provides guidance on image requirements based on word count
 */

export interface ImageRecommendation {
  min: number;
  max: number;
  recommendedInBody: number;
  message: string;
}

/**
 * Calculate recommended images based on word count
 */
export function getImageRecommendation(wordCount: number): ImageRecommendation {
  let min: number;
  let max: number;
  let message: string;

  if (wordCount === 0) {
    min = 1;
    max = 1;
    message = "1 image recommended (cover image)";
  } else if (wordCount <= 300) {
    min = 1;
    max = 1;
    message = "1 image recommended (cover image counts)";
  } else if (wordCount <= 600) {
    min = 2;
    max = 2;
    message = "2 images recommended (1 cover + 1 in content)";
  } else if (wordCount <= 1000) {
    min = 3;
    max = 4;
    message = "3-4 images recommended (1 cover + 2-3 in content)";
  } else if (wordCount <= 1500) {
    min = 5;
    max = 6;
    message = "5-6 images recommended (1 cover + 4-5 in content)";
  } else if (wordCount <= 2000) {
    min = 7;
    max = 8;
    message = "7-8 images recommended (1 cover + 6-7 in content)";
  } else {
    // For 2000+ words: 1 image per 200-250 words
    const baseCount = Math.ceil(wordCount / 250);
    min = baseCount;
    max = baseCount + 2;
    message = `${min}-${max} images recommended (1 cover + ${min - 1}-${max - 1} in content, ~1 per 200-250 words)`;
  }

  const recommendedInBody = Math.max(0, min - 1);

  return {
    min,
    max,
    recommendedInBody,
    message,
  };
}

/**
 * Count words in PortableText body
 */
export function countWordsInBody(body: any[]): number {
  if (!body || !Array.isArray(body)) return 0;
  
  let words = 0;
  body.forEach((block) => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          const textWords = child.text.trim().split(/\s+/).filter((w: string) => w.length > 0);
          words += textWords.length;
        }
      });
    }
  });
  
  return words;
}

/**
 * Count images in PortableText body
 */
export function countImagesInBody(body: any[]): number {
  if (!body || !Array.isArray(body)) return 0;
  return body.filter((block) => block._type === 'image').length;
}

/**
 * Get recommendation message for display
 */
export function getRecommendationMessage(
  wordCount: number,
  imageCount: number,
  hasCoverImage: boolean = true
): string {
  const recommendation = getImageRecommendation(wordCount);
  const totalImages = imageCount + (hasCoverImage ? 1 : 0);
  
  if (totalImages < recommendation.min) {
    const needed = recommendation.min - totalImages;
    return `💡 Συνιστάται: ${recommendation.min}${recommendation.max > recommendation.min ? `-${recommendation.max}` : ''} εικόνες συνολικά για ${wordCount} λέξεις. Έχετε ${imageCount} εικόνες στο περιεχόμενο. Προσθέστε ${needed} ακόμα για καλύτερη ανάγνωση!`;
  }
  
  if (totalImages >= recommendation.min && totalImages < recommendation.max) {
    return `✅ Έχετε ${totalImages} εικόνες (${recommendation.min}-${recommendation.max} συνιστάται). Μπορείτε να προσθέσετε περισσότερες αν θέλετε!`;
  }
  
  return `✅ Εξαιρετικά! Έχετε ${totalImages} εικόνες, περισσότερες από το συνιστώμενο (${recommendation.min}-${recommendation.max}).`;
}

