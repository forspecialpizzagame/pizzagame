import { Animation } from "../animation"
import { range } from "../math"
import { Scene } from "../scene"
import { Button } from "../widgets/button"

export class MenuScene extends Scene {
    private shopButton: Button = new Button(this.widgetContext, () => this.stop("shop"), "shop-button", 8, this.screen.getHeight - 160, 64, 64)

    private settingsButton: Button = new Button(this.widgetContext, () => this.stop("settings"), "settings-button", this.screen.getWidth - 32, 0, 32, 32)
    private leaderboardButton: Button = new Button(this.widgetContext, () => this.stop("leaderboard"), "leaderboard-button", this.screen.getWidth - 64, 0, 32, 32)

    private buttonsAnimation: Animation = new Animation(0, -32, 250)
    private hudAnimation: Animation = new Animation(0, 32, 250)
    
    private shopButtonAnimation: Animation = new Animation(8, -72, 250)

    private clickAnimation: Animation = new Animation(1, -1, 250)

    public init(): void {
        this.buttonsAnimation.reset()
        this.hudAnimation.reset()
        this.shopButtonAnimation.reset()
        this.clickAnimation.reset()
    }

    public update(currentTime: number): void {
        super.update(currentTime)

        this.shopButton.update()

        this.settingsButton.update()
        this.leaderboardButton.update()

        if (this.listener.getMouseIsUp && this.getNextSceneName == "") {
            if (!this.buttonsAnimation.getIsWorking) {
                this.buttonsAnimation.run()
                this.hudAnimation.run()
                this.shopButtonAnimation.run()
                this.clickAnimation.run()

                this.stop("level", 250)
            }
        }
    }

    public render(currentTime: number): void {
        this.buttonsAnimation.update(currentTime)
        this.hudAnimation.update(currentTime)

        this.shopButtonAnimation.update(currentTime)

        this.clickAnimation.update(currentTime)

        this.drawBackground("background")

        this.screen.drawImage("box", this.screen.getWidth / 2 - 36, this.screen.getHeight - 92 - 48, 72, 72)

        range(3).forEach((i: number) => this.screen.drawImage("heart", i * 32, -32 + this.hudAnimation.getCurrentValue, 32, 32))

        this.screen.setColor = "white"
        this.screen.drawImage("trophy", 0, this.hudAnimation.getCurrentValue, 32, 32)
        this.screen.print(this.storage.highscore.toString(), 32, this.hudAnimation.getCurrentValue, 32)
        this.screen.drawImage("money", 0, 26 + this.hudAnimation.getCurrentValue, 32, 32)
        this.screen.print(this.storage.money.toString(), 32, 26 + this.hudAnimation.getCurrentValue, 32)

        this.shopButton.setX = this.shopButtonAnimation.getCurrentValue

        this.settingsButton.setY = this.buttonsAnimation.getCurrentValue
        this.leaderboardButton.setY = this.buttonsAnimation.getCurrentValue

        this.shopButton.render()

        this.settingsButton.render()
        this.leaderboardButton.render()

        this.screen.setColor = "white"
        this.screen.setAlpha = this.clickAnimation.getCurrentValue
        this.screen.print(this.language.getText("click"), this.screen.getWidth / 2, this.screen.getHeight / 2 - 56, 40, "center")
    }
}