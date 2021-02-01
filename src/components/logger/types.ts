
/**
 * A function to perform REST req/res logging action
 */
export type LogFn = (msg: string, level?: number) => void;

/**
 * Log level metadata
 */
export type LevelMetadata = {level: number};


/**
 * Log writing function
 */
export type LogWriterFn = (msg: string, level: number) => void;
