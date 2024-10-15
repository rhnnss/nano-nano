import { useGet, usePost, usePostFile, usePut } from "@/app/lib/fetcher";
import { useArticleStore } from "@/app/stores/article";
import { Article } from "@/app/types/article";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, now } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ThumbnailDropzone from "../thumbnail-dropzone";
import { omit } from "lodash";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const postSchema = z.object({
  title: z.string().min(3, {
    message: "Title is required and should be at least 3 characters",
  }),
  slug: z.string().min(3, {
    message: "Slug is required and should be at least 3 characters",
  }),
  content: z.string().nonempty({ message: "Content cannot be empty" }),
  status: z.enum(["0", "1"]),
  categoryId: z.string().nonempty({ message: "Category is required" }),
});

interface ModalCreateProps {
  isOpen: boolean;
  onOpenChange: (isOpen?: boolean) => void;
}

const ModalCreate: React.FC<ModalCreateProps> = ({ isOpen, onOpenChange }) => {
  const queryClient = useQueryClient();

  const { selectedArticle, setSelectedArticle } = useArticleStore();

  const { data: categories, isLoading: fetchingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => useGet("api/categories?limit=9999"),
    staleTime: 5000,
  });

  const createPostMutation = useMutation({
    mutationFn: (postData: Article) =>
      usePost("api/articles", { arg: postData }),
  });

  const updatePostMutation = useMutation({
    mutationFn: (postData: Article) =>
      usePut(`api/articles?id=${selectedArticle?.id}`, { arg: postData }),
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
  } = useForm<{
    title: string;
    slug: string;
    content: string;
    status: string;
    categoryId: string;
    publishedAt: any;
  }>({
    resolver: zodResolver(postSchema),
  });

  const status = watch("status");

  const handleFileAccepted = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: {
    title: string;
    slug: string;
    content: string;
    status: string;
    categoryId: string;
    publishedAt: any;
  }) => {
    if (!file && !selectedArticle?.id) {
      toast.error("Please upload a file", { duration: 5000 });
      return;
    }
    try {
      let uploadResponse = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        uploadResponse = await uploadFileMutation.mutateAsync(formData);
        if (!uploadResponse || !uploadResponse.filePath) {
          throw new Error("Failed to upload file");
        }
        setFilePath(uploadResponse.filePath);
      }
      const postData = {
        ...data,
        thumbnailUrl: uploadResponse?.filePath || selectedArticle?.thumbnailUrl,
        status: parseInt(data.status),
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (selectedArticle?.id) {
        const updateResponse = await updatePostMutation.mutateAsync({
          ...(postData.status === 1
            ? {
                ...postData,
                publishedAt: new Date().toISOString(),
              }
            : {
                ...omit(postData, ["publishedAt"]),
                publishedAt: selectedArticle?.publishedAt,
              }),
          id: selectedArticle.id,
        });
        if (!updateResponse?.success) {
          toast.error(updateResponse?.message, { duration: 5000 });
          return;
        }
        toast.success(updateResponse?.message);
      } else {
        const postResponse = await createPostMutation.mutateAsync(
          postData?.status === 1
            ? {
                ...postData,
                publishedAt: new Date(
                  watch("publishedAt").toDate("yyyy-MM-dd HH:mm:ss"),
                ),
              }
            : postData,
        );
        if (!postResponse?.success) {
          toast.error(postResponse?.message, { duration: 5000 });
          await deleteFileMutation.mutateAsync({
            filePath: uploadResponse.filePath,
          });
          return;
        }
        toast.success(postResponse?.message);
      }
    } catch (error) {
      if (filePath) {
        await deleteFileMutation.mutateAsync({ filePath });
      }
      toast.error("Failed to create post", { duration: 5000 });
    } finally {
      await queryClient.invalidateQueries({
        queryKey: ["articles"],
        refetchType: "active",
      });
      setSelectedArticle(null);
      onOpenChange();
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (selectedArticle) {
      setValue("title", selectedArticle.title);
      setValue("slug", selectedArticle.slug);
      setValue("content", selectedArticle.content);
      setValue("status", (selectedArticle.status || 0).toString());
      setValue("categoryId", selectedArticle.categoryId);
      setPreview(selectedArticle.thumbnailUrl || null);
    }

    if (!isOpen) {
      setFile(null);
      setPreview(null);
      reset();
    }
  }, [isOpen, selectedArticle]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        setSelectedArticle(null);
        onOpenChange(isOpen);
      }}
      size="2xl"
      scrollBehavior="inside"
      isDismissable
      isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader>
          {selectedArticle?.id ? "Update Post" : "Create New Post"}
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
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setValue(
                          "slug",
                          e.target.value.replace(/\s+/g, "-").toLowerCase(),
                          {
                            shouldValidate: true,
                          },
                        );
                      }}
                      isInvalid={!!errors.title}
                      errorMessage={errors.title?.message?.toString() || ""}
                    />
                  )}
                />
                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Slug"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value.replace(/\s+/g, "-").toLowerCase(),
                        );
                      }}
                      isInvalid={!!errors.slug}
                      errorMessage={errors.slug?.message?.toString() || ""}
                    />
                  )}
                />
              </div>

              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    label="Category"
                    {...field}
                    isLoading={fetchingCategories}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                    placeholder="Select a category"
                    defaultItems={categories?.data || []}
                    isInvalid={!!errors.categoryId}
                    errorMessage={errors.categoryId?.message?.toString()}
                    listboxProps={{
                      emptyContent: `No categories found`,
                    }}
                  >
                    {(item: { id: string; name: string }) => (
                      <AutocompleteItem key={item.id}>
                        {item.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />

              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-sm text-gray-500">
                      Content
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={`h-40 max-h-40 ${
                        errors.content ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.content && (
                      <p className="text-red-500">
                        {errors.content?.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    label="Status"
                    {...field}
                    className="mt-11"
                    isLoading={false}
                    selectedKey={field.value}
                    onSelectionChange={(value) => {
                      setValue("publishedAt", now(getLocalTimeZone()), {
                        shouldTouch: true,
                      });
                      field.onChange(value);
                    }}
                    placeholder="Select a status"
                    defaultItems={[
                      {
                        id: "0",
                        name: "Draft",
                      },
                      {
                        id: "1",
                        name: "Published",
                      },
                    ]}
                    isInvalid={!!errors.status}
                    errorMessage={errors.status?.message?.toString()}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.id}>
                        {item.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />

              {status === "1" && (
                <Controller
                  name="publishedAt"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Published Date"
                      {...field}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      hideTimeZone
                      showMonthAndYearPickers
                      isInvalid={!!errors.publishedAt}
                      errorMessage={errors.publishedAt?.message?.toString()}
                      defaultValue={now(getLocalTimeZone())}
                    />
                  )}
                />
              )}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="flat"
            onClick={() => {
              setSelectedArticle(null);
              onOpenChange();
            }}
          >
            Cancel
          </Button>
          <Button
            color="warning"
            onClick={handleSubmit(onSubmit)}
            isDisabled={
              createPostMutation.isPending || uploadFileMutation.isPending
            }
            isLoading={
              createPostMutation.isPending || uploadFileMutation.isPending
            }
          >
            {selectedArticle?.id ? "Update" : "Create"} Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalCreate;
