import { Listener } from "./listener"
import { Screen } from "./screen"

export class WidgetContext {
    constructor(
        private screen: Screen,
        private listener: Listener
    ) {}

    get getScreen(): Screen { return this.screen }
    get getListener(): Listener { return this.listener }
}