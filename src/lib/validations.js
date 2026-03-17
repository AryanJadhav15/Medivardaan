/**
 * Validation utility functions for form fields
 * Used across all pages for consistent validation
 */

// Email validation
export const validateEmail = (email) => {
  if (!email) return { isValid: true, error: "" }; // Empty is valid (use required for mandatory)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid email address"
  };
};

// Mobile number validation (10 digits for India)
export const validateMobile = (mobile) => {
  if (!mobile) return { isValid: true, error: "" };
  const mobileRegex = /^[6-9]\d{9}$/;
  const isValid = mobileRegex.test(mobile);
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid 10-digit mobile number"
  };
};

// Phone/Telephone validation
export const validatePhone = (phone) => {
  if (!phone) return { isValid: true, error: "" };
  const phoneRegex = /^\d{6,12}$/;
  const isValid = phoneRegex.test(phone.replace(/[-\s]/g, ""));
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid phone number"
  };
};

// Cost/Amount validation (positive number)
export const validateCost = (cost) => {
  if (!cost && cost !== 0) return { isValid: true, error: "" };
  const num = parseFloat(cost);
  const isValid = !isNaN(num) && num >= 0;
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid amount (0 or greater)"
  };
};

// Discount validation (0-100%)
export const validateDiscount = (discount) => {
  if (!discount && discount !== 0) return { isValid: true, error: "" };
  const num = parseFloat(discount);
  const isValid = !isNaN(num) && num >= 0 && num <= 100;
  return {
    isValid,
    error: isValid ? "" : "Discount must be between 0 and 100"
  };
};

// Percentage validation (0-100%)
export const validatePercentage = (value) => {
  if (!value && value !== 0) return { isValid: true, error: "" };
  const num = parseFloat(value);
  const isValid = !isNaN(num) && num >= 0 && num <= 100;
  return {
    isValid,
    error: isValid ? "" : "Value must be between 0 and 100"
  };
};

// Required field validation
export const validateRequired = (value, fieldName = "This field") => {
  const isValid = value !== undefined && value !== null && value.toString().trim() !== "";
  return {
    isValid,
    error: isValid ? "" : `${fieldName} is required`
  };
};

// Minimum length validation
export const validateMinLength = (value, minLength, fieldName = "This field") => {
  if (!value) return { isValid: true, error: "" };
  const isValid = value.toString().trim().length >= minLength;
  return {
    isValid,
    error: isValid ? "" : `${fieldName} must be at least ${minLength} characters`
  };
};

// Maximum length validation
export const validateMaxLength = (value, maxLength, fieldName = "This field") => {
  if (!value) return { isValid: true, error: "" };
  const isValid = value.toString().trim().length <= maxLength;
  return {
    isValid,
    error: isValid ? "" : `${fieldName} must be at most ${maxLength} characters`
  };
};

// Positive integer validation
export const validatePositiveInteger = (value) => {
  if (!value && value !== 0) return { isValid: true, error: "" };
  const num = parseInt(value, 10);
  const isValid = !isNaN(num) && num >= 0 && Number.isInteger(num);
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid positive number"
  };
};

// Age validation (0-150)
export const validateAge = (age) => {
  if (!age && age !== 0) return { isValid: true, error: "" };
  const num = parseInt(age, 10);
  const isValid = !isNaN(num) && num >= 0 && num <= 150;
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid age (0-150)"
  };
};

// Pincode validation (6 digits for India)
export const validatePincode = (pincode) => {
  if (!pincode) return { isValid: true, error: "" };
  const pincodeRegex = /^\d{6}$/;
  const isValid = pincodeRegex.test(pincode);
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid 6-digit pincode"
  };
};

// PAN Card validation
export const validatePAN = (pan) => {
  if (!pan) return { isValid: true, error: "" };
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const isValid = panRegex.test(pan.toUpperCase());
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid PAN number (e.g., ABCDE1234F)"
  };
};

// GST number validation
export const validateGST = (gst) => {
  if (!gst) return { isValid: true, error: "" };
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const isValid = gstRegex.test(gst.toUpperCase());
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid GST number"
  };
};

// Aadhar number validation (12 digits)
export const validateAadhar = (aadhar) => {
  if (!aadhar) return { isValid: true, error: "" };
  const aadharRegex = /^\d{12}$/;
  const isValid = aadharRegex.test(aadhar.replace(/\s/g, ""));
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid 12-digit Aadhar number"
  };
};

// Date validation (not in future)
export const validateDateNotFuture = (date) => {
  if (!date) return { isValid: true, error: "" };
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const isValid = inputDate <= today;
  return {
    isValid,
    error: isValid ? "" : "Date cannot be in the future"
  };
};

// Date validation (not in past)
export const validateDateNotPast = (date) => {
  if (!date) return { isValid: true, error: "" };
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isValid = inputDate >= today;
  return {
    isValid,
    error: isValid ? "" : "Date cannot be in the past"
  };
};

// Quantity validation (positive integer, optional max)
export const validateQuantity = (quantity, max = null) => {
  if (!quantity && quantity !== 0) return { isValid: true, error: "" };
  const num = parseInt(quantity, 10);
  let isValid = !isNaN(num) && num >= 0 && Number.isInteger(num);
  let error = "";

  if (!isValid) {
    error = "Please enter a valid quantity";
  } else if (max !== null && num > max) {
    isValid = false;
    error = `Quantity cannot exceed ${max}`;
  }

  return { isValid, error };
};

// Name validation (letters, spaces, and basic punctuation only)
export const validateName = (name) => {
  if (!name) return { isValid: true, error: "" };
  const nameRegex = /^[a-zA-Z\s.'-]+$/;
  const isValid = nameRegex.test(name) && name.trim().length >= 2;
  return {
    isValid,
    error: isValid ? "" : "Please enter a valid name (letters only, min 2 characters)"
  };
};

// URL validation
export const validateURL = (url) => {
  if (!url) return { isValid: true, error: "" };
  try {
    new URL(url);
    return { isValid: true, error: "" };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
};

/**
 * Validate multiple fields at once
 * @param {Object} fields - Object with field names as keys and { value, validators } as values
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateForm = (fields) => {
  const errors = {};

  Object.entries(fields).forEach(([fieldName, config]) => {
    const { value, validators } = config;

    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get error class for input styling
 * @param {string} error - Error message
 * @returns {string} - CSS class
 */
export const getErrorClass = (error) => {
  return error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object
 * @returns {boolean}
 */
export const hasErrors = (errors) => {
  return Object.values(errors).some(error => error && error.trim() !== "");
};
