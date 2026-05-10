import type { ValidationFailureReason } from '../enums/ValidationFailureReason.js'

export class ValidationFailure {
  constructor(
    public readonly reason: ValidationFailureReason,
    public readonly message: string,
  ) {}
}
