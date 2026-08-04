/**
 * Estimates reading time from Markdown/plain content.
 * Strips Markdown syntax before counting words so formatting
 * characters don't inflate the estimate.
 */
export function calculateReadingTime(content = '', wordsPerMinute = 200) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[.*?\]\(.*?\)/g, '') // links
    .replace(/[#*_>`~-]/g, ''); // markdown symbols

  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return minutes; // stored on the post as `readingTime`
}

export default calculateReadingTime;
