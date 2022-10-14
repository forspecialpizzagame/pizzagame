import { Listener } from "./listener"
import { Config, Main, Storage } from "./main"
import { Language } from "./language"
import { Screen } from "./screen"
import { WidgetContext } from "./widget"
import { Timer } from "./timer"
import { Animation } from "./animation"

export type SceneList = { [key: string]: Scene }

export class Scene {
    private isWorking: boolean = false
    private nextSceneName: string = ""
    private endTimer: Timer = new Timer(0, false, () => this.isWorking = false)

    protected screen: Screen
    protected listener: Listener
    protected widgetContext: WidgetContext
    protected language: Language
    protected storage: Storage
    protected config: Config

    constructor(context: Main) {
        this.screen = context.getScreen
        this.listener = context.getListener
        this.widgetContext = context.getWidgetContext
        this.language = context.getLanguage
        this.storage = context.getStorage
        this.config = context.getConfig
    }

    get getIsWorking(): boolean { return this.isWorking }
    get getNextSceneName(): string { return this.nextSceneName }

    public run(): void {
        this.isWorking = true
        this.nextSceneName = ""
    }

    public stop(sceneName: string, time: number = null): void {
        if (this.nextSceneName == "") {
            this.nextSceneName = sceneName

            if (time != null) {
                this.endTimer.setUpdateTime = time
                this.endTimer.run()    
            } else {
                this.isWorking = false
            }
        }
    }

    public init(): void {

    }

    public update(currentTime: number): void {
        this.endTimer.update(currentTime)
    }

    public render(currentTime: number): void {

    }

    protected drawBackground(name: string): void {
        this.screen.drawImage(name, 0, 0, this.screen.getWidth, this.screen.getHeight)
    }
}

export class EmptyScene extends Scene {
    public update(currentTime: number): void {
        if (this.listener.getMouseIsUp) {
            location.reload()
        }
    }

    public render(currentTime: number): void {
        this.screen.setColor = "black"
        this.screen.print("empty scene, click for reload app", this.screen.getWidth / 2, this.screen.getHeight / 2 - 20, 40, "center")
    }
}