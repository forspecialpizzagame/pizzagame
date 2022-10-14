import { ImageList } from "./image-loader"

type PlayerDataLoadStatus = boolean | "error"

export class Screen {
    private canvas: HTMLCanvasElement = null
    private context: CanvasRenderingContext2D = null

    private imageList: ImageList = {}
    private isImageListLoaded: boolean = false

    private isPlayerDataLoaded: PlayerDataLoadStatus = false

    private fontName: string = "old-pixel"

    constructor(
        private width: number,
        private height: number
    ) {
        this.canvas = document.createElement("canvas")
        this.canvas.width = document.querySelector("#app").clientWidth
        this.canvas.height = document.querySelector("#app").clientHeight
        this.canvas.style.backgroundColor = "silver"
        document.querySelector("#app").appendChild(this.canvas)

        window.addEventListener("resize", (e: UIEvent) => this.updateCanvas())

        this.context = this.canvas.getContext("2d")
        this.updateCanvas()
    }

    get getWidth(): number { return this.width }
    get getHeight(): number { return this.height }
    get getIsImageListLoaded(): boolean { return this.isImageListLoaded }
    get getIsDataPlayerLoaded(): PlayerDataLoadStatus { return this.isPlayerDataLoaded }

    set setImageList(imageList: ImageList) { this.imageList = Object.assign({}, this.imageList, imageList) }
    set setIsImageListLoaded(value: boolean) { this.isImageListLoaded = value }
    set setIsPlayerDataLoaded(value: PlayerDataLoadStatus) { this.isPlayerDataLoaded = value }
    set setColor(color: string) { this.context.fillStyle = color }
    set setAlpha(alpha: number) { this.context.globalAlpha = alpha }

    public clear(): void {
        this.context.restore()
        this.context.save()
        this.context.scale(this.canvas.width / this.width, this.canvas.height / this.height)
        this.context.clearRect(0, 0, this.width, this.height)
    }

    public fill(x: number, y: number, width: number, height: number): void {
        this.context.fillRect(x, y, width, height)
    }

    public print(text: string, x: number, y: number, fontSize: number, align: CanvasTextAlign = "left"): void {
        this.context.textAlign = align
        this.context.font = `${fontSize}px ${this.fontName}`
        this.context.fillText(text, x, y)
    }

    public drawImage(name: string, x: number, y: number, width: number, height: number): void {
        try {
            this.context.drawImage(this.imageList[name], x, y, width, height)
        } catch (err: unknown) {
            this.drawDebugTexture(x, y, width, height)
        }
    }

    public drawSprite(name: string, sx: number, sy: number, swidth: number, sheight: number, x: number, y: number, width: number, height: number): void {
        try {
            this.context.drawImage(this.imageList[name], sx, sy, swidth, sheight, x, y, width, height)
        } catch (err: unknown) {
            this.drawDebugTexture(x, y, width, height)
        }
    }

    public getTextWidth(text: string, fontSize: number): number {
        this.context.font = `${fontSize}px ${this.fontName}`
        return Math.round(this.context.measureText(text).width)
    }

    public getShortScore(score: number): string {
        if (score >= 1000) {
            return `${Math.trunc(score / 1000)}.${score.toString()[score.toString().length - 3]}k`
        }

        return score.toString()
    }

    private updateCanvas(): void {
        this.canvas.width = (document.querySelector("#app").clientWidth >= 512 ? 512 : document.querySelector("#app").clientWidth)
        this.canvas.height = document.querySelector("#app").clientHeight

        this.context.textBaseline = "top"
        this.context.textAlign = "left"
        this.context.font = `16px ${this.fontName}`
        this.context.imageSmoothingEnabled = false
    }

    private drawDebugTexture(x: number, y: number, width: number, height: number): void {
        this.context.fillStyle = "black"
        this.context.fillRect(x, y, width / 2, height / 2)
        this.context.fillRect(x + width / 2, y + height / 2, width / 2, height / 2)
        this.context.fillStyle = "magenta"
        this.context.fillRect(x + width / 2, y, width / 2, height / 2)
        this.context.fillRect(x, y + height / 2, width / 2, height / 2)
    }
}