import { WidgetContext } from "../widget"

export class Button {
    private isDisable: boolean = false

    constructor(
        private widgetContext: WidgetContext,
        private callback: Function,
        private imageName: string,
        private x: number,
        private y: number,
        private width: number,
        private height: number
    ) {}

    get getX(): number { return this.x }
    get getY(): number { return this.y }
    get getWidth(): number { return this.width }
    get getHeight(): number { return this.height }
    get getImageName(): string { return this.imageName }
    get getIsDisable(): boolean { return this.isDisable }

    set setX(x: number) { this.x = x }
    set setY(y: number) { this.y = y }
    set setWidth(width: number) { this.width = width }
    set setHeight(height: number) { this.height = height }
    set setImageName(name: string) { this.imageName = name }
    set setIsDisable(value: boolean) { this.isDisable = value }

    public update(): void {
        if (!this.isDisable) {
            if (this.widgetContext.getListener.mouseUpHandler(this.x, this.y, this.width, this.height)) {
                this.callback()
            }
        }
    }

    public render(): void {
        if ((this.imageName != null) && (!this.isDisable)) {
            this.widgetContext.getScreen.drawImage(this.imageName, this.x, this.y, this.width, this.height)
        }
    }
}