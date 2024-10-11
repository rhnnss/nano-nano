import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { IoSearchSharp } from "react-icons/io5";
import { useDebouncedValue } from "@mantine/hooks";

interface SearchBarProps {
  filterValue: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  filterValue,
  onSearchChange,
  onClear,
  placeholder = "Search...",
}) => {
  const [inputValue, setInputValue] = useState(filterValue); // Local state for the input value
  const [debouncedValue] = useDebouncedValue(inputValue, 500); // Debounce delay set to 500ms

  // Trigger onSearchChange whenever the debounced value changes
  React.useEffect(() => {
    onSearchChange(debouncedValue); // Call the prop function with debounced value
  }, [debouncedValue, onSearchChange]);

  return (
    <Input
      isClearable
      className="w-full sm:max-w-[300px]"
      startContent={<IoSearchSharp />}
      value={inputValue}
      onClear={onClear}
      onValueChange={setInputValue} // Update local state on every input change
      placeholder={placeholder}
    />
  );
};

export default SearchBar;
