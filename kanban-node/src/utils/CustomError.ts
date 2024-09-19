class CustomError extends Error {
  public statusCode: number;
  public message: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.stack = process.env.NODE_ENV === "development" ? this.stack : "";
  }
}

export default CustomError;
