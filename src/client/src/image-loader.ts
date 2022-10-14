type FileList = { [key: string]: string }
export type ImageList = { [key: string]: HTMLImageElement }

export interface ImageListJSON {
    root: string,
    extension: string,
    list: FileList
}

export class ImageLoader {
    private imageList: ImageList = {}

    constructor() {}

    get getImageList(): ImageList { return this.imageList }

    public loadList(root: string, extension: string, fileList: FileList): Promise<PromiseSettledResult<string>[]> {
        const promises: Promise<string>[] = []
        let name: string

        for (name in fileList) {
            promises.push(this.loadImage(name, `${root}/${fileList[name]}.${extension}`))
        }

        return Promise.allSettled(promises)
    }

    private loadImage(name: string, source: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const image: HTMLImageElement = new Image()
            image.src = source
            image.addEventListener("load", (e: Event) => resolve(name))
            image.addEventListener("error", (e: ErrorEvent) => reject(name))

            this.imageList[name] = image
        })
    }
}