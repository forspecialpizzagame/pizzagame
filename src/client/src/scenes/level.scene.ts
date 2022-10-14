import { Animation, SpriteAnimation } from "../animation"
import { Loot } from "../entitys/loot"
import { Player } from "../entitys/player"
import { LootSpawner } from "../game/loot-spawner"
import { random, range } from "../math"
import { Scene } from "../scene"
import { Timer } from "../timer"
import { Button } from "../widgets/button"
import { sendRequest } from "../xml"

export class LevelScene extends Scene {
    private player: Player = new Player(this.listener)

    private lootSpawner: LootSpawner = new LootSpawner(this.storage, this.config)

    private isPause: boolean
    private pauseButton: Button = new Button(this.widgetContext, () => this.pause(), "pause-button", this.screen.getWidth - 32, 0, 32, 32)
    private continueButton: Button = new Button(this.widgetContext, () => this.unpause(), "continue-button", this.screen.getWidth / 2 - 64 - 8, this.screen.getHeight / 2 - 32, 64, 64)
    private homeButton: Button = new Button(this.widgetContext, () => this.exit(), "home-button", this.screen.getWidth / 2 + 8, this.continueButton.getY, 64, 64)

    private bufferTime: number
    private lastTime: number

    private score: number = 0
    private scoreTimer: Timer = new Timer(10, true, () => this.score += 1)

    private smellAnimation: SpriteAnimation = new SpriteAnimation([0, 1, 2], 150)
    private bigMoneyAnimation: SpriteAnimation = new SpriteAnimation([0, 1, 2, 3, 4, 5, 6, 7], 100)

    private pauseButtonAnimation: Animation = new Animation(-32, 32, 250)

    public init(): void {
        this.pauseButton.setIsDisable = false
        this.continueButton.setIsDisable = true
        this.homeButton.setIsDisable = true

        this.player.setX = this.screen.getWidth / 2 - this.player.getWidth / 2
        this.player.setY = this.screen.getHeight - 92
        
        this.player.setLastTime = 0
        this.player.setHealth = 3
        this.player.setIsHasX = false
        this.player.setIsHasShield = false
        this.player.unfreeze()
        this.player.clearIconList()

        this.lootSpawner.run()

        this.score = 0
        this.scoreTimer.run()

        this.smellAnimation.run()
        this.bigMoneyAnimation.run()

        this.pauseButtonAnimation.run()

        this.isPause = false
        this.bufferTime = 0
        this.lastTime = 0
    }
    
    public update(currentTime: number): void {
        this.pauseButton.update()
        this.continueButton.update()
        this.homeButton.update()
        
        if (this.isPause) {
            if (this.lastTime == 0) {
                this.lastTime = currentTime
            }

            this.bufferTime += currentTime - this.lastTime
            this.lastTime = currentTime
        } else {
            if (this.listener.keyPressHandler("space")) {
                this.pause()
            }

            this.updatePlayer(currentTime - this.bufferTime)
            this.updateLootList(currentTime - this.bufferTime)
    
            this.lootSpawner.update(currentTime - this.bufferTime)

            this.scoreTimer.update(currentTime - this.bufferTime)
        }
    }

