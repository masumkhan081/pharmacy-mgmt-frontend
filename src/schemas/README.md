# Client-Side Validation System

## Overview
This project uses **Zod** for schema validation on the client-side, matching the backend validation structure. All validation schemas are centralized in the `src/schemas/` folder.

## Folder Structure

```
c/src/
├── schemas/
│   ├── index.js              # Central export file
│   ├── auth.schema.js        # Authentication schemas
│   ├── drug.schema.js        # Drug-related schemas
│   ├── unit.schema.js        # Unit schemas
│   └── staff.schema.js       # Staff schemas
└── utils/
    └── validation.js         # Validation utility functions
```

## Available Schemas

### Authentication
- `loginSchema` - Email and password validation
- `registerSchema` - User registration validation
- `otpVerSchema` - OTP verification
- `emailSchema` - Email validation
- `resetPassSchema` - Password reset with confirmation

### Drug Management
- `genericSchema` - Generic drug names
- `brandSchema` - Brand names
- `groupSchema` - Drug groups
- `formulationSchema` - Formulation types
- `mfrSchema` - Manufacturer details
- `drugSchema` - Complete drug information
- `createUnitSchema` - Unit creation (shortName, longName)
- `updateUnitSchema` - Unit updates (partial)

### Staff Management
- `staffSchema` - Staff member details
- `attendanceSchema` - Attendance records
- `salarySchema` - Salary information

## Validation Utilities

### `validateData(schema, data)`
Validates data and returns structured result:
```javascript
import { validateData } from '../utils/validation';
import { createUnitSchema } from '../schemas/unit.schema';

const result = validateData(createUnitSchema, { shortName: 'mg', longName: 'Milligram' });
// Returns: { success: true, data: {...}, errors: null }
// OR
// Returns: { success: false, data: null, errors: { fieldName: 'error message' } }
```

### `getValidationErrors(schema, data)`
Returns only the errors object or null:
```javascript
import { getValidationErrors } from '../utils/validation';

const errors = getValidationErrors(schema, formData);
if (errors) {
  setErrors(errors);
}
```

### `validateField(schema, fieldName, value)`
Validates a single field:
```javascript
import { validateField } from '../utils/validation';

const error = validateField(createUnitSchema, 'shortName', 'mg123');
// Returns: null (valid) or error message string
```

### `validateDataAsync(schema, data)`
Async version for async validations:
```javascript
const result = await validateDataAsync(schema, data);
```

## Usage Example

### Basic Form Validation

```javascript
import { useState } from 'react';
import { createUnitSchema } from '../../schemas/unit.schema';
import { validateData } from '../../utils/validation';
import { postHandler } from '../../utils/handlerReqRes';

function MyForm() {
  const [shortName, setShortName] = useState('');
  const [longName, setLongName] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const formData = { shortName, longName };
    const validation = validateData(createUnitSchema, formData);
    
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    
    // Clear errors and submit
    setErrors({});
    const response = await postHandler('/units', validation.data);
    
    if (response.status === 201) {
      // Success handling
      setShortName('');
      setLongName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Short Name</label>
        <input
          value={shortName}
          onChange={(e) => {
            setShortName(e.target.value);
            if (errors.shortName) {
              setErrors({ ...errors, shortName: null });
            }
          }}
          className={errors.shortName ? 'border-error-500' : ''}
        />
        {errors.shortName && (
          <span className="text-error-600">{errors.shortName}</span>
        )}
      </div>
      
      <div>
        <label>Long Name</label>
        <input
          value={longName}
          onChange={(e) => {
            setLongName(e.target.value);
            if (errors.longName) {
              setErrors({ ...errors, longName: null });
            }
          }}
          className={errors.longName ? 'border-error-500' : ''}
        />
        {errors.longName && (
          <span className="text-error-600">{errors.longName}</span>
        )}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Real-time Field Validation

```javascript
const handleFieldChange = (fieldName, value) => {
  // Update state
  setFormData({ ...formData, [fieldName]: value });
  
  // Validate field
  const error = validateField(schema, fieldName, value);
  setErrors({ ...errors, [fieldName]: error });
};
```

## Best Practices

1. **Always validate before API calls** - Prevent unnecessary network requests
2. **Clear errors on input change** - Improve UX by removing error messages as users fix issues
3. **Use semantic color classes** - `border-error-500`, `text-error-600` for error states
4. **Show validation errors inline** - Display errors below the relevant input field
5. **Use validated data** - After validation passes, use `validation.data` (not raw form data)
6. **Handle loading states** - Disable submit buttons during validation/submission

## Adding New Schemas

1. Create schema file in `src/schemas/[entity].schema.js`
2. Import Zod: `import { z } from "zod"`
3. Define schema using Zod methods
4. Export schema(s)
5. Add export to `src/schemas/index.js`

Example:
```javascript
// src/schemas/supplier.schema.js
import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  contact: z.string().optional(),
  address: z.string().optional(),
});

export const updateSupplierSchema = supplierSchema.partial();
```

Then add to `index.js`:
```javascript
export * from './supplier.schema';
```

## Zod Schema Methods

Common Zod validation methods:
- `.string()` - String type
- `.number()` - Number type
- `.email()` - Email format
- `.min(n, message)` - Minimum length/value
- `.max(n, message)` - Maximum length/value
- `.optional()` - Optional field
- `.nullable()` - Can be null
- `.refine(fn, message)` - Custom validation
- `.enum([...])` - Enum values
- `.partial()` - Make all fields optional
- `.pick({ field: true })` - Select specific fields
- `.omit({ field: true })` - Exclude specific fields

## Error Format

Validation errors are returned as an object:
```javascript
{
  fieldName: "Error message",
  anotherField: "Another error message"
}
```

This format makes it easy to display errors next to their respective form fields.
