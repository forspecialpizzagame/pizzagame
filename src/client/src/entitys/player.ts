import { Animation } from "../animation"
import { Entity } from "../entity"
import { Listener } from "../listener"
import { Timer } from "../timer"

type IconName = "ice" | "x"

interface Icon {
    animation: Animation
    timer: Timer
}

type IconList = { [key: string]: Icon }

export class Player extends Entity {
    private health: number = 3
    private isFrozen: boolean = false
    private isHasX: boolean = false
    private isHasShield: boolean = false

    private timerOfFreeze: Timer = new Timer(3000, false, () => this.unfreeze())
    private timerOfX: Timer = new Timer(15000, false, () => this.unX())

    private iconList: IconList = {
        "ice": {
            animation: new Animation(0, 56, 500, "unpow", 5),
            timer: this.timerOfFreeze
        },
        "x": {
            animation: new Animation(0, 56, 500, "unpow", 5),
            timer: this.timerOfX
        }
    }
    private activeIconList: Set<string> = new Set()
    
    constructor(
        private listener: Listener
    ) {
        super(0, 0, 72, 24, 240)
    }

    get getHealth(): number { return this.health }
    get getIsFrozen(): boolean { return this.isFrozen }
    get getIsHasX(): boolean { return this.isHasX }
    get getIsHasShield(): boolean { return this.isHasShield }

    set setHealth(count: number) { this.health = count }
    set setIsHasX(value: boolean) { this.isHasX = value }
    set setIsHasShield(value: boolean) { this.isHasShield = value }

    public clearIconList(): void {
        this.activeIconList = new Set()
    }

    public freeze(): void {
        this.isFrozen = true
        this.speed = 100
        this.addIcon("ice")
        this.timerOfFreeze.run()
    }

    public unfreeze(): void {
        this.isFrozen = false
        this.speed = 240
        this.removeIcon("ice")
    }

    public onX(): void {
        this.isHasX = true
        this.addIcon("x")
        this.timerOfX.run()
    }

    public unX(): void {
        this.isHasX = false
        this.removeIcon("x")
    }

    public update(currentTime: number): void {
        super.update(currentTime)

        if (
            this.listener.keyPressHandler("arrowleft") ||
            this.listener.touchPressHandler(0, 0, this.listener.getWidth / 2, this.listener.getHeight)
        ) {
            this.move("left")
        }

        if (
            this.listener.keyPressHandler("arrowright") ||
            this.listener.touchPressHandler(this.listener.getWidth / 2, 32, this.listener.getWidth / 2, this.listener.getHeight)
        ) {
            this.move("right")
        }

        this.timerOfFreeze.update(currentTime)
        this.timerOfX.update(currentTime)
    }

    public render(): void {    
        Player.screen.drawImage("box", this.x, this.y - 48, 72, 72)
    
        if (this.isFrozen) {
            Player.screen.drawImage("ice-box", this.x, this.y - 48, 72, 72)
        }
    }

    public renderIconList(currentTime: number): void {
        let i: number = 0

        this.activeIconList.forEach((name: IconName) => {
            this.iconList[name].animation.update(currentTime)
            Player.screen.drawImage(`${name}-icon`, this.iconList[name].animation.getCurrentValue - 56, 96 + Number(i) * 48 + Number(i) * 4, 56, 48)
            Player.screen.setColor = "white"
            Player.screen.drawSprite("icon-line", 0, 0, 13 - (this.iconList[name].timer.getDeltaTime * 100 / this.iconList[name].timer.getUpdateTime) / 100 * 13, 1,
                this.iconList[name].animation.getCurrentValue - 56, 96 + i * 48 + i * 4 + 40,
                52 - (this.iconList[name].timer.getDeltaTime * 100 / this.iconList[name].timer.getUpdateTime) / 100 * 52, 4)
            
            i += 1
        })
    }

    private addIcon(name: IconName): void {
        if (!this.activeIconList.has(name)) {
            this.activeIconList.add(name)
            this.iconList[name].animation.run()
        }
    }

    private removeIcon(name: IconName): void {
        this.activeIconList.delete(name)
    }
}