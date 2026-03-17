/**
 * Validates a mobile contact number.
 * @param {string} mobile - The mobile number to validate.
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateMobile = (mobile) => {
    if (!mobile) return { isValid: false, message: "Contact number is required." };
    // Check if numeric and exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) return { isValid: false, message: "Please enter a valid 10-digit contact number." };
    return { isValid: true, message: "" };
};

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
    if (!email) return { isValid: false, message: "Email is required." };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { isValid: false, message: "Please enter a valid email address." };
    return { isValid: true, message: "" };
};
