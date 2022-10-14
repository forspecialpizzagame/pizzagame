import { Entity } from "../entity"

export class Loot extends Entity {
    constructor(
        private name: string,
        x: number,
        y: number
    ) {
        super(x, y, 64, 64, 300)
    }

    get getName(): string { return this.name }

    public update(currentTime: number): void {
        super.update(currentTime)

        this.move("down")
    }

    public render(): void {
        Loot.screen.drawImage(this.name, this.x, this.y, this.width, this.height)
    }
}