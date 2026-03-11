// src/components/SearchInput.tsx
import React from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export default function SearchInput({ value, onChange, placeholder }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Rechercher..."}
      className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  );
}
