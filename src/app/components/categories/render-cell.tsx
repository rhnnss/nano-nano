import { useDelete } from "@/app/lib/fetcher";
import { useCategoryStore } from "@/app/stores/category";
import { useModalAction } from "@/app/stores/modal";
import { Category } from "@/app/types/article";
import { RenderCellProps } from "@/app/types/render-cell";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";
import toast from "react-hot-toast";
import { FaEllipsisVertical } from "react-icons/fa6";

interface ExtendedRenderCellProps extends RenderCellProps {
  item: Category;
}

const RenderCell: React.FC<ExtendedRenderCellProps> = ({ item, columnKey }) => {
  const queryClient = useQueryClient();

  const { onOpenChangeModalAction } = useModalAction();
  const { setSelectedCategory } = useCategoryStore();

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) =>
      useDelete(`api/categories?id=${categoryId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
        refetchType: "active",
      });
    },
    onError: (error) => {
      toast.error(`Error deleting the category: ${error}`);
    },
  });

  const handleDelete = async (categoryId: string) => {
    toast.promise(
      (async () => {
        await deleteCategoryMutation.mutateAsync(categoryId);
      })(),
      {
        loading: "Deleting category...",
        success: "Category deleted successfully!",
        error: "Error deleting the category or file",
      },
    );
  };

  const cellValue = item[columnKey as keyof Category];

  switch (columnKey) {
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
                  setSelectedCategory(item);
                  onOpenChangeModalAction();
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  if (item?.id) {
                    handleDelete(item.id);
                  } else {
                    toast("Category ID is missing!", {
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
      return <div>{cellValue as React.ReactNode}</div>;
  }
};

export default RenderCell;
