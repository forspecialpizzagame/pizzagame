export type Direction = "down" | "up" | "left" | "right"

export class Vector {
    private x: number = 0
    private y: number = 0

    constructor() {}

    get getX(): number { return this.x }
    get getY(): number { return this.y }

    public set(direction: Direction, speed: number): void {
        switch (direction) {
            case "down":
                this.y += speed
                break
            case "left":
                this.x -= speed
                break
            case "up":
                this.y -= speed
                break
            case "right":
                this.x += speed
                break
        }
    }

    public update(): void {
        this.x = 0
        this.y = 0
    }
}