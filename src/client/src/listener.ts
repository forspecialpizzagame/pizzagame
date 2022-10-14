interface KeyList {
    [key: string]: boolean
}

interface Mouse {
    x: number
    y: number
    isDown: boolean
    isUp: boolean
    isPress: boolean
}

interface Touch {
    x: number
    y: number
    isPress: boolean
}

export class Listener {
    private keyList: KeyList = {}
    private mouse: Mouse = {
        x: 0, y: 0,
        isDown: false, isUp: false,
        isPress: false
    }
    private touch: Touch = {
        x: 0, y: 0,
        isPress: false
    }

    private scaleX: number = 1
    private scaleY: number = 1
    private offsetX: number = 0

    constructor(
        private width: number,
        private height: number
    ) {
        this.updateScale()

        window.addEventListener("resize", (e: UIEvent) => this.updateScale())

        window.addEventListener("keydown", (e: KeyboardEvent) => this.keyList[e.key.toLowerCase()] = true)
        window.addEventListener("keyup", (e: KeyboardEvent) => this.keyList[e.key.toLowerCase()] = false)

        window.addEventListener("contextmenu", (e: MouseEvent) => e.preventDefault())
        window.addEventListener("mousedown", (e: MouseEvent) => this.mouseHandler(e))
        window.addEventListener("mouseup", (e: MouseEvent) => this.mouseHandler(e))
        window.addEventListener("mousemove", (e: MouseEvent) => this.mouseHandler(e))

        window.addEventListener("touchstart", (e: TouchEvent) => this.touchHandler(e))
        window.addEventListener("touchend", (e: TouchEvent) => this.touchHandler(e))
        window.addEventListener("touchmove", (e: TouchEvent) => this.touchHandler(e))
    }

    get getMouseX(): number { return this.mouse.x }
    get getMouseY(): number { return this.mouse.y }
    get getMouseIsDown(): boolean { return this.mouse.isDown }
    get getMouseIsUp(): boolean { return this.mouse.isUp }
    get getMouseIsPress(): boolean { return this.mouse.isPress }
    get getWidth(): number { return this.width }
    get getHeight(): number { return this.height }

    public update(): void {
        this.mouse.isDown = false
        this.mouse.isUp = false
    }

    public keyPressHandler(key: string): boolean {
        if (key.toLowerCase() == "space") {
            return this.keyList[" "]
        }

        return this.keyList[key.toLowerCase()]
    }

    public mouseHoverHandler(x: number, y: number, width: number, height: number): boolean {
        return (
            (this.mouse.x >= (x * this.scaleX + this.offsetX)) && (this.mouse.x <= (x * this.scaleX + width * this.scaleX + this.offsetX)) && 
            (this.mouse.y >= (y * this.scaleY)) && (this.mouse.y <= (y * this.scaleY + height * this.scaleY))
        )
    }

    public mouseDownHandler(x: number, y: number, width: number, height: number): boolean {
        if (this.mouse.isDown) {
            return this.mouseHoverHandler(x, y, width, height)
        }

        return false
    }

    public mouseUpHandler(x: number, y: number, width: number, height: number): boolean {
        if (this.mouse.isUp) {
            return this.mouseHoverHandler(x, y, width, height)
        }

        return false
    }

    public mousePressHandler(x: number, y: number, width: number, height: number): boolean {
        if (this.mouse.isPress) {
            return this.mouseHoverHandler(x, y, width, height)
        }

        return false
    }

    public touchPressHandler(x: number, y: number, width: number, height: number): boolean {
        if (this.touch.isPress) {
            return (
                (this.touch.x >= (x * this.scaleX + this.offsetX)) && (this.touch.x <= (x * this.scaleX + width * this.scaleX + this.offsetX)) && 
                (this.touch.y >= (y * this.scaleY)) && (this.touch.y <= (y * this.scaleY + height * this.scaleY))
            )
        }

        return false
    }

    private updateScale(): void {
        this.scaleX = (document.querySelector("#app").clientWidth >= 512 ? 512 : document.querySelector("#app").clientWidth) / this.width
        this.scaleY = document.querySelector("#app").clientHeight / this.height
    
        this.offsetX = document.querySelector("#app > canvas").getBoundingClientRect().left
    }

    private mouseHandler(e: MouseEvent): void {
        this.mouse.x = e.pageX
        this.mouse.y = e.pageY

        if (e.type == "mousedown") {
            this.mouse.isDown = true
            this.mouse.isUp = false
            this.mouse.isPress = true
        } else if (e.type == "mouseup") {
            this.mouse.isDown = false
            this.mouse.isUp = true
            this.mouse.isPress = false
        }
    }

    private touchHandler(e: TouchEvent): void {
        if (e.type != "touchend") {
            this.touch.x = e.targetTouches[e.targetTouches.length - 1].pageX
            this.touch.y = e.targetTouches[e.targetTouches.length - 1].pageY
        }
        
        if (e.type == "touchstart") {
            this.touch.isPress = true
        } else if (e.type == "touchend") {
            if (e.targetTouches.length == 0) {
                this.touch.isPress = false
            }
        }
    }
}