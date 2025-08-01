import { Triep, Tree } from "../src/triep";
import { writeFileSync } from "fs";
import { Canvas } from "skia-canvas";

const triep = new Triep();
triep.root.text = "root";
triep.root.addChildren(
	new Tree({ text: "red", color: "#f00" }).addChildren(
		new Tree({ text: "pink", color: "pink" }),
		new Tree({ text: "magenta", color: "magenta" }),
	),
	new Tree({ text: "green", color: "#0f0" }),
	new Tree({ text: "blue", color: "#00f" }).addChildren(
		new Tree({ text: "cyan", color: "#0ff" })
	),
);

const canvas = new Canvas(512, 512);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.font = "32px Arial";
triep.render(ctx as unknown as CanvasRenderingContext2D, 256, 256, 64, 4);

writeFileSync("tests/simple.png", await canvas.png);