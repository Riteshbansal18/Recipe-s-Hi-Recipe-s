// Helper function to construct proper image URLs
// Handles both old format (images/filename.jpg) and new format (filename.jpg)
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  const apiUrl = process.env.REACT_APP_API_URL;
  
  // Normalize backslashes to forward slashes (Windows paths)
  const normalizedPath = imagePath.replace(/\\/g, '/');
  
  // If path already starts with 'images/', use it as is
  if (normalizedPath.startsWith('images/')) {
    return `${apiUrl}/${normalizedPath}`;
  }
  
  // Otherwise, add 'images/' prefix
  return `${apiUrl}/images/${normalizedPath}`;
};
