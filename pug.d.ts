declare module 'pug' {
  export interface CompileOptions {
    filename?: string;
    basedir?: string;
  }

  export function compile(template: string, options?: CompileOptions): () => string;
}
