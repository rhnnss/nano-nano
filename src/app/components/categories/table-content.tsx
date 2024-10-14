import { Category } from "@/app/types/article";
import { TableContentProps } from "@/app/types/table-content";
import {
  Card,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import PaginationControls from "../pagination-control";
import RenderCell from "./render-cell";

interface ExtendedTableContentProps extends TableContentProps {
  sortedItems: Category[];
}

const EMPTY_CONTENT = "No category found";

const TableContent: React.FC<ExtendedTableContentProps> = ({
  sortedItems,
  headerColumns,
  page,
  pages,
  setPage,
  onNextPage,
  onPreviousPage,
  isLoading,
  sortDescriptor,
  setSortDescriptor,
  isError,
  error,
}) => {
  return (
    <div>
      {isError && (
        <Card className="mb-4">
          <p>Error loading data: {error?.message}</p>
        </Card>
      )}
      <Table
        isHeaderSticky
        isCompact
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={EMPTY_CONTENT}
          items={sortedItems}
          isLoading={isLoading}
          loadingContent={<Spinner color="warning" />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="text-nowrap">
                  <RenderCell item={item} columnKey={columnKey} />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationControls
        page={page}
        pages={pages}
        setPage={setPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    </div>
  );
};

export default TableContent;
