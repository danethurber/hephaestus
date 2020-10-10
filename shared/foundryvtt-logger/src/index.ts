interface Logger {
  debug(...msg: unknown[]): void
  error(...msg: unknown[]): void
  info(...msg: unknown[]): void
  warn(...msg: unknown[]): void
}

export class ConsoleLogger implements Logger {
  private readonly delimiter = ' |'
  private name: string

  constructor(name: string) {
    this.name = name
  }

  public error(...msg: unknown[]): void {
    console.error.apply(null, [this.prefix, ...msg])
  }

  public warn(...msg: unknown[]): void {
    console.warn.apply(null, [this.prefix, ...msg])
  }

  public info(...msg: unknown[]): void {
    console.info.apply(null, [this.prefix, ...msg])
  }

  public debug(...msg: unknown[]): void {
    console.debug.apply(null, [this.prefix, ...msg])
  }

  private get prefix(): string {
    return this.name + this.delimiter
  }
}

export class NotificationsLogger implements Logger {
  private logger: ConsoleLogger
  private name: string

  constructor(name: string) {
    this.name = name
    this.logger = new ConsoleLogger(this.name)
  }

  public error(...msg: unknown[]): void {
    ui.notifications.error(`${this.name}: Please check the console (F12).`)
    this.logger.error(...msg)
  }

  public warn(...msg: unknown[]): void {
    ui.notifications.warn(`${this.name}: Please check the console (F12).`)

    this.logger.warn(...msg)
  }

  public info(...msg: unknown[]): void {
    this.logger.info(...msg)
  }

  public debug(...msg: unknown[]): void {
    this.logger.debug(...msg)
  }
}
