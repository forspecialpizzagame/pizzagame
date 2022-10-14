import { LanguageName } from "../language"
import { Scene } from "../scene"
import { Button } from "../widgets/button"

export class LanguageRoomScene extends Scene {
    private buttons: Button[]

    public init(): void {
        this.buttons = []

        this.language.getLanguageList.forEach((languageName: LanguageName, i: number) => {
            this.buttons.push(new Button(this.widgetContext, () => this.changeLanguage(languageName), `${languageName}-flag`, this.screen.getWidth / 2 - 32 - 8 - 64 + i * 64 + i * 8, this.screen.getHeight / 2 - 32, 64, 64))
        })
    }

    public update(currentTime: number): void {
        this.buttons.forEach((button: Button) => button.update())
    }

    public render(currentTime: number): void {
        this.drawBackground("background-2")

        this.buttons.forEach((button: Button) => button.render())
    }

    private changeLanguage(languageName: LanguageName): void {
        this.language.setLanguage = languageName
        localStorage.setItem("language", this.language.getCurrentLanguage)

        this.stop("settings")
    }
}