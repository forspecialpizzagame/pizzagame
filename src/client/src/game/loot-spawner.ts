import { Loot } from "../entitys/loot"
import { Config, Storage } from "../main"
import { random } from "../math"
import { Timer } from "../timer"
import { PizzaListJSON } from "../widgets/slider"

export class LootSpawner {
    private timer: Timer = new Timer(2000, true, () => this.updateTimer())
    private lootList: Loot[] = []
    
    constructor(
        private storage: Storage,
        private config: Config
    ) {}

    get getLootList(): Loot[] { return this.lootList }
    get getUpdateTime(): number { return this.timer.getUpdateTime }
    get getIsWorking(): boolean { return this.timer.getIsWorking }

    public deleteLootByIndex(i: number): void {
        this.lootList.splice(i, 1)
    }

    public run(): void {        
        this.lootList = []

        this.timer.setUpdateTime = 2000
        this.timer.run()
    }

    public stop(): void {
        this.timer.stop()
    }

    public update(currentTime: number): void {
        this.timer.update(currentTime)
    }

    public spawn(name: string, x: number, y: number): void {
        this.lootList.push(new Loot(name, x, y))
    }
    
    private updateTimer(): void {
        if (this.timer.getUpdateTime > 400) {
            this.timer.setUpdateTime = this.timer.getUpdateTime - 20
        }

        let percent: number = random(1, 1000),
            name: string

        switch (true) {
            case (percent <= 700):
                name = this.getPizzaName(this.config.pizzaList, false)
                break
            case (percent > 700) && (percent <= 900):
                name = "rotten-pizza"
                break
            case (percent > 900) && (percent <= 960):
                name = "ice"
                break
            case (percent > 960) && (percent <= 980):
                name = "x"
                break
            case (percent > 980) && (percent <= 990):
                name = "big-money"
                break
            case (percent > 990) && (percent <= 999):
                name = "totem"
                break
            case (percent == 1000):
                let pizzaName: string = this.getPizzaName(this.config.crystalPizzaList, true)

                if (pizzaName == null) {
                    name = "totem"
                } else {
                    name = pizzaName
                }
                break
            default:
                name = "pepperoni-pizza"
        }

        this.spawn(name, random(0, 192), -64)
    }

    private getPizzaName(json: PizzaListJSON, isBackward: boolean): string {
        let name: string,
            list: string[] = []

        for (name in json) {
            if (this.storage.pizzaList[name]) {
                if (!isBackward) {
                    list.push(name)
                }
            } else if (isBackward) {
                list.push(name)
            }
        }

        if (list.length != 0) {
            return `${list[random(0, list.length - 1)]}-pizza`
        } else {
            return null
        }
    }
}