import { Scene } from "../scene"

export class LoadingScene extends Scene {    
    public init(): void {
        
    }
    
    public update(currentTime: number): void {
        if (this.screen.getIsDataPlayerLoaded && this.screen.getIsDataPlayerLoaded != "error") {
            this.stop("menu")
        }
    }

    public render(currentTime: number): void {
        this.screen.setColor = "black"
        this.screen.fill(0, 0, this.screen.getWidth, this.screen.getHeight)
        this.screen.setColor = "white"
        if (!this.screen.getIsImageListLoaded) {
            this.screen.print(this.language.getText("loading resources"), this.screen.getWidth / 2, this.screen.getHeight / 2 - 20, 32, "center")
        } else if (this.screen.getIsDataPlayerLoaded == "error") {
            this.screen.print(this.language.getText("data load error"), this.screen.getWidth / 2, this.screen.getHeight / 2 - 20, 32, "center")
        } else if (!this.screen.getIsDataPlayerLoaded) {
            this.screen.print(this.language.getText("loading data"), this.screen.getWidth / 2, this.screen.getHeight / 2 - 20, 32, "center")
        }
    }
}