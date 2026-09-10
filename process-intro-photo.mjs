import { Jimp } from "jimp";

async function cropWhiteShirtPerson() {
  try {
    const image = await Jimp.read("Sriram Port Frame 2.png");
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    console.log(`Original dimensions: ${width}x${height}`);

    // Crop the left side containing Sriram in white shirt
    const cropWidth = Math.floor(width * 0.45);
    const cropped = image.clone().crop({ x: 0, y: 0, w: cropWidth, h: height });

    await cropped.write("public/sriram-white-shirt.png");
    console.log("Successfully created public/sriram-white-shirt.png!");
  } catch (err) {
    console.error("Error cropping person:", err);
  }
}

cropWhiteShirtPerson();
