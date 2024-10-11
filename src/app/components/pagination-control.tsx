import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/react";
import React, { memo } from "react";

type PaginationControlsProps = {
  page: number;
  pages: number;
  setPage: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
};

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  pages,
  setPage,
  onNextPage,
  onPreviousPage,
}) => {
  if (pages === 0) return null;

  return (
    <div className="flex items-center justify-between px-2 py-2">
      <Pagination
        isCompact
        showControls
        showShadow
        color="warning"
        page={page}
        total={pages}
        onChange={setPage}
        loop
        // disableAnimation
        disableCursorAnimation // Disable cursor animation, because bugs
      />
      <div className="hidden w-[30%] justify-end gap-2 sm:flex">
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          onPress={onPreviousPage}
        >
          Previous
        </Button>
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          onPress={onNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default memo(PaginationControls);
