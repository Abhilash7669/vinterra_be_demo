export class CustomAppError extends Error {
  name: string;
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "Custom App Error";
    this.status = status;
  }
}
