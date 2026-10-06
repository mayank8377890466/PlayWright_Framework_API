/**
 * logger — Custom logging utility for the Playwright API framework.
 *
 * Two ways to use it:
 *   - `logger`              -> the shared root logger (framework-wide messages)
 *   - `createLogger(scope)` -> a child logger tagged with a scope label, so
 *                              every line shows WHERE it came from.
 *
 * Level is driven by the LOG_LEVEL env var (default 'info'). Output goes to
 * the console (colourised by level) AND to a single chronological log file
 * at `logs/combined-<timestamp>.log` so CI runs leave a clean artifact in
 * the exact order events occurred.
 */

import fs from 'fs';
import path from 'path';

type LogMethod = (message: unknown, ...args: unknown[]) => void;

export interface Logger {
    error: LogMethod;
    warn: LogMethod;
    info: LogMethod;
    http: LogMethod;
    verbose: LogMethod;
    debug: LogMethod;
    silly: LogMethod;
    child(bindings: { scope: string }): Logger;
}

const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';
const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const;
type Level = typeof levels[number];
const threshold = Math.max(0, levels.indexOf(LOG_LEVEL as Level));

const COLORS: Record<Level, string> = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    http: '\x1b[35m',
    verbose: '\x1b[34m',
    debug: '\x1b[90m',
    silly: '\x1b[90m',
};
const RESET = '\x1b[0m';

const LOG_DIR = path.resolve(process.cwd(), 'logs');

/**
 * Replace any token/secret-looking substring with [REDACTED].
 */
export function redact(text: string): string {
    if (typeof text !== 'string') return text;
    return text
        .replace(/(token|auth|password|secret|api[_-]?key)\s*[=:]\s*["']?[^&"',;\s}]+/gi,
                 '$1=[REDACTED]')
        .replace(/(Bearer|Basic)\s+[A-Za-z0-9._\-+/=]+/gi, '$1 [REDACTED]')
        .replace(/("(?:password|token|secret|api[_-]?key|access[_-]?token|refresh[_-]?token)"\s*:\s*)"[^"]*"/gi,
                 '$1"[REDACTED]"');
}

// One file per run, named with a sortable timestamp so events across workers
// remain in chronological order on inspection.
const RUN_TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const COMBINED_LOG_PATH = path.join(LOG_DIR, `combined-${RUN_TIMESTAMP}.log`);

function ensureLogDir(): void {
    try {
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR, { recursive: true });
        }
    } catch {
        // ignore
    }
}

/**
 * Append a single line to the shared chronological log file. Every call lands
 * in the same file in the exact order the events happened.
 */
function writeToCombinedFile(line: string): void {
    try {
        ensureLogDir();
        fs.appendFileSync(COMBINED_LOG_PATH, line + '\n', 'utf8');
    } catch {
        // Swallow file errors so logging never breaks tests
    }
}

function makeLogger(scope?: string): Logger {
    const result = {} as Logger;
    for (const [index, level] of levels.entries()) {
        result[level] = (message, ...args) => {
            if (index > threshold) return;
            const tag = scope ? ` [${scope}]` : '';
            const text = message instanceof Error ? message.stack ?? message.message : String(message);
            const safeText = redact(text);
            const safeArgs = args.map((a) => (typeof a === 'string' ? redact(a) : a));
            const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
            const color = COLORS[level];

            const consoleLine = `${color}${timestamp} [${level}]${tag}${RESET} ${safeText}`;
            const fileLine = `${timestamp} [${level}]${tag} ${safeText}`;

            const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
            method(consoleLine, ...safeArgs);

            writeToCombinedFile(fileLine);
        };
    }
    result.child = ({ scope: childScope }) => makeLogger(childScope);
    return result;
}

export const logger: Logger = makeLogger();

/**
 * Build a scoped child logger. Every line it emits carries the `scope` label.
 * Use the calling class/test/fixture name as the scope.
 */
export function createLogger(scope: string): Logger {
    return logger.child({ scope });
}

export default logger;