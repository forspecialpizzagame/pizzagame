import { Entity } from "../entity"

export class ShopItem extends Entity {
    constructor(
        private name: string,
        private isLock: boolean,
        x: number
    ) {
        super(x, ShopItem.screen.getHeight - 160, 64, 64, 0)
    }

    get getName(): string { return this.name }
    get getIsLock(): boolean { return this.isLock }

    set setIsDisable(value: boolean) { this.isLock = value }

    public render(): void {
        ShopItem.screen.drawImage(`${this.name}-pizza`, this.x, this.y, this.width, this.height)

        if (this.isLock) {
            ShopItem.screen.drawImage("lock-pizza", this.x, this.y, this.width, this.height)
        }
    }
}