export const MIN_SEARCH_LENGTH = 2;
export const MAX_SEARCH_LENGTH = 50;

// Regex patterns for validation
const SPECIAL_CHARS_PATTERN = /[!@#$%^&*()+=[\]{};:"\\|,<>/?]+/;
const SQL_INJECTION_PATTERN = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)|(-{2}|[;])/i;

/**
 * Validates a search query for:
 * - Minimum and maximum length
 * - Special characters
 * - SQL injection attempts
 */
export const validateSearchQuery = (query) => {
  // Check for empty or whitespace-only query
  if (!query || query.trim().length < MIN_SEARCH_LENGTH) {
    return {
      isValid: false,
      error: `Please enter at least ${MIN_SEARCH_LENGTH} characters`
    };
  }

  // Check maximum length
  if (query.length > MAX_SEARCH_LENGTH) {
    return {
      isValid: false,
      error: `Search query cannot be longer than ${MAX_SEARCH_LENGTH} characters`
    };
  }

  // Check for special characters
  if (SPECIAL_CHARS_PATTERN.test(query)) {
    return {
      isValid: false,
      error: "Search query contains invalid special characters"
    };
  }

  // Check for potential SQL injection attempts
  if (SQL_INJECTION_PATTERN.test(query)) {
    return {
      isValid: false,
      error: "Search query contains invalid keywords or characters"
    };
  }

  return {
    isValid: true,
    error: null
  };
};
