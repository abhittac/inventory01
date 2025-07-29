import React from "react";
import { useTheme } from "@mui/material/styles";
import clsx from "clsx";

export default function FormInput({
  label,
  id,
  type = "text",
  required = false,
  multiline = false,
  rows = 3,
  className = "",
  ...props
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div>
      {/* Label */}
      <label
        htmlFor={id}
        style={{
          color: isDark ? "#d1d5db" : "#374151", // gray-300 / gray-700
          fontWeight: 500,
          fontSize: "0.875rem",
          marginBottom: "0.25rem",
          display: "block",
        }}
      >
        {label}
      </label>

      {/* Input or Textarea */}
      <InputComponent
        id={id}
        type={!multiline ? type : undefined}
        required={required}
        rows={multiline ? rows : undefined}
        className={clsx(
          `block w-full px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`,
          isDark
            ? "bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-500"
            : "bg-white text-gray-900 border-gray-600 border-[1px] placeholder-gray-500",
          className
        )}
        {...props}
      />
    </div>
  );
}
