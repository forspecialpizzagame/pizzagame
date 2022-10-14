import { Scene } from "../scene"
import { Button } from "../widgets/button"

export class AboutScene extends Scene {
    private homeButton: Button = new Button(this.widgetContext, () => this.stop("settings"), "home-icon", this.screen.getWidth - 56, this.screen.getHeight - 160, 56, 48)
    private gitHubButton: Button = new Button(this.widgetContext, () => window.open("https://github.com/forspecialpizzagame/pizzagame"), "github-button", this.screen.getWidth / 2 - 32, 70, 64, 64)

    public init(): void {
        
    }

    public update(currentTime: number): void {
        this.gitHubButton.update()
        this.homeButton.update()
    }

    public render(currentTime: number): void {
        this.drawBackground("background-2")
    
        this.screen.setColor = "white"
        this.screen.print(this.language.getText("developer"), this.screen.getWidth / 2, 8, 32, "center")
        this.screen.print("NEkTARIN", this.screen.getWidth / 2, 8 + 24 + 4, 24, "center")

        this.gitHubButton.render()

        this.screen.print(this.language.getText("testers"), this.screen.getWidth / 2, 160, 32, "center")
        this.screen.print("F1stashka", this.screen.getWidth / 2, 160 + 30, 24, "center")
        this.screen.print("SATANik", this.screen.getWidth / 2, 160 + 50, 24, "center")
        this.screen.print("Tima", this.screen.getWidth / 2, 160 + 70, 24, "center")
        this.screen.print("fomousey", this.screen.getWidth / 2, 160 + 90, 24, "center")
        this.screen.print("danik", this.screen.getWidth / 2, 160 + 110, 24, "center")
        this.screen.print("Tim4ek78", this.screen.getWidth / 2, 160 + 130, 24, "center")
    
        this.homeButton.render()
    }
}