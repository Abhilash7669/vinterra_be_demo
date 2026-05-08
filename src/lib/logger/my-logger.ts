export class MyLogger {
  private static instance: MyLogger;
  public static getInstance(): MyLogger {
    if (!this.instance) {
      this.instance = new MyLogger();
    }
    return this.instance;
  }

  public log(value: unknown[] | unknown) {
    if (Array.isArray(value)) {
      this.arrayLog(value);
    }
    console.log(value);
  }

  private arrayLog(value: unknown[]) {
    const splitValue = value.join(", ");
    return splitValue;
  }
}

export const myLogger = new MyLogger();
