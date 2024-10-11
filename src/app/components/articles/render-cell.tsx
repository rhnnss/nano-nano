import { useDelete, usePost } from "@/app/lib/fetcher"; // Use your delete function
import { useArticleStore } from "@/app/stores/article";
import { useModalAction } from "@/app/stores/modal";
import { Article } from "@/app/types/article";
import { RenderCellProps } from "@/app/types/render-cell";
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import React Query hooks
import { format } from "date-fns";
import parse from "html-react-parser";
import React from "react";
import toast from "react-hot-toast";
import { FaEllipsisVertical } from "react-icons/fa6";

const statusColorMap: Record<string, ChipProps["color"]> = {
  1: "success",
  0: "warning",
};

interface ExtendedRenderCellProps extends RenderCellProps {
  item: Article;
}

const RenderCell: React.FC<ExtendedRenderCellProps> = ({ item, columnKey }) => {
  const queryClient = useQueryClient();

  const { onOpenChangeModalAction } = useModalAction();
  const { setSelectedArticle } = useArticleStore();

  const deleteFileMutation = useMutation({
    mutationFn: (filePath: { filePath: string }) =>
      usePost("api/deleteFile", { arg: filePath }),
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (articleId: string) =>
      useDelete(`api/articles?id=${articleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"],
        refetchType: "active",
      });
    },
    onError: (error) => {
      toast.error(`Error deleting the article: ${error}`);
    },
  });

  const handleDelete = async (articleId: string, thumbnailUrl: string) => {
    // Using toast.promise for the delete operation
    toast.promise(
      (async () => {
        // Delete the file first
        if (thumbnailUrl) {
          await deleteFileMutation.mutateAsync({ filePath: thumbnailUrl });
        }
        // Then delete the article
        await deleteArticleMutation.mutateAsync(articleId);
      })(),
      {
        loading: "Deleting article...",
        success: "Article and file deleted successfully!",
        error: "Error deleting the article or file",
      },
    );
  };

  const cellValue = item[columnKey as keyof Article];

  switch (columnKey) {
    case "category":
      return <div>{item?.category?.name}</div>;

    case "createdAt":
    case "updatedAt":
    case "publishedAt":
      return (
        <div>
          {format(
            new Date(cellValue as string | number),
            "MMM dd, yyyy HH:mm:ss",
          )}
        </div>
      );

    case "content":
      const contentPreview =
        typeof cellValue === "string" ? parse(cellValue.slice(0, 25)) : ""; // Preview 25 characters of content
      return <div>{contentPreview}</div>;

    case "status":
      return (
        <Chip
          className="capitalize"
          color={statusColorMap[item.status]}
          size="sm"
          variant="flat"
        >
          {item.status === 1 ? "Published" : "Draft"}
        </Chip>
      );

    case "actions":
      return (
        <div className="relative flex items-center justify-end gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <FaEllipsisVertical className="text-default-300" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  setSelectedArticle(item);
                  onOpenChangeModalAction();
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  if (item?.id && item?.thumbnailUrl) {
                    handleDelete(item.id, item.thumbnailUrl);
                  } else {
                    toast("Article ID or Thumbnail URL is missing!", {
                      icon: "ℹ️",
                    });
                  }
                }}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );

    default:
      // Return primitive types wrapped in a div to make them ReactNode-compatible
      return <div>{cellValue as React.ReactNode}</div>;
  }
};

export default RenderCell;
