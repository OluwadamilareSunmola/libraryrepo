export const resolveCoverImage = (coverImage, isbn) => {
  if (coverImage && typeof coverImage === 'string' && coverImage.trim().length > 0) {
    return coverImage;
  }

  if (isbn) {
    const cleanISBN = isbn.replace(/[^0-9Xx]/g, '');
    if (cleanISBN) {
      return `https://covers.openlibrary.org/b/isbn/${cleanISBN}-M.jpg?default=false`;
    }
  }

  return null;
};

export const handleCoverImageError = (event) => {
  const img = event.target;
  img.style.display = 'none';
  const container = img.parentElement;
  if (!container) return;

  const placeholder =
    container.querySelector('.book-cover-placeholder') ||
    container.querySelector('.book-cover-placeholder-large') ||
    container.querySelector('.book-cover-placeholder-small');

  if (placeholder) {
    placeholder.style.display = 'flex';
  }
};

