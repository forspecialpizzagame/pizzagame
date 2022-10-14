import { Animation, SpriteAnimation } from "../animation"
import { Scene } from "../scene"

export class SecretRoomScene extends Scene {
    private spiceAnimation: SpriteAnimation = new SpriteAnimation([0, 1, 2], 150)

    public init(): void {
        this.spiceAnimation.run()
    }

    public update(currentTime: number): void {
        if (this.listener.getMouseIsUp) {
            this.stop("settings")
        }
    }

    public render(currentTime: number): void {
        this.spiceAnimation.update(currentTime)
        
        this.drawBackground("background-3")

        this.screen.drawImage("shop-icon", 0, 0, 56, 48)
        this.screen.drawImage("language-icon", 0, 64, 64, 64)
        this.screen.drawImage("casino-icon", 0, 128, 64, 64)

        this.screen.drawImage("checkbox-button", 0, 192, 48, 48)
        this.screen.drawImage("checkbox-fill-button", 0, 256 - 24, 48, 48)

        this.screen.drawImage("spice-box", this.screen.getWidth / 2 - 72 - 4, this.screen.getHeight - 92 - 48, 72, 72)
        this.screen.drawImage("rotten-box", this.screen.getWidth / 2 + 4, this.screen.getHeight - 92 - 48, 72, 72)
        this.screen.drawSprite("spice-animation", this.spiceAnimation.getCurrentFrame * 16, 0, 16, 32, this.screen.getWidth / 2 - 72 - 4 + 4, this.screen.getHeight - 92 - 48 - 24, 64, 128)

        this.screen.drawImage("cola", this.screen.getWidth / 2 - 64 - 4, this.screen.getHeight / 2 - 64 - 4, 64, 64)
        this.screen.drawImage("old-carbonara-pizza", this.screen.getWidth / 2 + 4, this.screen.getHeight / 2 - 64 - 4, 64, 64)
        this.screen.drawImage("casino-pizza", this.screen.getWidth / 2 - 64 - 4, this.screen.getHeight / 2 + 4, 64, 64)
        this.screen.drawImage("money-bag", this.screen.getWidth / 2 + 4, this.screen.getHeight / 2 + 4, 64, 64)

        this.screen.drawImage("youtube-button", this.screen.getWidth / 2 - 32, 4, 64, 64)
    }
}