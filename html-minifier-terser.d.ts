declare module 'html-minifier-terser' {
  export interface MinifyOptions {
    collapseWhitespace?: boolean;
    removeComments?: boolean;
    removeRedundantAttributes?: boolean;
    removeScriptTypeAttributes?: boolean;
    removeStyleLinkTypeAttributes?: boolean;
    useShortDoctype?: boolean;
    minifyCSS?: boolean;
    minifyJS?: boolean;
  }

  export function minify(html: string, options?: MinifyOptions): Promise<string>;
}
