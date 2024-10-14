import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCategoryStore } from "@/app/stores/category";
import { usePost, usePut } from "@/app/lib/fetcher";
import { Category } from "@/app/types/article";

const categorySchema = z.object({
  name: z.string().min(3, {
    message: "Name is required and should be at least 3 characters",
  }),
});

interface ModalCreateProps {
  isOpen: boolean;
  onOpenChange: (isOpen?: boolean) => void;
}

const ModalCreate: React.FC<ModalCreateProps> = ({ isOpen, onOpenChange }) => {
  const queryClient = useQueryClient();

  const { selectedCategory, setSelectedCategory } = useCategoryStore();

  const createCategoryMutation = useMutation({
    mutationFn: (categoryData: Category) =>
      usePost("api/categories", { arg: categoryData }),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (categoryData: Category) =>
      usePut(`api/categories?id=${selectedCategory?.id}`, {
        arg: categoryData,
      }),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<{ name: string }>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: { name: string }) => {
    try {
      const categoryData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (selectedCategory?.id) {
        const updateResponse = await updateCategoryMutation.mutateAsync({
          ...categoryData,
          id: selectedCategory.id,
        });
        if (!updateResponse?.success) {
          toast.error(updateResponse?.message, { duration: 5000 });
          return;
        }
        toast.success(updateResponse?.message);
      } else {
        const categoryResponse =
          await createCategoryMutation.mutateAsync(categoryData);
        if (!categoryResponse?.success) {
          toast.error(categoryResponse?.message, { duration: 5000 });

          return;
        }
        toast.success(categoryResponse?.message);
      }
    } catch (error) {
      toast.error("Failed to create category", { duration: 5000 });
    } finally {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
        refetchType: "active",
      });
      setSelectedCategory(null);
      onOpenChange();
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      setValue("name", selectedCategory.name);
    }

    if (!isOpen) {
      reset();
    }
  }, [isOpen, selectedCategory]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        setSelectedCategory(null);
        onOpenChange(isOpen);
      }}
      size="2xl"
      scrollBehavior="inside"
      isDismissable
      isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader>
          {selectedCategory?.id ? "Update Category" : "Create New Category"}
        </ModalHeader>
        <ModalBody>
          <form
            className="relative"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Name"
                    {...field}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message?.toString() || ""}
                  />
                )}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="flat"
            onClick={() => {
              setSelectedCategory(null);
              onOpenChange();
            }}
          >
            Cancel
          </Button>
          <Button
            color="warning"
            onClick={handleSubmit(onSubmit)}
            isDisabled={createCategoryMutation.isPending}
            isLoading={createCategoryMutation.isPending}
          >
            {selectedCategory?.id ? "Update" : "Create"} Category
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalCreate;
