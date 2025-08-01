export class Tree {
	children: Tree[];
	private parent?: Tree;
	private _depth = 1;
	private _leaves = 1;

	// Determines what to draw
	skip: boolean;
	text?: string;
	image?: { src: CanvasImageSource, width?: number, height?: number };
	color?: string;
	// Determins how to draw
	angle: number;
	scale: number;
	downwards: boolean;

	constructor(options?: { skip?: boolean, text?: string, image?: CanvasImageSource, imageWidth?: number, imageHeight?: number, color?: string, angle?: number, scale?: number, downwards?: boolean }, ...children: Tree[]) {
		this.children = children;
		if (children.length) {
			this.updateDepth();
			this.updateLeaves();
		}
		this.skip = options?.skip || false;
		this.text = options?.text;
		this.image = options?.image ? { src: options.image, width: options.imageWidth, height: options.imageHeight } : undefined;
		this.color = options?.color;
		this.angle = options?.angle || 0;
		this.scale = options?.scale || 1;
		this.downwards = options?.downwards || false;
	}

	addChildren(...children: Tree[]) {
		children.forEach(child => {
			child.parent = this;
			this.children.push(child);
		});
		this.updateDepth();
		this.updateLeaves();
		if (this.parent) {
			this.parent.updateDepth();
			this.parent.updateLeaves();
		}
		return this;
	}

	private updateDepth() {
		this._depth = 1 + Math.max(...this.children.map(child => child.depth));
	}

	private updateLeaves() {
		if (!this.children.length) this._leaves = 1;
		else this._leaves = this.children.map(child => child.leaves).reduce((a, b) => a + b);
	}

	get depth() {
		return this._depth;
	}

	get leaves() {
		return this._leaves;
	}
}

export class Triep {
	root: Tree;

	constructor() {
		this.root = new Tree();
	}

	private strokeAngleOffset(radius: number, stroke: number) {
		return stroke * 0.5 / radius;
	}

	/**
	 * Renders the tree node. This assumes the canvas is pre-transformed
	 * @param ctx A CanvasRenderingContext2D obtainable from canvas.getContext("2d")
	 */
	private renderTree(ctx: CanvasRenderingContext2D, tree: Tree) {
		if (!tree.text && !tree.image) return;
		ctx.rotate(tree.angle);
		ctx.scale(tree.scale, tree.scale);
		if (tree.image) ctx.drawImage(tree.image.src, -(tree.image.width || 0) * 0.5, -(tree.image.height || 0) * 0.5);
		else if (tree.text) ctx.fillText(tree.text, 0, 0);
	}

	/**
	 * Render the diep.io tree
	 * @param ctx A CanvasRenderingContext2D obtainable from canvas.getContext("2d")
	 * @param x The x-center of the tree circle
	 * @param y The y-center of the tree circle
	 * @param radius The LAYER radius (i.e. how thick each layer will be). This can be an array, with elements indicating the thickness of each layer
	 * @param stroke Stroke width between layers
	 */
	render(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number | number[], stroke: number, angle = 0) {
		let depth = this.root.depth;
		if (typeof radius == "number")
			radius = Array(depth).fill(radius);
		else if (radius.length < depth) {
			if (!radius.length) throw new Error("The radius array must have at least 1 element");
			radius.push(...Array(depth - radius.length).fill(radius[radius.length - 1]));
		}
		// draw background (stroke) circle
		const fillStyle: string | CanvasGradient | CanvasPattern = ctx.fillStyle;
		if (this.root.color) ctx.fillStyle = this.root.color;
		else ctx.fillStyle = "#5b6366";
		ctx.beginPath();
		const outerRadius = radius.slice(0, depth).reduce((a, b) => a + b);
		ctx.arc(x, y, outerRadius + stroke * depth, 0, Math.PI * 2, false);
		ctx.arc(x, y, radius[0], 0, Math.PI * 2, true);
		ctx.fill();
		ctx.fillStyle = fillStyle;

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.translate(x, y);
		this.renderTree(ctx, this.root);
		ctx.resetTransform();

		let children = this.root.children;
		const maxDepth = depth + 1;
		while (depth >= 2) {
			const maxLeaves = children.map(child => child.leaves).reduce((a, b) => a + b);
			let startAngle = angle;
			const nextLayer: Tree[] = [];
			for (const child of children) {
				const angleSize = child.leaves * Math.PI * 2 / maxLeaves;
				if (!child.skip) {
					ctx.beginPath();
					const outerRadius = radius.slice(0, maxDepth - depth + 1).reduce((a, b) => a + b) + stroke * (maxDepth - depth);
					const offsetA = this.strokeAngleOffset(outerRadius, stroke);
					ctx.arc(x, y, outerRadius, startAngle + offsetA, (startAngle + angleSize) - offsetA);
					const innerRadius = radius.slice(0, maxDepth - depth).reduce((a, b) => a + b) + stroke * (maxDepth - depth);
					const offsetB = this.strokeAngleOffset(innerRadius, stroke);
					ctx.arc(x, y, innerRadius, (startAngle + angleSize) - offsetB, startAngle + offsetB, true);
					const fillStyle: string | CanvasGradient | CanvasPattern = ctx.fillStyle;
					ctx.fillStyle = child.color || `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0")}`;
					ctx.fill();

					ctx.fillStyle = fillStyle;
					ctx.translate(x, y);
					ctx.rotate(startAngle + angleSize * 0.5 - Math.PI * 0.5);
					ctx.translate(0, innerRadius + (outerRadius - innerRadius) * 0.5);
					if (child.downwards) ctx.rotate(-startAngle - angleSize * 0.5 + Math.PI * 0.5)
					this.renderTree(ctx, child);
					ctx.resetTransform();
				}

				startAngle += angleSize;
				if (depth > 2 && !child.children.length) nextLayer.push(new Tree({ skip: true }));
				else nextLayer.push(...child.children);
			}
			children = nextLayer;
			depth--;
		}
	}
}