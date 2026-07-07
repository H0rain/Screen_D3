const formatTime = (): string => {
  return new Date().toISOString()
}

export const logger = {
  info(message: string, ...args: unknown[]): void {
    console.log(`[INFO] ${formatTime()} - ${message}`, ...args)
  },
  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${formatTime()} - ${message}`, ...args)
  },
  error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR] ${formatTime()} - ${message}`, ...args)
  },
  debug(message: string, ...args: unknown[]): void {
    const env = import.meta as { env?: { DEV?: boolean } }
    if (env.env?.DEV) {
      console.debug(`[DEBUG] ${formatTime()} - ${message}`, ...args)
    }
  }
}