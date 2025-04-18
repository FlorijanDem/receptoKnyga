import React from "react";
import { useFormContext } from "react-hook-form";

/**
 * Universal form field component
 *
 * @param {Object} props - Component properties
 * @param {string} props.name - Form field name
 * @param {string} props.label - Form field label
 * @param {string} [props.type="text"] - Input field type
 * @param {number} [props.rows] - Number of rows for textarea
 * @param {Object} [props.validation={}] - Validation rules
 * @param {string} [props.placeholder] - Placeholder text
 * @param {function} [props.onChange] - onChange event handler
 * @param {function} [props.onKeyDown] - onKeyDown event handler
 * @returns {JSX.Element} Form field component
 */
const FormField = ({
  name,
  label,
  type = "text",
  rows,
  validation = {},
  placeholder,
  onChange,
  onKeyDown,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Set min attribute to 0 for number inputs to prevent negative values
  const inputProps = type === "number" ? { min: 0, ...props } : props;

  return (
    <div>
      {label && (
        <label htmlFor={name} className="text-gray-600">
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          id={name}
          className={`w-full p-2 border rounded ${
            errors[name] ? "border-red-500" : ""
          }`}
          rows={rows || 3}
          placeholder={placeholder}
          {...register(name, validation)}
          onChange={onChange}
          onKeyDown={onKeyDown}
          {...inputProps}
        />
      ) : type === "select" ? (
        <select
          id={name}
          className={`w-full p-2 border rounded ${
            errors[name] ? "border-red-500" : ""
          }`}
          {...register(name, validation)}
          onChange={onChange}
          {...inputProps}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          className={`w-full p-2 border rounded ${
            errors[name] ? "border-red-500" : ""
          }`}
          placeholder={placeholder}
          {...register(name, validation)}
          onChange={onChange}
          onKeyDown={onKeyDown}
          {...inputProps}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default FormField;
