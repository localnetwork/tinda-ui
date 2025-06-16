import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: string;
  name?: string;
  required?: boolean;
}

export default function Select({
  value,
  onChange,
  options,
  error,
  name,
  required,
}: SelectProps) {
  return (
    <div className="form-field">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-select ${error ? "form-select-error" : ""}`}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
