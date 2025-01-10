// due to CSS rendering issues, we needed to move these styles to a separate function to show correctly...
const heroBgImgStyles = (image?: string) => {
  return {
    backgroundImage: image?.includes("https")
      ? `url(${image}&width=100)`
      : `url(${image}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
};

export default heroBgImgStyles;
