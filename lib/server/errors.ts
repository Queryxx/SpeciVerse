export class StoreError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "StoreError";
    this.status = status;
  }
}
