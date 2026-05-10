import type { IdentifierInterface } from './IdentifierInterface.js'

export interface ParserInterface {
  parse(input: string): IdentifierInterface
  tryParse(input: string): IdentifierInterface | null
}
