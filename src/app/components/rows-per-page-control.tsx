import React from "react";

interface RowsPerPageControlProps {
  totalItems: number;
  rowsPerPage: number;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

const RowsPerPageControl: React.FC<RowsPerPageControlProps> = ({
  totalItems,
  rowsPerPage,
  onRowsPerPageChange,
  placeholder,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-small text-default-400">
        Showing {totalItems || 0} {placeholder}
      </span>
      <label className="flex items-center text-small text-default-400">
        Rows per page:
        <select
          className="bg-transparent text-small text-default-400 outline-none"
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </label>
    </div>
  );
};

export default RowsPerPageControl;
