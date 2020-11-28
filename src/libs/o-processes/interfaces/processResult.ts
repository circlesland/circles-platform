/**
 * Every process must end with a ProcessResult object.
 * Either the 'success' or the 'error' property must be set.
 * If both are set, the 'error' property takes precedence.
 */
export interface ProcessResult {
  success?: any,
  error?: any
}
