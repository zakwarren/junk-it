import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  private reason = "Error connecting to database";

  constructor() {
    super("Error connecting to database");
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
