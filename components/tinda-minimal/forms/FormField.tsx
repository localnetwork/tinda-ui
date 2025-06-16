import Input from "./Input";
import Media from "./Media";
import Select from "./Select";
import Textarea from "./Textarea";

export default function FormField({
  onChange,
  value,
  error,
  label,
  type,
  options,
  name,
  required,
  placeholder,
  uploadedImages,
}) {
  const renderField = () => {
    const commonProps = {
      name,
      value,
      onChange,
      required,
      placeholder,
      error,
      uploadedImages,
    };

    switch (type) {
      case "text":
        return <Input {...commonProps} />;
      case "email":
      case "password":
        return <input type={type} {...commonProps} className="form-input" />;
      case "textarea":
        return <Textarea {...commonProps} className="form-textarea" />;
      case "select":
        return <Select {...commonProps} options={options} />;
      case "checkbox":
        return (
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            required={required}
            className="form-checkbox"
          />
        );
      case "radio":
        return (
          <div className="form-radio-group">
            {options?.map((option, index) => (
              <label key={index} className="form-radio-label">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  className="form-radio-input"
                  required={required}
                />
                {option.label}
              </label>
            ))}
          </div>
        );

      case "media":
        return <Media {...commonProps} />;
      default:
        return (
          <input
            type="text"
            {...commonProps}
            className="form-input"
            placeholder={placeholder || "Unsupported field type"}
          />
        );
    }
  };

  return (
    <div className="form-field mb-4">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}
      {renderField()}
      {error && (
        <span className="form-error text-red-500 text-sm mt-1">{error}</span>
      )}
    </div>
  );
}
