import { useModalAction } from "@/app/stores/modal";
import { Button } from "@nextui-org/react";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import ModalCreate from "./modal-create";

const TableActions: React.FC = () => {
  const { isOpenModalAction, onOpenChangeModalAction } = useModalAction();

  return (
    <div className="flex flex-col gap-4">
      <ModalCreate
        isOpen={isOpenModalAction}
        onOpenChange={onOpenChangeModalAction}
      />
      <div className="flex gap-3">
        <Button
          color="warning"
          endContent={<FaPlus />}
          onClick={onOpenChangeModalAction}
        >
          Add New
        </Button>
      </div>
    </div>
  );
};

export default TableActions;
