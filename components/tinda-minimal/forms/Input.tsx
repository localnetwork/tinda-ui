export default function Input({
  name,
  value,
  onChange,
  required,
  placeholder,
  error,
}) {
  console.log("error", error);
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error
          ? "border-red-300 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
    />
  );
}
