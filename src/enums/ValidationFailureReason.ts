export enum ValidationFailureReason {
  // Format
  InvalidLength = 'invalid_length',
  InvalidCharacters = 'invalid_characters',
  InvalidFormat = 'invalid_format',

  // Checksum
  InvalidChecksum = 'invalid_checksum',

  // Encoded data
  InvalidDate = 'invalid_date',
  FutureDate = 'future_date',
  InvalidMonth = 'invalid_month',

  // Semantic
  AllZeros = 'all_zeros',
  AllSameDigit = 'all_same_digit',
}
