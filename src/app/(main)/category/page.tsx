"use client";

import { useState } from "react";
import { Plus, Archive, ArchiveRestore, Trash2, Pencil } from "lucide-react";
import AddCategoryModal, {
  CategoryType,
  NewCategory,
} from "@/component/AddCategoryModal";
import EditCategoryModal from "@/component/EditCategoryModal";
import {
  Wallet,
  Landmark,
  PiggyBank,
  CreditCard,
  Banknote,
  Coins,
  TrendingUp,
  ShoppingCart,
  Home,
  Car,
  Heart,
  GraduationCap,
  Gift,
  UtensilsCrossed,
  Lightbulb,
  Wifi,
  Droplets,
  Zap,
  Bus,
  Fuel,
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategoryMutations";
import type {
  ApiCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/hooks/types";

// Map warna dari form modal (nama warna) ke hex yang diminta backend.
const COLOR_HEX_MAP: Record<string, string> = {
  green: "#22C55E",
  blue: "#3B82F6",
  yellow: "#EAB308",
  red: "#EF4444",
  purple: "#A855F7",
  orange: "#F97316",
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "trending-up": TrendingUp,
  "shopping-cart": ShoppingCart,
  home: Home,
  car: Car,
  heart: Heart,
  "graduation-cap": GraduationCap,
  gift: Gift,
  wallet: Wallet,
  landmark: Landmark,
  "piggy-bank": PiggyBank,
  "credit-card": CreditCard,
  banknote: Banknote,
  coins: Coins,
  food: UtensilsCrossed,
  electronics: Lightbulb,
  utilities: Zap,
  transportation: Bus,
  fuel: Fuel,
  internet: Wifi,
  water: Droplets,
};

export default function CategoryPage() {
  const [activeTab, setActiveTab] = useState<CategoryType>("expense");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(
    null
  );

  const activeType = activeTab === "expense" ? "EXPENSE" : "INCOME";

  // TanStack Query: list kategori di-cache per kombinasi
  // (type, includeArchived, includeSystem). Kategori system selalu disembunyikan.
  const {
    data: categories = [],
    isLoading,
    error,
  } = useCategories(activeType, includeArchived, false);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const mutationError =
    createCategory.error ?? updateCategory.error ?? deleteCategory.error;

  const handleAddCategory = (category: NewCategory) => {
    const payload: CreateCategoryRequest = {
      name: category.name,
      type: category.type === "expense" ? "EXPENSE" : "INCOME",
      icon: category.icon,
      color: COLOR_HEX_MAP[category.color] ?? category.color,
    };
    createCategory.mutate(payload, {
      onSuccess: () => setActiveTab(category.type),
    });
  };

  const handleToggleArchive = (cat: ApiCategory) => {
    updateCategory.mutate({
      categoryId: cat.categoryId,
      payload: {
        name: cat.name,
        // Endpoint memakai PUT yang me-replace seluruh field: ikutkan icon &
        // color saat ini supaya arsip/unarsip TIDAK menghapus icon/warna asli.
        icon: cat.icon ?? undefined,
        color: cat.color ?? undefined,
        isArchived: !cat.isArchived,
      },
    });
  };

  const handleDeleteCategory = (cat: ApiCategory) => {
    deleteCategory.mutate(cat.categoryId);
  };

  const handleUpdateCategory = (payload: UpdateCategoryRequest) => {
    if (!editingCategory) return;
    updateCategory.mutate(
      { categoryId: editingCategory.categoryId, payload },
      { onSuccess: () => setEditingCategory(null) }
    );
  };

  const getIconClass = (icon: string | null): string => {
    return icon || "wallet";
  };

  const resolveColor = (color: string | null): string => {
    return color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#4CAF50";
  };

  return (
    <>
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="bg-background border border-primary p-6 md:p-8 flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              CATEGORY_MANAGEMENT
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={includeArchived}
                onClick={() => setIncludeArchived((prev) => !prev)}
                className="flex items-center gap-2 border border-outline-variant px-3 py-2 font-label-caps text-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className={`relative inline-block w-8 h-4 border transition-colors ${
                    includeArchived
                      ? "bg-primary border-primary"
                      : "bg-background border-outline-variant"
                  }`}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 transition-all ${
                      includeArchived
                        ? "left-[14px] bg-background"
                        : "left-[2px] bg-on-surface-variant"
                    }`}
                  />
                </span>
                {includeArchived ? "HIDE ARCHIVED" : "SHOW ARCHIVED"}
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="border border-primary px-4 py-2 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                NEW_CATEGORY
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab("income")}
              className={`px-4 py-2 font-label-caps text-label-caps uppercase tracking-wider transition-colors cursor-pointer border ${
                activeTab === "income"
                  ? "bg-primary text-background border-primary"
                  : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
              }`}
            >
              INCOME
            </button>
            <button
              onClick={() => setActiveTab("expense")}
              className={`px-4 py-2 font-label-caps text-label-caps uppercase tracking-wider transition-colors cursor-pointer border ${
                activeTab === "expense"
                  ? "bg-primary text-background border-primary"
                  : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
              }`}
            >
              EXPENSE
            </button>
          </div>

          {(error || mutationError) && (
            <p className="border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider">
              *{" "}
              {error?.message ??
                mutationError?.message ??
                "GAGAL_MEMUAT_KATEGORI"}
            </p>
          )}

          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full min-w-[720px] table-fixed text-left border-collapse">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[14%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[10%] hidden md:table-column" />
                <col className="w-[22%]" />
              </colgroup>
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-dotted border-outline-variant">
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    NAME
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    TYPE
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    ICON
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    COLOR
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell">
                    ORDER
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-primary">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 px-4 text-center text-on-surface-variant"
                    >
                      LOADING_CATEGORIES...
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => {
                    const iconName = cat.icon ?? "wallet";
                    const color = resolveColor(cat.color);
                    const Icon = ICON_MAP[iconName] ?? Wallet;
                    return (
                      <tr
                        key={cat.categoryId}
                        className="hover:bg-surface-variant transition-colors border-b border-dotted border-outline-variant last:border-b-0"
                      >
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="w-8 h-8 flex items-center justify-center shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              <Icon className="w-4 h-4 text-background" />
                            </span>
                            <span className="truncate" title={cat.name}>
                              {cat.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`border px-2 py-1 text-[10px] font-label-caps uppercase tracking-wider ${
                              cat.type === "INCOME"
                                ? "border-primary text-primary"
                                : "border-outline-variant text-on-surface-variant"
                            }`}
                          >
                            {cat.type === "INCOME" ? "+ " : "- "}
                            {cat.type}
                          </span>
                        </td>
                        <td
                          className="py-4 px-4 whitespace-nowrap truncate"
                          title={getIconClass(cat.icon).toUpperCase()}
                        >
                          {getIconClass(cat.icon).toUpperCase()}
                        </td>
                        <td
                          className="py-4 px-4 whitespace-nowrap truncate"
                          title={color.toUpperCase()}
                        >
                          <span
                            className="inline-block w-4 h-4 border border-outline-variant align-middle mr-2 shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          {color.toUpperCase()}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap hidden md:table-cell">
                          {cat.displayOrder}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingCategory(cat)}
                              disabled={updateCategory.isPending}
                              title="EDIT_CATEGORY"
                              className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleArchive(cat)}
                              disabled={updateCategory.isPending}
                              title={
                                cat.isArchived
                                  ? "UNARCHIVE_CATEGORY"
                                  : "ARCHIVE_CATEGORY"
                              }
                              className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {cat.isArchived ? (
                                <ArchiveRestore className="w-3 h-3" />
                              ) : (
                                <Archive className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              disabled={deleteCategory.isPending}
                              title="DELETE_CATEGORY"
                              className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                {!isLoading && categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 px-4 text-center text-on-surface-variant"
                    >
                      NO_{activeTab.toUpperCase()}_CATEGORIES
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddCategoryModal
          defaultType={activeTab}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddCategory}
        />
      )}

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSubmit={handleUpdateCategory}
        />
      )}
    </>
  );
}
