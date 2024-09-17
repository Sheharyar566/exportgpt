export const getImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.setAttribute('data-testid', 'generate-pdf-picture');
    img.crossOrigin = 'anonymous';

    img.addEventListener('load', async () => {
      const canvas = document.createElement('canvas');
      const width = 1024;
      const height = 1024;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx!.drawImage(img, 0, 0, width, height);

      const pngDataUrl = canvas.toDataURL('image/png', 0.8);
      resolve(pngDataUrl);
    });

    img.addEventListener('error', e => {
      reject(e);
    });

    img.src = src;
  });
};