    public render(currentTime: number): void {
        this.smellAnimation.update(currentTime)
        this.bigMoneyAnimation.update(currentTime)

        this.pauseButtonAnimation.update(currentTime)

        this.drawBackground("background")

        this.player.render()
        this.lootSpawner.getLootList.forEach((loot: Loot) => {
            loot.render()

            if (loot.getName == "rotten-pizza") {
                this.screen.drawSprite("smell-animation", this.smellAnimation.getCurrentFrame * 16, 0, 16, 32, loot.getX, loot.getY - 48, 64, 128)
            } else if (loot.getName == "big-money") {
                this.screen.drawSprite("big-money-animation", this.bigMoneyAnimation.getCurrentFrame * 16, 0, 16, 16, loot.getX, loot.getY, 64, 64)
            }
        })

        range(3).forEach((i: number) => this.screen.drawImage("dead-heart", i * 32, 0, 32, 32))
        range(this.player.getHealth).forEach((i: number) => this.screen.drawImage(`${this.player.getIsHasShield ? "gold-heart" : "heart"}`, i * 32, 0, 32, 32))

        this.screen.setColor = "white"
        this.screen.drawImage("trophy", 0, 32, 32, 32)

        if (this.storage.highscore > this.score) {
            this.screen.print(`${this.screen.getShortScore(this.storage.highscore)} / ${this.screen.getShortScore(this.score)}`, 32, 32, 32)
        } else {
            this.screen.print(`${this.screen.getShortScore(this.score)}`, 32, 32, 32)
        }

        this.screen.drawImage("money", 0, 58, 32, 32)
        this.screen.print(this.storage.money.toString(), 32, 58, 32)

        this.player.renderIconList(currentTime)

        this.pauseButton.setY = this.pauseButtonAnimation.getCurrentValue
        this.pauseButton.render()
        this.continueButton.render()
        this.homeButton.render()
    }

    private pause(): void {
        this.isPause = true
        
        this.pauseButton.setIsDisable = true
        this.continueButton.setIsDisable = false
        this.homeButton.setIsDisable = false
    }

    private unpause(): void {
        this.isPause = false
        this.lastTime = 0

        this.pauseButton.setIsDisable = false
        this.continueButton.setIsDisable = true
        this.homeButton.setIsDisable = true
    }

    private exit(): void {
        if (this.storage.highscore < this.score) {
            this.storage.highscore = this.score
        }

        sendRequest("/api/updateplayer", "POST", {
            money: this.storage.money,
            highscore: this.storage.highscore
        })
            .then(() => console.log("Player data updated - OK"))
            .catch(() => console.log("Player data updated - ERROR"))

        this.stop("menu")
    }

    private updatePlayer(currentTime: number): void {
        this.player.update(currentTime)

        if (this.player.getHealth <= 0) {
            this.exit()
        }

        if (this.player.getX <= 0) {
            this.player.setX = 0
        } else if ((this.player.getX + this.player.getWidth) >= this.screen.getWidth) {
            this.player.setX = this.screen.getWidth - this.player.getWidth
        }
    }

    private updateLootList(currentTime: number): void {
        this.lootSpawner.getLootList.forEach((loot: Loot, i: number) => {
            if (this.player.detect(loot)) {
                switch (loot.getName) {
                    case "rotten-pizza":
                        if (this.player.getIsFrozen) {
                            this.player.unfreeze()
                        }

                        this.player.getIsHasShield ? this.player.setIsHasShield = false : this.player.setHealth = this.player.getHealth - 1
                        break
                    case "ice":
                        this.player.freeze()
                        break
                    case "x":
                        this.player.onX()
                        break
                    case "big-money":
                        this.storage.money += [10, 20, 30][random(0, 2)]
                        break
                    case "totem":
                        if (this.player.getIsHasShield) {
                            this.storage.money += 3
                        }

                        this.player.setIsHasShield = true
                        break
                    default:
                        if (this.config.crystalPizzaList[loot.getName.split("-")[0]] != undefined) {
                            this.storage.pizzaList[loot.getName.split("-")[0]] = true
                            this.storage.money += 10

                            sendRequest("/api/buypizza", "POST", { pizzaName: loot.getName.split("-")[0] })
                                .then(() => console.log(`Crystal pizza ${loot.getName.split("-")[0]} unlocked`))
                                .catch(() => console.log(`Crystal pizza ${loot.getName.split("-")[0]} did not unlock`))
                        }

                        this.player.getIsHasX ? this.storage.money += 2 : this.storage.money += 1
                }

                this.lootSpawner.deleteLootByIndex(i)
            } else if (loot.getY >= this.screen.getHeight) {
                this.lootSpawner.deleteLootByIndex(i)
            }
                
            loot.update(currentTime)
        })
    }
}