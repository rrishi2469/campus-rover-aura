/**
 * Maps raw authentication errors to user-friendly messages
 * Prevents information disclosure about system internals
 */
export function getSafeAuthErrorMessage(error: unknown): string {
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  
  // Invalid credentials - don't reveal which field is wrong
  if (errorMessage.includes('invalid login') || 
      errorMessage.includes('email not found') ||
      errorMessage.includes('invalid password') ||
      errorMessage.includes('invalid credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  
  // Email not confirmed
  if (errorMessage.includes('email not confirmed')) {
    return 'Please verify your email address before logging in.';
  }
  
  // User already exists - safe to reveal for signup flow
  if (errorMessage.includes('already registered') ||
      errorMessage.includes('already exists') ||
      errorMessage.includes('user already')) {
    return 'An account with this email already exists. Please login instead.';
  }
  
  // Rate limiting
  if (errorMessage.includes('rate limit') ||
      errorMessage.includes('too many requests')) {
    return 'Too many attempts. Please try again later.';
  }
  
  // Database constraint errors - hide internal details
  if (errorMessage.includes('constraint') || 
      errorMessage.includes('violates') ||
      errorMessage.includes('duplicate key')) {
    return 'Invalid input. Please check your information and try again.';
  }
  
  // Password requirements
  if (errorMessage.includes('password') && 
      (errorMessage.includes('weak') || errorMessage.includes('short') || errorMessage.includes('character'))) {
    return 'Password does not meet requirements. Please use a stronger password.';
  }
  
  // Invalid email format
  if (errorMessage.includes('invalid email') || errorMessage.includes('email format')) {
    return 'Please enter a valid email address.';
  }
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
    return 'Connection error. Please check your internet and try again.';
  }
  
  // Generic fallback - never expose raw error messages
  return 'An error occurred. Please try again later.';
}
