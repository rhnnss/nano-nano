import { useDelete, usePost, usePut } from "@/app/lib/fetcher";
import { Banner } from "@/app/types/banner";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import PaginationControls from "../pagination-control";
import RenderCell from "./render-cell";

interface ExtendedTableContentProps extends TableContentProps {
  sortedItems: Banner[];
}

const EMPTY_CONTENT = "No banner found";

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
  const queryClient = useQueryClient();

  const updateBannerMutation = useMutation({
    mutationFn: (bannerData: Banner) =>
      usePut(`api/banners?id=${bannerData?.id}`, { arg: bannerData }),
    onSuccess: async (res) => {
      if (res?.success) {
        queryClient.invalidateQueries({
          queryKey: ["banners"],
          refetchType: "active",
        });
      }
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: (filePath: { filePath: string }) =>
      usePost("api/deleteFile", { arg: filePath }),
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (bannerId: string) => useDelete(`api/banners?id=${bannerId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["banners"],
        refetchType: "active",
      });
    },
    onError: (error) => {
      toast.error(`Error deleting the banner: ${error}`);
    },
  });

  const handleDelete = async (bannerId: string, thumbnailUrl: string) => {
    // Using toast.promise for the delete operation
    toast.promise(
      (async () => {
        // Delete the file first
        if (thumbnailUrl) {
          await deleteFileMutation.mutateAsync({ filePath: thumbnailUrl });
        }
        // Then delete the banner
        await deleteBannerMutation.mutateAsync(bannerId);
      })(),
      {
        loading: "Deleting banner...",
        success: "Banner and file deleted successfully!",
        error: "Error deleting the banner or file",
      },
    );
  };

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
                  <RenderCell
                    item={item}
                    columnKey={columnKey}
                    onDelete={handleDelete}
                    onUpdate={updateBannerMutation.mutateAsync}
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
