export const MIN_SEARCH_LENGTH = 3; // sitas naudojamas search funkcijoje,
// export const MAX_SEARCH_LENGTH = 50;

// Regex patterns for validation
const SPECIAL_CHARS_PATTERN = /[!@#$%^&*()+=[\]{};:"\\|,<>/?]+/;
const SQL_INJECTION_PATTERN =
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)|(-{2}|[;])/i;




export const validateSearchQuery = (query) => {

  // Check for special characters
  if (SPECIAL_CHARS_PATTERN.test(query)) {
    return {
      isValid: false,
      error: "Search query contains invalid special characters",
    };
  }

  // Check for potential SQL injection attempts
  if (SQL_INJECTION_PATTERN.test(query)) {
    return {
      isValid: false,
      error: "Search query contains invalid keywords or characters",
    };
  }

  return {
    isValid: true,
    error: null,
  };
};
