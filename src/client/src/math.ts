export function random(min: number, max: number): number {
    return Math.floor((Math.random() * (max - min + 1)) + min)
}

export function range(size: number): number[] {
    return Array<number>.from(Array<number>(size).keys())
}