import { createReadStream, existsSync, readdirSync, statSync, writeFileSync } from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';
import { Tree, Triep } from '../../src/triep';
import { Canvas, loadImage } from 'skia-canvas';
import { Extract } from 'unzip-stream';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!existsSync(__dirname + "/assets") || !statSync(__dirname + "/assets").isDirectory()) {
	if (!existsSync(__dirname + "/assets.zip")) throw new Error("assets.zip not found");
	console.log("Extracting assets.zip...");
	await new Promise<void>(res => {
		createReadStream(__dirname + "/assets.zip")
			.pipe(Extract({ path: __dirname + "/assets" }))
			.on("close", res);
	});
	console.log("Extracted assets.zip");
}

const categories: { [key: string]: Tree } = {};
const hiraCategories: { [key: string]: Tree } = {};
const kataCategories: { [key: string]: Tree } = {};

const assetsDir = path.join(__dirname, "assets");
const maxCat = readdirSync(assetsDir).filter(file => file.endsWith(".png")).length;
let hueRotateCount = 0;
for (const file of readdirSync(assetsDir)) {
	if (file.endsWith(".png")) {
		const cat = path.basename(file, path.extname(file));
		const catDir = path.join(assetsDir, cat);
		const img = await loadImage(path.join(assetsDir, file));
		const color = `HSL(${360 * hueRotateCount++ / maxCat},70%,54%)`;
		const [t1, t2, t3] = Array(3).fill(() => new Tree({
			image: img as unknown as CanvasImageSource,
			imageWidth: img.width,
			imageHeight: img.height,
			color,
			downwards: true,
			scale: 2
		})).map(gen => gen());
		categories[cat] = t1;
		hiraCategories[cat] = t2;
		kataCategories[cat] = t3;
		for (const char of readdirSync(catDir)) {
			if (!char.endsWith(".png")) continue;
			const img = await loadImage(path.join(catDir, char));
			const [t1, t2] = Array(2).fill(() => new Tree({
				image: img as unknown as CanvasImageSource,
				imageWidth: img.width,
				imageHeight: img.height,
				color,
				downwards: true,
			})).map(gen => gen());
			categories[cat].addChildren(t1);
			if (char.startsWith("hira-")) hiraCategories[cat].addChildren(t2);
			else kataCategories[cat].addChildren(t2);
		}
	}
}

const names = ["combined.png", "hiragana.png", "katakana.png"];
[categories, hiraCategories, kataCategories].forEach(async (cats, ii) => {
	const triep = new Triep();
	triep.root.addChildren(...Object.values(cats));

	const canvas = new Canvas(2048, 2048);
	const ctx = canvas.getContext("2d");
	triep.render(ctx as unknown as CanvasRenderingContext2D, 1024, 1024, [240, 540, 160], 8);
	writeFileSync(path.join(__dirname, names[ii]), await canvas.png);
});
