
declare module 'potrace' {
    export function trace(image: Buffer, callback: (err: any, svg: Buffer) => void): void
}