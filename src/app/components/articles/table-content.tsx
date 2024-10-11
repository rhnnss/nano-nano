import { Article } from "@/app/types/article";
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
import React, { useState } from "react";
import PaginationControls from "../pagination-control";
import RenderCell from "./render-cell";
import { useDelete } from "@/app/lib/fetcher";
import useSWRMutation from "swr/mutation";

interface ExtendedTableContentProps extends TableContentProps {
  sortedItems: Article[];
}

const EMPTY_CONTENT = "No article found";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { trigger: deletePost } = useSWRMutation(
    () => `/api/articles?id=${selectedId}`, // Dynamically construct the URL
    useDelete,
  );

  // Function to handle the delete action
  const handleDelete = async (id: string) => {
    setSelectedId(id); // Set the selectedId
    setTimeout(async () => {
      try {
        await deletePost(); // Call the deletePost with the id
        console.log(`Deleted post with id: ${id}`);
      } catch (error) {
        console.error("Failed to delete the post:", error);
      }
    }, 1000);
  };

  return (
    <div>
      {isError && (
        <Card className="mb-4">
          <p>Error loading data: {error?.message}</p>
        </Card>
      )}
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
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
                  <RenderCell
                    item={item}
                    columnKey={columnKey}
                    handleDelete={handleDelete}
                  />
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
