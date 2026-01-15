"use client";

import { useId } from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./shadcn-select";

export default function Select({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  label,
  className = "",
  id: providedId,
}) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const internalValue = value === "" ? "__all__" : value;

  const handleValueChange = (val) => {
    onChange(val === "__all__" ? "" : val);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
        >
          {label}
        </label>
      )}
      <ShadcnSelect value={internalValue} onValueChange={handleValueChange}>
        <SelectTrigger id={id} className="w-full bg-black/20 border-white/10 text-white rounded-xl h-10 px-4">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[#121212] border-white/10 text-white">
          {options.map((option) => (
            <SelectItem 
              key={option.value || "__all__"} 
              value={option.value === "" ? "__all__" : option.value} 
              className="focus:bg-purple-600 focus:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
    </div>
  );
}
