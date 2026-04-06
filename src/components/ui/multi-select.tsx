import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDisplay?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  disabled = false,
  className,
  maxDisplay = 3,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    if (value.length === filteredOptions.length) {
      // Deselect all filtered options
      const remainingValues = value.filter(v => 
        !filteredOptions.some(option => option.value === v)
      );
      onChange(remainingValues);
    } else {
      // Select all filtered options
      const allFilteredValues = filteredOptions.map(option => option.value);
      const newValue = [...new Set([...value, ...allFilteredValues])];
      onChange(newValue);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length <= maxDisplay) {
      return value.map(v => options.find(opt => opt.value === v)?.label).join(", ");
    }
    return `${value.length} items selected`;
  };

  const isAllFilteredSelected = filteredOptions.length > 0 && 
    filteredOptions.every(option => value.includes(option.value));

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-white",
          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-blue-500"
        )}
      >
        <span className="truncate text-left flex-1">
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-1">
          {value.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Select All / Clear All */}
          {filteredOptions.length > 0 && (
            <div className="p-2 border-b bg-gray-50">
              <button
                type="button"
                onClick={handleSelectAll}
                className="w-full text-left text-sm px-2 py-1 hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <div className={cn(
                  "w-4 h-4 border rounded flex items-center justify-center",
                  isAllFilteredSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                )}>
                  {isAllFilteredSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="font-medium">
                  {isAllFilteredSelected ? "Deselect All" : "Select All"}
                </span>
                <span className="text-gray-500">({filteredOptions.length})</span>
              </button>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggle(option.value)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <div className={cn(
                    "w-4 h-4 border rounded flex items-center justify-center",
                    value.includes(option.value) ? "bg-blue-600 border-blue-600" : "border-gray-300"
                  )}>
                    {value.includes(option.value) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>{option.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};