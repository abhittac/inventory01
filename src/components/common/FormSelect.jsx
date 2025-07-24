import { useTheme } from "@mui/material";
import React from "react";

export default function FormSelect({
  label,
  id,
  options,
  required = false,
  className = "",
  ...props
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <div>
      <label
        htmlFor={id}
        style={{
          color: isDark ? "#d1d5db" : "#374151", // gray-300 in dark, gray-700 in light
          fontWeight: 500,
          fontSize: "0.875rem",
          display: "block",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </label>
      <select
        id={id}
        required={required}
        className={`
          block w-full px-3 py-2
          border rounded-md shadow-sm
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${
            isDark
              ? "bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-500"
              : "bg-white text-gray-900 border-[1px] border-gray-600 placeholder-gray-400"
          }
          ${className}
        `}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
