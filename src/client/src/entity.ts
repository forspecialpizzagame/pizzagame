import { Screen } from "./screen"
import { Direction, Vector } from "./vector"

export class Entity {
    protected static screen: Screen

    private velocity: Vector = new Vector()
    private lastTime: number = 0

    constructor(
        protected x: number,
        protected y: number,
        protected width: number,
        protected height: number,
        protected speed: number
    ) {}

    static set setScreen(screen: Screen) { Entity.screen = screen }

    get getX(): number { return this.x }
    get getY(): number { return this.y }
    get getWidth(): number { return this.width }
    get getHeight(): number { return this.height }
    get getSpeed(): number { return this.speed }

    set setX(x: number) { this.x = x }
    set setY(y: number) { this.y = y }
    set setWidth(width: number) { this.width = width }
    set setHeight(height: number) { this.height = height }
    set setSpeed(speed: number) { this.speed = speed }
    set setLastTime(time: number) { this.lastTime = time }

    public move(direction: Direction): void {
        this.velocity.set(direction, this.speed)
    }

    public detect(entity: Entity): boolean {
        return (
            ((this.x + this.width) >= entity.getX) && (this.x <= (entity.getX + entity.getWidth)) &&
            ((this.y + this.height) >= entity.getY) && (this.y <= (entity.getY + entity.getHeight))
        )
    }

    public update(currentTime: number): void {
        if (this.lastTime == 0) {
            this.lastTime = currentTime
        }

        this.x += this.velocity.getX * ((currentTime - this.lastTime) / 1000)
        this.y += this.velocity.getY * ((currentTime - this.lastTime) / 1000)

        this.velocity.update()
        this.lastTime = currentTime
    }

    public render(): void {
        
    }
}