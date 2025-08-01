import { Triep, Tree } from "../../src/triep";
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from "fs";
import { Canvas, Image, loadImage } from "skia-canvas";
import unzip from "unzip-stream";

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!existsSync(__dirname + "/assets") || !statSync(__dirname + "/assets").isDirectory()) {
	if (!existsSync(__dirname + "/assets.zip")) throw new Error("assets.zip not found");
	console.log("Extracting assets.zip...");
	await new Promise<void>(res => {
		createReadStream(__dirname + "/assets.zip")
			.pipe(unzip.Extract({ path: __dirname + "/assets" }))
			.on("close", res);
	});
	console.log("Extracted assets.zip");
}

async function load(name: string) {
	return await loadImage(`${__dirname}/assets/${name}.svg`);
}

const tank = await load("tank");
const sniper = await load("sniper");
const twins = await load("twins");
const machine = await load("machine");
const flank = await load("flank");

const triple = await load("triple");
const quadTank = await load("quad-tank");
const twinFlank = await load("twin-flank");
const assassin = await load("assassin");
const overseer = await load("overseer");
const hunter = await load("hunter");
const trapper = await load("trapper");
const destroyer = await load("destroyer");
const gunner = await load("gunner");
const triangle = await load("triangle");
const auto3 = await load("auto-3");
const smasher = await load("smasher");

const triplet = await load("triplet");
const penta = await load("penta");
const spread = await load("spread");
const octoTank = await load("octo-tank");
const auto5 = await load("auto-5");
const tripleTwin = await load("triple-twin");
const battleship = await load("battleship");
const ranger = await load("ranger");
const stalker = await load("stalker");
const overlord = await load("overlord");
const necromancer = await load("necromancer");
const manager = await load("manager");
const overtrapper = await load("overtrapper");
const factory = await load("factory");
const predator = await load("predator");
const streamliner = await load("streamliner");
const triTrapper = await load("tri-trapper");
const gunnerTrapper = await load("gunner-trapper");
const megaTrapper = await load("mega-trapper");
const autoTrapper = await load("auto-trapper");
const hybrid = await load("hybrid");
const annihilator = await load("annihilator");
const skimmer = await load("skimmer");
const rocketeer = await load("rocketeer");
const glider = await load("glider");
const sprayer = await load("sprayer");
const fighter = await load("fighter");
const booster = await load("booster");
const autoGunner = await load("auto-gunner");
const landmine = await load("landmine");
const autoSmasher = await load("auto-smasher");
const spike = await load("spike");
const autoTank = await load("auto-tank");

function cast(img: Image) {
	return img as unknown as CanvasImageSource;
}

function imgToTreeOpt(img: Image, color: string) {
	return {
		image: img as unknown as CanvasImageSource,
		imageWidth: img.width,
		imageHeight: img.height,
		color,
		angle: Math.PI * 0.5
	};
}

