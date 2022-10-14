import { WidgetContext } from "../widget"

export class Text {
    private lines: string[] = []

    constructor(
        private widgetContext: WidgetContext,
        private text: string,
        private x: number,
        private y: number,
        private fontSize: number
    ) {
        this.lines[0] = this.text
    }

    get getText(): string { return this.text }
    get getX(): number { return this.x }
    get getY(): number { return this.y }
    get getFontSize(): number { return this.fontSize }

    set setX(x: number) { this.x = x }
    set setY(y: number) { this.y = y }

    public setColumnWidth(width: number): Text {
        let line: string = "",
            words: string[] = this.text.split(" ")

        this.lines = []

        words.forEach((word: string) => {
            if (this.widgetContext.getScreen.getTextWidth(line + word, this.fontSize) >= width) {
                this.lines.push(line)
                line = word + " "
            } else {
                line += word + " "
            }
        })

        this.lines.push(line)

        return this
    }

    public render(): void {
        this.lines.forEach((line: string, i: number) => this.widgetContext.getScreen.print(line, this.x, this.y + (i * this.fontSize * 0.7), this.fontSize))
    }
}