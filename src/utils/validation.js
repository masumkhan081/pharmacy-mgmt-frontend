/**
 * Validation utility for form data using Zod schemas
 */

/**
 * Validates data against a Zod schema
 * @param {object} schema - Zod schema to validate against
 * @param {object} data - Data to validate
 * @returns {object} - { success: boolean, data?: object, errors?: object }
 */
export const validateData = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
      errors: null,
    };
  } catch (error) {
    // Transform Zod errors into a more usable format
    const formattedErrors = {};
    
    if (error.errors) {
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        formattedErrors[field] = err.message;
      });
    }

    return {
      success: false,
      data: null,
      errors: formattedErrors,
    };
  }
};

/**
 * Validates data against a Zod schema and returns only errors
 * @param {object} schema - Zod schema to validate against
 * @param {object} data - Data to validate
 * @returns {object|null} - Returns errors object or null if valid
 */
export const getValidationErrors = (schema, data) => {
  const result = validateData(schema, data);
  return result.success ? null : result.errors;
};

/**
 * Validates a single field against a Zod schema
 * @param {object} schema - Zod schema to validate against
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (schema, fieldName, value) => {
  try {
    // Create a partial object with just this field
    const fieldData = { [fieldName]: value };
    schema.pick({ [fieldName]: true }).parse(fieldData);
    return null;
  } catch (error) {
    if (error.errors && error.errors[0]) {
      return error.errors[0].message;
    }
    return "Validation failed";
  }
};

/**
 * Async version of validateData for async schemas
 * @param {object} schema - Zod schema to validate against
 * @param {object} data - Data to validate
 * @returns {Promise<object>} - { success: boolean, data?: object, errors?: object }
 */
export const validateDataAsync = async (schema, data) => {
  try {
    const validatedData = await schema.parseAsync(data);
    return {
      success: true,
      data: validatedData,
      errors: null,
    };
  } catch (error) {
    const formattedErrors = {};
    
    if (error.errors) {
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        formattedErrors[field] = err.message;
      });
    }

    return {
      success: false,
      data: null,
      errors: formattedErrors,
    };
  }
};

/**
 * Custom hook for form validation (use with React)
 * @param {object} schema - Zod schema
 * @returns {object} - Validation functions
 */
export const useFormValidation = (schema) => {
  const validate = (data) => validateData(schema, data);
  const validateFieldValue = (fieldName, value) => validateField(schema, fieldName, value);
  const getErrors = (data) => getValidationErrors(schema, data);

  return {
    validate,
    validateField: validateFieldValue,
    getErrors,
  };
};
