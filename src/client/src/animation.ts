import { Timer } from "./timer"

type AnimationType = "linear" | "pow" | "unpow" | "linear-reverse"

export class Animation {
    private isWorking: boolean = false

    private currentValue: number
    private percent: number = 0
    private lastTime: number = 0

    constructor(
        private fromValue: number,
        private toValue: number,
        private duration: number,
        private type: AnimationType = "linear",
        private typeValue: number = 1
    ) {
        this.currentValue = this.fromValue
    }

    get getIsWorking(): boolean { return this.isWorking }
    get getFromValue(): number { return this.fromValue }
    get getToValue(): number { return this.toValue }
    get getCurrentValue(): number { return this.currentValue }
    get getType(): AnimationType { return this.type }
    get getTypeValue(): number { return this.typeValue }
    get getDuration(): number { return this.duration }

    set setType(type: AnimationType) { this.type = type }
    set setTypeValue(value: number) { this.typeValue = value }

    public run(): void {
        this.isWorking = true
        this.lastTime = 0
    }

    public stop(): void {
        this.isWorking = false
    }

    public reset(): void {
        this.currentValue = this.fromValue
    }

    public update(currentTime: number): void {
        if (this.isWorking) {
            if (this.lastTime == 0) {
                this.lastTime = currentTime
            }

            if ((currentTime - this.lastTime) >= this.duration) {
                this.stop()
                this.percent = this.getPercent(1)
            } else {
                this.percent = this.getPercent((currentTime - this.lastTime) / this.duration) 
            }

            this.currentValue = this.fromValue + (this.percent * this.toValue)
        }
    }

    private getPercent(timeFraction: number): number {
        switch (this.type) {
            case "linear":
                return timeFraction
            case "pow":
                return timeFraction ** this.typeValue
            case "unpow":
                return 1 - ((1 - timeFraction) ** this.typeValue)
            case "linear-reverse":
                return 1 - timeFraction
        }
    }
}

export class SpriteAnimation {
    private timer: Timer
    
    private currentFrame: number = 0

    constructor(
        private frames: number[],
        private duration: number
    ) {
        this.timer = new Timer(this.duration, true, () => this.updateCurrentFrame())
    }

    get getIsWorking(): boolean { return this.timer.getIsWorking }
    get getDuration(): number { return this.duration }
    get getCurrentFrame(): number { return this.frames[this.currentFrame] }

    public run(): void {
        this.timer.run()
    }

    public stop(): void {
        this.timer.stop()
    }

    public update(currentTime: number): void {
        this.timer.update(currentTime)
    }

    private updateCurrentFrame(): void {
        if (this.currentFrame >= (this.frames.length - 1)) {
            this.currentFrame = 0
        } else {
            this.currentFrame += 1
        }
    }
}