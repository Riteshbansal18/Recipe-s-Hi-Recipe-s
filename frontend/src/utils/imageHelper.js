// Helper function to construct proper image URLs
// Handles Cloudinary URLs and legacy local paths
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full Cloudinary URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // Legacy support: Handle old local paths
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
