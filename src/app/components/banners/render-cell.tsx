import { useModalAction } from "@/app/stores/modal";
import { useBannerStore } from "@/app/stores/banner";
import { Banner } from "@/app/types/banner";
import { RenderCellProps } from "@/app/types/render-cell";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Switch,
} from "@nextui-org/react";
import { format } from "date-fns";
import parse from "html-react-parser";
import React from "react";
import toast from "react-hot-toast";
import { FaLink } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

interface ExtendedRenderCellProps extends RenderCellProps {
  item: Banner;
}

const RenderCell: React.FC<ExtendedRenderCellProps> = ({
  item,
  columnKey,
  onDelete,
  onUpdate,
}) => {
  const { onOpenChangeModalAction } = useModalAction();
  const { setSelectedBanner } = useBannerStore();

  const cellValue = item[columnKey as keyof Banner];

  switch (columnKey) {
    case "createdAt":
    case "updatedAt":
      return (
        <div>
          {format(
            new Date(cellValue as string | number),
            "MMM dd, yyyy HH:mm:ss",
          )}
        </div>
      );

    case "description":
      const descriptionPreview =
        typeof cellValue === "string"
          ? parse(`${cellValue.slice(0, 25)}...`)
          : "";
      return <p>{descriptionPreview}</p>;

    case "ctaUrl":
      return (
        <Link
          isExternal
          showAnchorIcon
          href={cellValue as string}
          anchorIcon={<FaLink />}
          color="warning"
        >
          Visit Link
        </Link>
      );

    case "isActive":
      return (
        <Switch
          color="warning"
          isSelected={!!cellValue}
          onValueChange={(value) => {
            onUpdate?.({ ...item, isActive: value ? 1 : 0 });
          }}
        />
      );

    case "displayOrder":
      return cellValue ? <Chip>{cellValue}</Chip> : <div>-</div>;

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
                  setSelectedBanner(item);
                  onOpenChangeModalAction();
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  if (item?.id && item?.imageUrl) {
                    onDelete?.(item.id, item.imageUrl);
                  } else {
                    toast("Banner ID or Thumbnail URL is missing!", {
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
