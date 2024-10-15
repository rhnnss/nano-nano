import { usePost, usePostFile, usePut } from "@/app/lib/fetcher";
import { useBannerStore } from "@/app/stores/banner";
import { Banner } from "@/app/types/banner";
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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ThumbnailDropzone from "../thumbnail-dropzone";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type FormValuesType = {
  title: string;
  description: string;
  ctaUrl: string;
  isActive: boolean;
  displayOrder: string;
};

const bannerSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "The banner title is required. Please provide a valid title.",
    })
    .max(255, {
      message:
        "The banner title is too long. Please limit it to 255 characters.",
    }),
  description: z.string().min(1, {
    message:
      "The banner description is required. Please provide a valid description.",
  }),
  ctaUrl: z.string().url({
    message: "The banner CTA URL is required. Please provide a valid URL.",
  }),
  isActive: z
    .boolean({ required_error: "Please specify if the banner is active." })
    .default(false),
  displayOrder: z
    .preprocess(
      (val) => (val === "" ? null : val), // Convert empty string to null
      z.union([
        z.string().regex(/^\d+$/, {
          message: "The display order must be a number.",
        }),
        z.null(),
      ]),
    )
    .optional(),
});
interface ModalCreateProps {
  isOpen: boolean;
  onOpenChange: (isOpen?: boolean) => void;
}

const ModalCreate: React.FC<ModalCreateProps> = ({ isOpen, onOpenChange }) => {
  const queryClient = useQueryClient();

  const { selectedBanner, setSelectedBanner } = useBannerStore();

  const createBannerMutation = useMutation({
    mutationFn: (bannerData: Banner) =>
      usePost("api/banners", { arg: bannerData }),
  });

  const updateBannerMutation = useMutation({
    mutationFn: (bannerData: Banner) =>
      usePut(`api/banners?id=${selectedBanner?.id}`, { arg: bannerData }),
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
    watch,
  } = useForm<FormValuesType>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      description: "",
      ctaUrl: "",
      isActive: false,
      displayOrder: "",
    },
  });

  console.log("errors: ", errors);

  const watchIsActive = watch("isActive");

  const handleFileAccepted = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit: SubmitHandler<FormValuesType> = async (data) => {
    if (!file && !selectedBanner?.id) {
      toast.error("Please upload a file", { duration: 5000 });
      return;
    }
    try {
      let uploadResponse = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", "banners");
        uploadResponse = await uploadFileMutation.mutateAsync(formData);
        if (!uploadResponse || !uploadResponse.filePath) {
          throw new Error("Failed to upload file");
        }
        setFilePath(uploadResponse.filePath);
      }
      console.log("data: ", data);
      const bannerData: Banner = {
        ...data,
        displayOrder: data?.isActive ? parseInt(watch("displayOrder")) : null,
        isActive: data.isActive ? 1 : 0,
        imageUrl: uploadResponse?.filePath || selectedBanner?.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log(bannerData);

      if (selectedBanner?.id) {
        const updateResponse = await updateBannerMutation.mutateAsync({
          ...bannerData,
          id: selectedBanner.id,
        });
        if (!updateResponse?.success) {
          toast.error(updateResponse?.message, { duration: 5000 });
          return;
        }
        toast.success(updateResponse?.message);
      } else {
        const bannerResponse =
          await createBannerMutation.mutateAsync(bannerData);
        if (!bannerResponse?.success) {
          toast.error(bannerResponse?.message, { duration: 5000 });
          await deleteFileMutation.mutateAsync({
            filePath: uploadResponse.filePath,
          });
          return;
        }
        toast.success(bannerResponse?.message);
      }
    } catch (error) {
      if (filePath) {
        await deleteFileMutation.mutateAsync({ filePath });
      }
      toast.error("Failed to create banner", { duration: 5000 });
    } finally {
      await queryClient.invalidateQueries({
        queryKey: ["banners"],
        refetchType: "active",
      });
      setSelectedBanner(null);
      onOpenChange();
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (selectedBanner) {
      setValue("title", selectedBanner.title);
      setValue("ctaUrl", selectedBanner.ctaUrl || "");
      setValue("description", selectedBanner.description);
      setValue("isActive", selectedBanner.isActive ? true : false);
      setValue("displayOrder", selectedBanner.displayOrder?.toString() || "0");
      setPreview(selectedBanner.imageUrl || null);
    }

    if (!isOpen) {
      setFile(null);
      setPreview(null);
      reset();
    }
  }, [isOpen, selectedBanner]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        setSelectedBanner(null);
        onOpenChange(isOpen);
      }}
      size="2xl"
      scrollBehavior="inside"
      isDismissable
      isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader>
          {selectedBanner?.id ? "Update Banner" : "Create New Banner"}
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
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Title"
                      {...field}
                      onChange={field.onChange}
                      isInvalid={!!errors.title}
                      errorMessage={errors.title?.message?.toString() || ""}
                    />
                  )}
                />
                <Controller
                  name="ctaUrl"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Cta Link"
                      {...field}
                      isInvalid={!!errors.ctaUrl}
                      errorMessage={errors.ctaUrl?.message?.toString() || ""}
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
                      onValueChange={(e) => {
                        field.onChange(e);
                        setValue("displayOrder", "", {
                          shouldValidate: true,
                          shouldTouch: true,
                        });
                      }}
                      defaultSelected={false}
                    >
                      Banner Active
                    </Switch>
                  )}
                />

                {watchIsActive && (
                  <Controller
                    shouldUnregister
                    name="displayOrder"
                    control={control}
                    render={({ field }) => (
                      <Input
                        color="default"
                        type="number"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        label="Display Order"
                        {...field}
                        value={field.value} // eslint-disable-line
                        isInvalid={!!errors.displayOrder}
                        errorMessage={
                          errors.displayOrder?.message?.toString() || ""
                        }
                      />
                    )}
                  />
                )}
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
              setSelectedBanner(null);
              onOpenChange();
            }}
          >
            Cancel
          </Button>
          <Button
            color="warning"
            onClick={handleSubmit(onSubmit)}
            isDisabled={
              createBannerMutation.isPending || uploadFileMutation.isPending
            }
            isLoading={
              createBannerMutation.isPending || uploadFileMutation.isPending
            }
          >
            {selectedBanner?.id ? "Update" : "Create"} Banner
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalCreate;
