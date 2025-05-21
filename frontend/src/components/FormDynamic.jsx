import { useState, useEffect } from "react";

const FormDynamic = ({
  schema,
  initialData,
  onSubmit,
  isLoading = false,
  error = null,
  title,
  submitButtonText = "Submit",
  onCancel,
}) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  useEffect(() => {
    if (initialData) {
      // Handle conversion of ObjectID references in initialData for select fields
      const processedData = { ...initialData };
      
      schema.forEach((field) => {
        // For select fields that use objectIds, make sure we're using the id value
        if (field.type === 'select' && processedData[field.key] && 
            typeof processedData[field.key] === 'object' && processedData[field.key]._id) {
          processedData[field.key] = processedData[field.key]._id;
        }
      });
      
      setFormData(processedData);
    } else {
      // Initialize with empty values based on schema
      const initialFormData = {};
      schema.forEach((field) => {
        initialFormData[field.key] = field.type === "number" ? 0 : "";
      });
      setFormData(initialFormData);
    }
  }, [initialData, schema]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (type === "number" || type === "range") {
      processedValue = value === "" ? "" : Number(value);
    } else if (type === "checkbox") {
      processedValue = checked;
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    // Clear field-specific error when user makes changes
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error when user makes changes
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    schema.forEach((field) => {
      const value = formData[field.key];
      
      // Check required fields
      if (field.required && (value === "" || value === undefined || value === null)) {
        errors[field.key] = `${field.label} is required`;
        isValid = false;
        return;
      }
      
      // Type-specific validations
      if (value !== "" && value !== undefined && value !== null) {
        if (field.type === "number" && (isNaN(Number(value)) || value < field.min || value > field.max)) {
          const rangeText = [];
          if (field.min !== undefined) rangeText.push(`minimum ${field.min}`);
          if (field.max !== undefined) rangeText.push(`maximum ${field.max}`);
          
          errors[field.key] = `${field.label} must be a valid number${rangeText.length ? ` (${rangeText.join(', ')})` : ''}`;
          isValid = false;
        } else if (field.type === "email" && !/\S+@\S+\.\S+/.test(value)) {
          errors[field.key] = `${field.label} must be a valid email address`;
          isValid = false;
        } else if (field.type === "select" && field.required && value === "") {
          errors[field.key] = `Please select a ${field.label}`;
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const { type, key, label, options, placeholder, min, max, required } = field;

    switch (type) {
      case "text":
      case "email":
      case "password":
      case "url":
      case "tel":
        return (
          <input
            type={type}
            id={key}
            name={key}
            value={formData[key] || ""}
            onChange={handleChange}
            placeholder={placeholder || ""}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={required}
          />
        );
      case "number":
        return (
          <input
            type="number"
            id={key}
            name={key}
            value={formData[key] !== undefined ? formData[key] : ""}
            onChange={handleChange}
            min={min}
            max={max}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={required}
          />
        );
      case "select":
        return (
          <select
            id={key}
            name={key}
            value={formData[key] || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={required}
          >
            <option value="" disabled>
              Select {label}
            </option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            id={key}
            name={key}
            value={formData[key] || ""}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={required}
          />
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            id={key}
            name={key}
            checked={Boolean(formData[key])}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        );
      case "date":
        return (
          <input
            type="date"
            id={key}
            name={key}
            value={formData[key] || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={required}
          />
        );
      default:
        return (
          <input
            type="text"
            id={key}
            name={key}
            value={formData[key] || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={required}
          />
        );
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {schema.map((field) => (
          <div key={field.key} className="mb-4">
            <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {renderField(field)}
            {formErrors[field.key] && (
              <p className="mt-1 text-sm text-red-600">{formErrors[field.key]}</p>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-2 mt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormDynamic;
