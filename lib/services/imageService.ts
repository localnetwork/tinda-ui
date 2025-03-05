export default function detectImageLightOrDark(
  imageSrc: string
): Promise<"light" | "dark"> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let totalBrightness = 0;
      let totalPixels = pixels.length / 4;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const brightness = r * 0.299 + g * 0.587 + b * 0.114;
        totalBrightness += brightness;
      }

      const averageBrightness = totalBrightness / totalPixels;
      resolve(averageBrightness >= 128 ? "light" : "dark");
    };

    img.onerror = () => {
      reject(new Error("Error loading the image"));
    };
  });
}
