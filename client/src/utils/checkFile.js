export const isImage = (element) => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",
    ".tiff",
    ".ico",
    ".webp",
    ".jfif",
    ".pjpeg",
    ".pjp",
    ".apng",
    ".avif",
    ".svgz",
  ];

  const extension = element.split(".").pop().toLowerCase();
  return imageExtensions.includes(`.${extension}`);
};
