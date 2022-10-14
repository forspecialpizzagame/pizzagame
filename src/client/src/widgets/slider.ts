import { ShopItem } from "../entitys/shop-item"
import { Button } from "./button"
import { Text } from "./text"
import { Storage } from "../main"
import { WidgetContext } from "../widget"
import { Language } from "../language"
import { sendRequest, Status } from "../xml"

interface Pizza {
    name: { [key: string]: string },
    description: { [key: string]: string },
    cost: number | "not sold"
}

export interface PizzaListJSON {
    [key: string]: Pizza
}

export class Slider {
    private rowsCount: number
    private currentRow: number
    private currentPizzaIndex: number

    private pizzaList: ShopItem[]
    private pizzaNameList: Text[]
    private pizzaDescriptionList: Text[]

    private leftButton: Button = new Button(this.widgetContext, () => this.left(), "left-button", 0, this.widgetContext.getScreen.getHeight - 160, 24, 64)
    private rightButton: Button = new Button(this.widgetContext, () => this.right(), "right-button", this.widgetContext.getScreen.getWidth - 24, this.widgetContext.getScreen.getHeight - 160, 24, 64)

    constructor(
        private widgetContext: WidgetContext,
        private json: PizzaListJSON,
        private storage: Storage,
        private language: Language
    ) {}

    get getRowsCount(): number { return this.rowsCount }
    get getCurrentRow(): number { return this.currentRow }
    get getCurrentPizzaIndex(): number { return this.currentPizzaIndex }

    public init(): void {
        this.leftButton.setIsDisable = true
        this.rightButton.setIsDisable = false

        this.rowsCount = 0
        this.currentRow = 0
        this.currentPizzaIndex = 0

        this.pizzaList = []
        this.pizzaNameList = []
        this.pizzaDescriptionList = []

        let name: string,
            i: number = 0

        for (name in this.json) {
            if (i >= 3) {
                i = 0
                this.rowsCount += 1
            }

            this.pizzaList.push(new ShopItem(name, this.storage.pizzaList[name] != false ? false : true, 28 + this.rowsCount * this.widgetContext.getScreen.getWidth + i * 64 + i * 4))
            this.pizzaDescriptionList.push(new Text(this.widgetContext, this.json[name].description[this.language.getCurrentLanguage], 96, 192, 30).setColumnWidth(this.widgetContext.getScreen.getWidth / 2 + 32))
            this.pizzaNameList.push(new Text(this.widgetContext, this.json[name].name[this.language.getCurrentLanguage], 96, 160, 40))

            i += 1
        }     
    }

    public update(): void {
        this.leftButton.update()
        this.rightButton.update()

        this.pizzaList.forEach((pizza: ShopItem, i: number) => {
            if (this.widgetContext.getListener.mouseUpHandler(pizza.getX, pizza.getY, pizza.getWidth, pizza.getHeight)) {
                this.currentPizzaIndex = i
            }
        })

        if (
            this.widgetContext.getListener.mouseUpHandler(96, this.widgetContext.getScreen.getHeight - 200,
            32 + this.widgetContext.getScreen.getTextWidth(this.json[this.pizzaList[this.currentPizzaIndex].getName].cost.toString(), 32), 32 ) && 
            (this.json[this.pizzaList[this.currentPizzaIndex].getName].cost != "not sold") && 
            (!this.storage.pizzaList[this.pizzaList[this.currentPizzaIndex].getName])
        ) {
            if (this.storage.money >= this.json[this.pizzaList[this.currentPizzaIndex].getName].cost) {
                this.buy(this.pizzaList[this.currentPizzaIndex].getName, this.currentPizzaIndex)
            }
        }
    }

    public render(): void {
        this.pizzaList.forEach((pizza: ShopItem) => pizza.render())
        
        this.widgetContext.getScreen.setColor = "white"
        this.widgetContext.getScreen.drawImage(`${this.pizzaList[this.currentPizzaIndex].getName}-pizza`, 16, 192, 64, 64)
        this.pizzaNameList[this.currentPizzaIndex].render()
        this.pizzaDescriptionList[this.currentPizzaIndex].render()
        
        if ((this.json[this.pizzaList[this.currentPizzaIndex].getName].cost != "not sold") && (!this.storage.pizzaList[this.pizzaList[this.currentPizzaIndex].getName])) {
            this.widgetContext.getScreen.setColor = "white"
            this.widgetContext.getScreen.drawImage("money", 96, this.widgetContext.getScreen.getHeight - 200, 32, 32)
            this.widgetContext.getScreen.print(this.json[this.pizzaList[this.currentPizzaIndex].getName].cost.toString(), 128, this.widgetContext.getScreen.getHeight - 200, 32)
        }

        this.leftButton.render()
        this.rightButton.render()
    }

    private left(): void {
        this.currentRow -= 1
        this.pizzaList.forEach((pizza: ShopItem) => pizza.setX = pizza.getX + this.widgetContext.getScreen.getWidth)
        this.rightButton.setIsDisable = false

        if (this.currentRow <= 0) {
            this.leftButton.setIsDisable = true
        }
    }

    private right(): void {
        this.currentRow += 1
        this.pizzaList.forEach((pizza: ShopItem) => pizza.setX = pizza.getX - this.widgetContext.getScreen.getWidth)
        this.leftButton.setIsDisable = false

        if (this.currentRow >= this.rowsCount) {
            this.rightButton.setIsDisable = true
        }
    }

    private buy(name: string, currentIndex: number): void {
        sendRequest("/api/buypizza", "POST", { "pizzaName": name })
            .then((data: Status) => {
                if (data.status == "ok") {
                    this.storage.pizzaList[name] = true
                    this.storage.money -= Number(this.json[this.pizzaList[currentIndex].getName].cost)
                    this.pizzaList[currentIndex].setIsDisable = false
                    
                    console.log(`Pizza ${name} unlocked`)
                } else {
                    console.log(`Pizza ${name} did not unlock`)
                }
            })
            .catch(() => console.log(`Pizza ${name} error`))
    }
}