const triep = new Triep();
triep.root.image = { src: cast(tank), width: tank.width, height: tank.height };
triep.root.angle = Math.random() * Math.PI * 2;
triep.root.scale = 2;
triep.root.addChildren(
	new Tree(imgToTreeOpt(twins, "#8efcfc"),
		new Tree(imgToTreeOpt(triple, "#8efcfc"),
			new Tree(imgToTreeOpt(triplet, "#8efcfc")),
			new Tree(imgToTreeOpt(penta, "#b0fc9a")),
			new Tree(imgToTreeOpt(spread, "#f4979a")),
		),
		new Tree(imgToTreeOpt(quadTank, "#b0fc9a"),
			new Tree(imgToTreeOpt(octoTank, "#8efcfc")),
			new Tree(imgToTreeOpt(auto5, "#b0fc9a"))
		),
		new Tree(imgToTreeOpt(twinFlank, "#f4979a"),
			new Tree(imgToTreeOpt(tripleTwin, "#8efcfc")),
			new Tree(imgToTreeOpt(battleship, "#b0fc9a"))
		),
	),
	new Tree(imgToTreeOpt(sniper, "#b0fc9a"),
		new Tree(imgToTreeOpt(assassin, "#8efcfc"),
			new Tree(imgToTreeOpt(ranger, "#8efcfc")),
			new Tree(imgToTreeOpt(stalker, "#b0fc9a"))
		),
		new Tree(imgToTreeOpt(overseer, "#b0fc9a"),
			new Tree(imgToTreeOpt(overlord, "#8efcfc")),
			new Tree(imgToTreeOpt(necromancer, "#b0fc9a")),
			new Tree(imgToTreeOpt(manager, "#f4979a")),
			new Tree(imgToTreeOpt(overtrapper, "#f4ea9a")),
			new Tree(imgToTreeOpt(battleship, "#8eb6ff")),
			new Tree(imgToTreeOpt(factory, "#b196ff")),
		),
		new Tree(imgToTreeOpt(hunter, "#f4979a"),
			new Tree(imgToTreeOpt(predator, "#8efcfc")),
			new Tree(imgToTreeOpt(streamliner, "#b0fc9a"))
		),
		new Tree(imgToTreeOpt(trapper, "#f4ea9a"),
			new Tree(imgToTreeOpt(triTrapper, "#8efcfc")),
			new Tree(imgToTreeOpt(gunnerTrapper, "#b0fc9a")),
			new Tree(imgToTreeOpt(overtrapper, "#f4979a")),
			new Tree(imgToTreeOpt(megaTrapper, "#f4ea9a")),
			new Tree(imgToTreeOpt(autoTrapper, "#8eb6ff")),
		)
	),
	new Tree(imgToTreeOpt(machine, "#f4979a"),
		new Tree(imgToTreeOpt(destroyer, "#8efcfc"),
			new Tree(imgToTreeOpt(hybrid, "#8efcfc")),
			new Tree(imgToTreeOpt(annihilator, "#b0fc9a")),
			new Tree(imgToTreeOpt(skimmer, "#f4979a")),
			new Tree(imgToTreeOpt(rocketeer, "#f4ea9a")),
			new Tree(imgToTreeOpt(glider, "#8eb6ff")),
		),
		new Tree(imgToTreeOpt(gunner, "#b0fc9a"),
			new Tree(imgToTreeOpt(autoGunner, "#8efcfc")),
			new Tree(imgToTreeOpt(gunnerTrapper, "#b0fc9a")),
			new Tree(imgToTreeOpt(streamliner, "#f4979a"))
		),
		new Tree({ skip: true },
			new Tree(imgToTreeOpt(sprayer, "#f4979a"))
		)
	),
	new Tree(imgToTreeOpt(flank, "#f4ea9a"),
		new Tree(imgToTreeOpt(triangle, "#8efcfc"),
			new Tree(imgToTreeOpt(booster, "#8efcfc")),
			new Tree(imgToTreeOpt(fighter, "#b0fc9a"))
		),
		new Tree(imgToTreeOpt(quadTank, "#b0fc9a"),
			new Tree(imgToTreeOpt(octoTank, "#8efcfc")),
			new Tree(imgToTreeOpt(auto5, "#b0fc9a"))
		),
		new Tree(imgToTreeOpt(twinFlank, "#f4979a"),
			new Tree(imgToTreeOpt(tripleTwin, "#8efcfc")),
			new Tree(imgToTreeOpt(battleship, "#b0fc9a"))
		),
		new Tree(imgToTreeOpt(auto3, "#f4ea9a"),
			new Tree(imgToTreeOpt(auto5, "#8efcfc")),
			new Tree(imgToTreeOpt(autoGunner, "#b0fc9a"))
		)
	),
	new Tree({ skip: true },
		new Tree(imgToTreeOpt(smasher, "#8eb6ff"),
			new Tree(imgToTreeOpt(landmine, "#8efcfc")),
			new Tree(imgToTreeOpt(autoSmasher, "#b0fc9a")),
			new Tree(imgToTreeOpt(spike, "#f4979a")),
		)
	),
	new Tree({ skip: true },
		new Tree({ skip: true },
			new Tree(imgToTreeOpt(autoTank, "#b196ff"))
		)
	)
);

const canvas = new Canvas(2048, 2048);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.font = "32px Arial";
triep.render(ctx as unknown as CanvasRenderingContext2D, 1024, 1024, 240, 16, -0.1);

writeFileSync("tests/diep.png", await canvas.png);