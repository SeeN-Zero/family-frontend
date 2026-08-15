"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check } from "lucide-react";
import { updateCategorySchema, type UpdateCategoryInput } from "@/features/categories/schemas";
import type { ApiCategory, UpdateCategoryRequest } from "@/hooks/types";
import {
  CATEGORY_ICON_OPTIONS,
  COLOR_OPTIONS,
  hexToColorName,
} from "@/lib/form-options";

type EditCategoryModalProps = {
  category: ApiCategory;
  isPending?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSubmit: (payload: UpdateCategoryRequest) => void;
};

export default function EditCategoryModal({
  category,
  isPending = false,
  errorMessage,
  onClose,
  onSubmit,
}: EditCategoryModalProps) {
  const form = useForm<UpdateCategoryInput, unknown, UpdateCategoryRequest>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      icon: category.icon ?? "trending-up",
      color: category.color ?? "#22C55E",
      // PUT di backend me-replace seluruh field — sertakan displayOrder agar
      // edit nama/icon/warna tidak menghapus urutan kategori.
      displayOrder: category.displayOrder,
    },
  });
  const icon = useWatch({ control: form.control, name: "icon" }) ?? "trending-up";
  const color = hexToColorName(useWatch({ control: form.control, name: "color" }) ?? "#22C55E");

  const handleSubmit = (values: UpdateCategoryRequest) => {
    onSubmit(values);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
            * EDIT_CATEGORY
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-outline-variant hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
          {errorMessage && (
            <p className="border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider">
              * {errorMessage}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-cat-name"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              CATEGORY_NAME
            </label>
            <input
              id="edit-cat-name"
              type="text"
              {...form.register("name")}
              placeholder="e.g. TRANSPORTATION"
              required
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              ICON
            </label>
            <div className="grid grid-cols-7 gap-2">
              {CATEGORY_ICON_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = icon === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => form.setValue("icon", opt.name, { shouldDirty: true, shouldValidate: true })}
                    className={`flex items-center justify-center aspect-square border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-background border-primary"
                        : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              COLOR
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((opt) => {
                const isSelected = color === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => form.setValue("color", opt.hex, { shouldDirty: true, shouldValidate: true })}
                    className={`aspect-square border-2 transition-colors cursor-pointer flex items-center justify-center ${opt.className} ${
                      isSelected
                        ? "border-primary"
                        : "border-transparent hover:border-outline-variant"
                    }`}
                  >
                    {isSelected && <Check className="w-5 h-5 text-background" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "SAVING..." : "UPDATE_CATEGORY"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
