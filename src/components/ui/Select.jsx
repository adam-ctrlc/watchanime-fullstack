"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Select({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  label,
  className = "",
  name,
  id,
}) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-black/20 text-white rounded-xl px-4 py-2.5 text-sm border border-white/10 focus:ring-2 focus:ring-purple-500/50 focus:outline-none focus:border-purple-500/50 hover:bg-white/5 transition-colors pr-10 cursor-pointer"
        >
          {placeholder && (
            <option value="" disabled className="bg-[#121212] text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#121212] text-gray-100 py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon
            className="h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
