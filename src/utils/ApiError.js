export default class ApiError extends Error {
  constructor({ status, message, errors, raw }) {
    super(message ?? "Request failed");
    this.name = "ApiError";
    this.status = status ?? 0;
    this.errors = errors;
    this.raw = raw;
  }

  fieldError(field) {
    return this.errors?.find((e) => e.field === field)?.message;
  }
}
