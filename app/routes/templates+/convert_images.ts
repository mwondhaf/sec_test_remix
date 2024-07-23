import fs from "fs";

const imagePath = "./public/logo.png"; // Path to your image file
export const logoBase64 = fs.readFileSync(imagePath, "base64");
