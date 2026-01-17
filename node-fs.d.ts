declare module "node:fs" {
  export function readFileSync(path: string, encoding: BufferEncoding): string;
  export function existsSync(path: string): boolean;
}
