import { Scene } from "../scene"
import { Button } from "../widgets/button"
import { sendRequest } from "../xml"

interface Player {
    name: string
    highscore: number
}

export class LeaderboardScene extends Scene {
    private players: Player[] = []

    private homeButton: Button = new Button(this.widgetContext, () => this.stop("menu"), "home-icon", this.screen.getWidth - 56, this.screen.getHeight - 160, 56, 48)

    public init(): void {
        sendRequest("api/getplayers", "POST", { count: 10 })
            .then((data: Player[]) => {
                this.players = data
                console.log("Players data loaded - OK")
            })
            .catch(() => console.log("Players data loaded - ERROR"))
    }

    public update(currentTime: number): void {
        this.homeButton.update()
    }

    public render(currentTime: number): void {
        this.drawBackground("background-2")

        this.screen.drawImage("leaderboard-background", 20, 24, 216, 320)

        this.screen.setColor = "white"
        this.players.forEach((player: Player, i: number) => {
            this.screen.print(player.name, 24 + 28, 24 + (i * 24) + (i * 8), 24)
            this.screen.print(this.screen.getShortScore(player.highscore), this.screen.getWidth - 24 - 28, 24 + (i * 24) + (i * 8), 24, "right")
        })

        this.homeButton.render()
    }
}