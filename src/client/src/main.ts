import { Screen } from "./screen"
import { Listener } from "./listener"
import { EmptyScene, SceneList, Scene } from "./scene"
import { LoadingScene } from "./scenes/loading.scene"
import { MenuScene } from "./scenes/menu.scene"
import { Timer } from "./timer"
import { LevelScene } from "./scenes/level.scene"
import { ImageListJSON, ImageLoader } from "./image-loader"
import { SettingsScene } from "./scenes/settings.scene"
import { LanguageRoomScene } from "./scenes/language-room.scene"
import { Language, LanguageListJSON } from "./language"
import { ShopScene } from "./scenes/shop.scene"
import { Entity } from "./entity"
import { WidgetContext } from "./widget"
import { PizzaListJSON } from "./widgets/slider"
import { LeaderboardScene } from "./scenes/leaderboard.scene"
import { SecretRoomScene } from "./scenes/secret-room.scene"
import { sendRequest } from "./xml"
import { AboutScene } from "./scenes/about.scene"

export interface Storage {
    money: number
    highscore: number
    pizzaList: { [key: string]: boolean }
}

export interface Config {
    pizzaList: PizzaListJSON
    crystalPizzaList: PizzaListJSON
}

export class Main {
    private version: string = "1.7.2"

    private imageListJSON: ImageListJSON = require("./json/imagelist.json")
    private languageListJSON: LanguageListJSON = require("./json/languagelist.json")

    private screen: Screen = new Screen(256, 512)
    private listener: Listener = new Listener(256, 512)
    private widgetContext: WidgetContext = new WidgetContext(this.screen, this.listener)
    private language: Language = new Language(this.languageListJSON)
    private storage: Storage = {
        money: 0,
        highscore: 0,
        pizzaList: {
            "pepperoni": true,
            "farmhouse": false,
            "margaret": false,
            "cheese": false,
            "spice": false,
            "tuscany": false,
            "carbonara": false,
            "belarusian": false,
            "hawaiian": false,
            "mexican": false,
            "pumpkin": false,
            "italian": false,
            "gold": false,
            "bavarian": false,
            "chicken": false,
            "diamond": false,
            "ruby": false,
            "emerald": false,
            "amethyst": false,
            "jade": false,
            "topaz": false,
            "amber": false
        }
    }
    private config: Config = {
        pizzaList: require("./json/pizzalist.json"),
        crystalPizzaList: require("./json/crystalpizzalist.json")
    }

    private sceneList: SceneList = {
        "loading": new LoadingScene(this),
        "menu": new MenuScene(this),
        "level": new LevelScene(this),
        "settings": new SettingsScene(this),
        "language-room": new LanguageRoomScene(this),
        "leaderboard": new LeaderboardScene(this),
        "shop": new ShopScene(this),
        "about": new AboutScene(this),
        "secret-room": new SecretRoomScene(this)
    }
    private currentScene: Scene = this.sceneList["loading"]

    private framesPerSecond: number = 0
    private frames: number = 0
    private isShowFramesPerSecond: boolean = true
    private frameTimer: Timer = new Timer(1000, true, () => this.clearFrameData())

    constructor() {
        Entity.setScreen = this.screen

        const loader: ImageLoader = new ImageLoader()
        loader.loadList(this.imageListJSON.root, this.imageListJSON.extension, this.imageListJSON.list)
            .then((data: PromiseSettledResult<string>[]) => {
                console.groupCollapsed("IMAGE LIST")
                data.forEach((response: PromiseSettledResult<string>) => {
                    if (response.status == "fulfilled") {
                        console.log(`${response.value} - OK`)
                    } else if (response.status == "rejected") {
                        console.log(`${response.reason} - ERROR`)
                    }
                })
                console.groupEnd()
                
                this.screen.setImageList = loader.getImageList
                this.screen.setIsImageListLoaded = true

                sendRequest("/api/getplayer", "GET", null)
                    .then((data: Storage[]) => {
                        console.log("Player data loaded - OK")

                        this.storage.money = data[0].money
                        this.storage.highscore = data[0].highscore
                        this.storage.pizzaList = data[0].pizzaList
                        this.screen.setIsPlayerDataLoaded = true

                        this.sceneList["leaderboard"].init()
                    })
                    .catch(() => {
                        console.log("Player data loaded - ERROR")

                        this.screen.setIsPlayerDataLoaded = "error"
                    })
            })
    }

    get getScreen(): Screen { return this.screen }
    get getListener(): Listener { return this.listener }
    get getWidgetContext(): WidgetContext { return this.widgetContext }
    get getLanguage(): Language { return this.language }
    get getStorage(): Storage { return this.storage }
    get getConfig(): Config { return this.config }

    public run(): void {
        console.log(`Game Version ${this.version} is running...`)

        this.currentScene.init()
        this.currentScene.run()
        this.frameTimer.run()
        this.frame(0)
    }

    private frame(currentTime: number): void {
        window.requestAnimationFrame((time: number) => this.frame(time))

        this.frames += 1

        if (!this.currentScene.getIsWorking) {
            if (this.sceneList[this.currentScene.getNextSceneName] == undefined) {
                this.currentScene = new EmptyScene(this)
            } else {
                this.currentScene = this.sceneList[this.currentScene.getNextSceneName]
            }

            this.currentScene.init()
            this.currentScene.run()
        }

        this.currentScene.update(currentTime)

        this.screen.clear()
        this.currentScene.render(currentTime)

        this.frameTimer.update(currentTime)

        this.listener.update()
    }

    private clearFrameData(): void {
        this.framesPerSecond = this.frames - 1
        this.frames = 0

        if (this.isShowFramesPerSecond) {
            console.log(`FPS: ${this.framesPerSecond}`)
        }
    }
}