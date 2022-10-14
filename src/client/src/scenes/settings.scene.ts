import { Scene } from "../scene"
import { Button } from "../widgets/button"
import { sendRequest } from "../xml"

export class SettingsScene extends Scene {
    private homeButton: Button = new Button(this.widgetContext, () => this.stop("menu"), "home-button", this.screen.getWidth / 2 - 32, this.screen.getHeight / 2 - 64 - 4, 64, 64)
    private languageButton: Button = new Button(this.widgetContext, () => this.stop("language-room"), "language-button", this.homeButton.getX - 64 - 8, this.homeButton.getY, 64, 64)
    private fullscreenButton: Button = new Button(this.widgetContext, () => this.fullscreen(), "fullscreen-on-button", this.homeButton.getX + 64 + 8, this.homeButton.getY, 64, 64)
    private telegramButton: Button = new Button(this.widgetContext, () => window.open("https://t.me/addstickers/pizzagame"), "telegram-button", this.homeButton.getX, this.homeButton.getY + 64 + 8, 64, 64)
    private exitButton: Button = new Button(this.widgetContext, () => this.exit(), "exit-button", this.homeButton.getX - 64 - 8, this.telegramButton.getY, 64, 64)
    private aboutButton: Button = new Button(this.widgetContext, () => this.stop("about"), "about-button", this.telegramButton.getX + 64 + 8, this.telegramButton.getY, 64, 64)

    private secretButton: Button = new Button(this.widgetContext, () => this.secret(), "octo", this.screen.getWidth - 32, 0, 32, 32)

    private isSecret: boolean = Boolean(localStorage.getItem("secret"))

    public init(): void {
        document.addEventListener("fullscreenchange", (e: Event) => {
            if (document.fullscreenElement) {
                this.fullscreenButton.setImageName = "fullscreen-off-button"
            } else {
                this.fullscreenButton.setImageName = "fullscreen-on-button"
            }
        })
    }

    public update(currentTime: number): void {
        this.languageButton.update()
        this.homeButton.update()
        this.exitButton.update()
        this.fullscreenButton.update()
        this.telegramButton.update()
        this.aboutButton.update()

        this.secretButton.update()
    }

    public render(currentTime: number): void {
        this.drawBackground("background-2")

        this.languageButton.render()
        this.homeButton.render()
        this.exitButton.render()
        this.fullscreenButton.render()
        this.telegramButton.render()
        this.aboutButton.render()

        // if (!this.isSecret) {
        //     this.screen.drawImage("octo", this.screen.getWidth - 32, 0, 32, 32)
        // }
    }

    private exit(): void {
        sendRequest("/api/logout", "GET", null)
            .finally(() => location.reload())
    }

    private fullscreen(): void {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    private secret(): void {
        this.isSecret = true
        localStorage.setItem("secret", "true")

        this.stop("secret-room")
    }
}