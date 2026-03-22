"use client";

import { useState, useEffect, FormEvent } from "react";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "color" | "select";
  options?: string[];
  required?: boolean;
}

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isDeleting?: boolean;
  onDelete?: () => Promise<void>;
}

export default function CrudModal({
  isOpen,
  onClose,
  title,
  fields,
  initialData,
  onSubmit,
  onDelete,
}: CrudModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeletingState, setIsDeletingState] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        const defaults: Record<string, unknown> = {};
        fields.forEach((f) => {
          if (f.type === "number") defaults[f.name] = 0;
          else if (f.type === "color") defaults[f.name] = "#3b82f6";
          else if (f.type === "select" && f.options?.length)
            defaults[f.name] = f.options[0];
          else defaults[f.name] = "";
        });
        setFormData(defaults);
      }
      setConfirmDelete(false);
      setIsDeletingState(false);
    }
  }, [isOpen, initialData, fields]);

  if (!isOpen) return null;

  const handleChange = (
    name: string,
    value: string | number,
    type: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeletingState(true);
    try {
      await onDelete?.();
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeletingState(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={(formData[field.name] as string) ?? ""}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value, field.type)
                  }
                  required={field.required}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              ) : field.type === "select" ? (
                <select
                  value={(formData[field.name] as string) ?? ""}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value, field.type)
                  }
                  required={field.required}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "color" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={(formData[field.name] as string) ?? "#3b82f6"}
                    onChange={(e) =>
                      handleChange(field.name, e.target.value, field.type)
                    }
                    className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={(formData[field.name] as string) ?? ""}
                    onChange={(e) =>
                      handleChange(field.name, e.target.value, field.type)
                    }
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#3b82f6"
                  />
                </div>
              ) : (
                <input
                  type={field.type}
                  value={(formData[field.name] as string | number) ?? ""}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value, field.type)
                  }
                  required={field.required}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div>
              {onDelete && initialData && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeletingState}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    confirmDelete
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  } disabled:opacity-50`}
                >
                  {isDeletingState
                    ? "Suppression..."
                    : confirmDelete
                    ? "Confirmer la suppression"
                    : "Supprimer"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : initialData
                  ? "Modifier"
                  : "Créer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
