import React from "react";

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
}

export default function Textarea({
  value,
  onChange,
  name,
  placeholder,
  required,
  rows = 4,
  error,
}: TextareaProps) {
  return (
    <div className="form-field">
      <textarea
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  );
}
