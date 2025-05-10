import React, { useState } from "react";
interface Option<T = string> {
  value: number | T;
  label: string;
}

interface SelectProps<T = string> {
  options: Option<T>[];
  placeholder?: string;
  onChange: (value: T) => void;
  className?: string;
  defaultValue?: T;
  value?: string | number; 
}

const Select = <T extends string | number = string>({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue,
  value,
}: SelectProps<T>) => {
  const [internalValue, setInternalValue] = useState<T>(
    defaultValue ?? ("" as T)
  );

  const selectedValue = value ?? internalValue ?? ("" as T);

const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value;
  const typedValue = typeof defaultValue === 'number' 
    ? Number(value) as T 
    : value as T;
  if (typeof value === 'string' && value === '') return;
  if (value === undefined) return;

  if (value === undefined) setInternalValue(typedValue); // only update internal state if uncontrolled
  onChange(typedValue);
};


  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        selectedValue
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-400 dark:text-gray-400"
      } ${className}`}
      value={selectedValue}
      onChange={handleChange}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
