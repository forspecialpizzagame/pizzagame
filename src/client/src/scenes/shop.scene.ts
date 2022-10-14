import { Scene } from "../scene"
import { Button } from "../widgets/button"
import { PizzaListJSON, Slider } from "../widgets/slider"

export class ShopScene extends Scene {
    private pizzaSlider: Slider = new Slider(this.widgetContext, this.config.pizzaList, this.storage, this.language)
    private crystalPizzaSlider: Slider = new Slider(this.widgetContext, this.config.crystalPizzaList, this.storage, this.language)
    private currentSlider: Slider

    private homeButton: Button = new Button(this.widgetContext, () => this.stop("menu"), "home-icon", this.screen.getWidth - 56, 64, 56, 48)
    private changeSliderButton: Button = new Button(this.widgetContext, () => this.change(), "crystal-room-icon", 0, 64, 56, 48)

    public init(): void {
        this.pizzaSlider.init()
        this.crystalPizzaSlider.init()

        this.currentSlider = this.pizzaSlider
    }

    public update(currentTime: number): void {
        this.homeButton.update()
        this.changeSliderButton.update()

        this.currentSlider.update()
    }

    public render(currentTime: number): void {
        this.drawBackground("background-2")

        this.currentSlider.render()

        this.screen.setColor = "white"
        this.screen.drawImage("money", 0, 0, 32, 32)
        this.screen.print(this.storage.money.toString(), 32, 0, 32)

        this.homeButton.render()
        this.changeSliderButton.render()
    }

    private change(): void {
        if (this.currentSlider == this.pizzaSlider) {
            this.currentSlider = this.crystalPizzaSlider
            this.changeSliderButton.setImageName = "back-icon"
        } else {
            this.currentSlider = this.pizzaSlider
            this.changeSliderButton.setImageName = "crystal-room-icon"
        }
    }
}