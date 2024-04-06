"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCaptcha = exports.captcha = void 0;
const canvas_1 = require("canvas");
const utils_1 = require("../modules/utils");
const CAPTCHA_AMOUNT = 20;
const CAPTCHA_SIZE = 140;
const NOISE_CHANCE = 0.35;
const DISTORTION_FACTOR = 0.7;
const FONT_SIZE = 22;
const characters = ["0", "2", "5", "6", "8"];
let charactersImages = [];
(0, canvas_1.registerFont)("./Sevillana-Regular.ttf", {
    family: "Sevillana"
});
exports.captcha = [];
let i = 0;
function updateCaptcha() {
    exports.captcha[i++] = createCaptcha();
    if (i >= CAPTCHA_AMOUNT)
        i = 0;
}
exports.updateCaptcha = updateCaptcha;
for (let i = 0; i < characters.length; i++) {
    charactersImages[characters[i]] = getCharacter(characters[i], (Math.random() - 0.5) * DISTORTION_FACTOR);
}
updateCaptcha();
function generateText(length) {
    let text = "";
    for (let i = 0; i < length; i++) {
        text += characters[Math.floor(Math.random() * characters.length)];
    }
    return text;
}
function createCaptcha() {
    const canvas = (0, canvas_1.createCanvas)(CAPTCHA_SIZE, CAPTCHA_SIZE / 2);
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "start";
    context.textBaseline = "middle";
    context.fillStyle = "black";
    let text = generateText(4);
    context.putImageData(generateNoiseImageData(canvas, context), 0, 0);
    const charWidth = canvas.width / text.length;
    for (let i = 0; i < text.length; i++) {
        const xPosition = i * charWidth + utils_1.Utils.random_clamp(-2, 2);
        const yPosition = utils_1.Utils.random_clamp(0, canvas.height - FONT_SIZE);
        context.putImageData(charactersImages[text[i]], xPosition, yPosition);
    }
    return ({
        text,
        buffer: canvas.toBuffer("image/png", { compressionLevel: 9 })
    });
}
function getCharacter(character, distortion) {
    const canvas = (0, canvas_1.createCanvas)(FONT_SIZE - 4, FONT_SIZE + 4);
    const context = canvas.getContext("2d");
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "black";
    context.font = FONT_SIZE + "px 'Sevillana'";
    context.transform(1, distortion, distortion / 2, 1, distortion / 2, distortion / 2);
    context.fillText(character, (FONT_SIZE - 4) / 2, (FONT_SIZE + 4) / 2);
    const imageData = context.getImageData(0, 0, FONT_SIZE - 4, FONT_SIZE + 4);
    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 0 && imageData.data[i + 3] > 20) {
            imageData.data[i] = 0;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
            imageData.data[i + 3] = 255;
        }
        else {
            if (Math.random() > NOISE_CHANCE)
                continue;
            imageData.data[i] = 0;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
            imageData.data[i + 3] = 255;
        }
    }
    return imageData;
}
function generateNoiseImageData(canvas, context) {
    const noiseImageData = context.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < noiseImageData.data.length; i += 4) {
        if (Math.random() > NOISE_CHANCE)
            continue;
        noiseImageData.data[i] = 0;
        noiseImageData.data[i + 1] = 0;
        noiseImageData.data[i + 2] = 0;
        noiseImageData.data[i + 3] = 255;
    }
    return noiseImageData;
}
