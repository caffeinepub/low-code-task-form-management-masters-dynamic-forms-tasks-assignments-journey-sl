/**
 * Converts an unknown error value into a user-friendly English error message.
 * Preserves underlying error details when available.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    // Handle objects with message property
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    // Try to stringify the error object
    try {
      const stringified = JSON.stringify(error);
      if (stringified !== '{}') {
        return stringified;
      }
    } catch {
      // JSON.stringify failed, fall through
    }
  }
  
  return 'An unknown error occurred';
}
