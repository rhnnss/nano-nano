import { usePost, usePostFile, usePut } from "@/app/lib/fetcher";
import { useProductStore } from "@/app/stores/product";
import { Product } from "@/app/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ThumbnailDropzone from "../thumbnail-dropzone";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const productSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "The product name is required. Please provide a valid name.",
    })
    .max(255, {
      message:
        "The product name is too long. Please limit it to 255 characters.",
    }),
  description: z.string().min(1, {
    message:
      "The product description is required. Please provide a valid description.",
  }),
  buyLink: z.string().url({
    message: "Please provide a valid purchase link (URL) for the product.",
  }),
  isActive: z
    .boolean({ required_error: "Please specify if the product is active." })
    .default(false),
});
interface ModalCreateProps {
  isOpen: boolean;
  onOpenChange: (isOpen?: boolean) => void;
}

const ModalCreate: React.FC<ModalCreateProps> = ({ isOpen, onOpenChange }) => {
  const queryClient = useQueryClient();

  const { selectedProduct, setSelectedProduct } = useProductStore();

  const createProductMutation = useMutation({
    mutationFn: (productData: Product) =>
      usePost("api/products", { arg: productData }),
  });

  const updateProductMutation = useMutation({
    mutationFn: (productData: Product) =>
      usePut(`api/products?id=${selectedProduct?.id}`, { arg: productData }),
  });

  const uploadFileMutation = useMutation({
    mutationFn: (formData: FormData) =>
      usePostFile("api/upload", { arg: formData }),
  });

  const deleteFileMutation = useMutation({
    mutationFn: (filePath: { filePath: string }) =>
      usePost("api/deleteFile", { arg: filePath }),
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<{
    name: string;
    description: string;
    buyLink: string;
    isActive: boolean;
  }>({
    resolver: zodResolver(productSchema),
  });

  const handleFileAccepted = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: {
    name: string;
    description: string;
    buyLink: string;
    isActive: boolean;
  }) => {
    if (!file && !selectedProduct?.id) {
      toast.error("Please upload a file", { duration: 5000 });
      return;
    }
    try {
      let uploadResponse = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", "products");
        uploadResponse = await uploadFileMutation.mutateAsync(formData);
        if (!uploadResponse || !uploadResponse.filePath) {
          throw new Error("Failed to upload file");
        }
        setFilePath(uploadResponse.filePath);
      }
      const productData = {
        ...data,
        isActive: data.isActive ? 1 : 0,
        imageUrl: uploadResponse?.filePath || selectedProduct?.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (selectedProduct?.id) {
        const updateResponse = await updateProductMutation.mutateAsync({
          ...productData,
          id: selectedProduct.id,
        });
        if (!updateResponse?.success) {
          toast.error(updateResponse?.message, { duration: 5000 });
          return;
        }
        toast.success(updateResponse?.message);
      } else {
        console.log("productData", productData);
        const productResponse =
          await createProductMutation.mutateAsync(productData);
        if (!productResponse?.success) {
          toast.error(productResponse?.message, { duration: 5000 });
          await deleteFileMutation.mutateAsync({
            filePath: uploadResponse.filePath,
          });
          return;
        }
        toast.success(productResponse?.message);
      }
    } catch (error) {
      if (filePath) {
        await deleteFileMutation.mutateAsync({ filePath });
      }
      toast.error("Failed to create product", { duration: 5000 });
    } finally {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "active",
      });
      setSelectedProduct(null);
      onOpenChange();
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (selectedProduct) {
      setValue("name", selectedProduct.name);
      setValue("buyLink", selectedProduct.buyLink);
      setValue("description", selectedProduct.description);
      setValue("isActive", selectedProduct.isActive ? true : false);
      setPreview(selectedProduct.imageUrl || null);
    }

    if (!isOpen) {
      setFile(null);
      setPreview(null);
      reset();
    }
  }, [isOpen, selectedProduct]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        setSelectedProduct(null);
        onOpenChange(isOpen);
      }}
      size="2xl"
      scrollBehavior="inside"
      isDismissable
      isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader>
          {selectedProduct?.id ? "Update Product" : "Create New Product"}
        </ModalHeader>
        <ModalBody>
          <form className="relative">
            <div className="grid grid-cols-1 gap-4">
              <ThumbnailDropzone onFileAccepted={handleFileAccepted} />
              {preview && (
                <div className="relative flex flex-col items-center justify-center">
                  <Image
                    src={preview}
                    alt="thumbnail preview"
                    width={500}
                    height={300}
                  />
                  <Button
                    color="danger"
                    className="absolute right-2 top-2"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Name"
                      {...field}
                      onChange={field.onChange}
                      isInvalid={!!errors.name}
                      errorMessage={errors.name?.message?.toString() || ""}
                    />
                  )}
                />
                <Controller
                  name="buyLink"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Buy Link"
                      {...field}
                      isInvalid={!!errors.buyLink}
                      errorMessage={errors.buyLink?.message?.toString() || ""}
                    />
                  )}
                />
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      color="warning"
                      isSelected={field.value}
                      onValueChange={field.onChange}
                      defaultSelected={false}
                    >
                      Product Active
                    </Switch>
                  )}
                />
              </div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-sm text-gray-500">
                      Description
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={`h-40 max-h-40 ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500">
                        {errors.description?.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="flat"
            onClick={() => {
              setSelectedProduct(null);
              onOpenChange();
            }}
          >
            Cancel
          </Button>
          <Button
            color="warning"
            onClick={handleSubmit(onSubmit)}
            isDisabled={
              createProductMutation.isPending || uploadFileMutation.isPending
            }
            isLoading={
              createProductMutation.isPending || uploadFileMutation.isPending
            }
          >
            {selectedProduct?.id ? "Update" : "Create"} Product
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalCreate;
