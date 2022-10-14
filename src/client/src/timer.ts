export class Timer {
    private isWorking: boolean = false
    private lastTime: number = 0
    private deltaTime: number = 0

    constructor(
        private updateTime: number,
        private isLoop: boolean,
        private callback: Function
    ) {}

    get getIsWorking(): boolean { return this.isWorking }
    get getUpdateTime(): number { return this.updateTime }
    get getDeltaTime(): number { return this.deltaTime }

    set setUpdateTime(time: number) { this.updateTime = time }

    public run(): void {
        this.isWorking = true
        this.lastTime = 0
        this.deltaTime = 0
    }

    public stop(): void {
        this.isWorking = false
    }

    public update(currentTime: number): void {
        if (this.isWorking) {
            if (this.lastTime == 0) {
                this.lastTime = currentTime
            }

            this.deltaTime = currentTime - this.lastTime

            if (this.deltaTime >= this.updateTime) {
                this.callback()
                this.isLoop ? this.lastTime = 0 : this.stop()
            }
        }
    }
}