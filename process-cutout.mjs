import { Jimp } from "jimp";

async function makeCutout() {
  try {
    const image = await Jimp.read("Sriram Port frame.jpeg");
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Flood fill / background transparency from border pixels
    // Sample background color (it's deep black)
    const visited = new Uint8Array(width * height);
    const queue = [];

    // Push top, left, right border pixels into queue
    for (let x = 0; x < width; x++) {
      queue.push(x, 0); // top
      visited[0 * width + x] = 1;
    }
    for (let y = 0; y < height; y++) {
      queue.push(0, y); // left
      visited[y * width + 0] = 1;
      queue.push(width - 1, y); // right
      visited[y * width + (width - 1)] = 1;
    }

    let head = 0;
    while (head < queue.length) {
      const px = queue[head++];
      const py = queue[head++];

      const idx = (py * width + px) * 4;
      const r = image.bitmap.data[idx];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];

      // If this pixel is part of the dark background or text in background
      // Black background threshold
      const brightness = Math.max(r, g, b);
      // If dark background pixel or top text area
      if (brightness < 45 || (py < height * 0.25 && brightness < 200)) {
        image.bitmap.data[idx + 3] = 0; // make transparent!

        // Check 4 neighbors
        const neighbors = [
          [px + 1, py],
          [px - 1, py],
          [px, py + 1],
          [px, py - 1]
        ];

        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = ny * width + nx;
            if (!visited[nIdx]) {
              visited[nIdx] = 1;
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    await image.write("public/sriram-cutout.png");
    console.log("Successfully created public/sriram-cutout.png!");
  } catch (err) {
    console.error("Error processing cutout:", err);
  }
}

makeCutout();
