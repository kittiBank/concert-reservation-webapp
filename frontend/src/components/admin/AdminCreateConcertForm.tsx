"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createConcert } from "@/lib/api/concerts";
import { ApiError } from "@/lib/api/client";
import { PublicIcon } from "@/components/ui/PublicIcon";
import { CheckCircleIcon } from "@/components/ui/CheckCircleIcon";
import { cn } from "@/lib/utils";

interface FormErrors {
  name?: string;
  totalSeats?: string;
  description?: string;
}

interface AdminCreateConcertFormProps {
  onSuccess: () => void;
}

const inputClassName =
  "h-11 w-full rounded-md border px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2";

function validateForm(
  name: string,
  totalSeats: string,
  description: string,
): FormErrors {
  const errors: FormErrors = {};
  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const seats = Number(totalSeats);

  if (!trimmedName) {
    errors.name = "Concert name is required";
  } else if (trimmedName.length > 200) {
    errors.name = "Concert name must not exceed 200 characters";
  }

  if (!totalSeats.trim()) {
    errors.totalSeats = "Total of seat is required";
  } else if (!Number.isInteger(seats) || seats < 1) {
    errors.totalSeats = "Total of seat must be at least 1";
  }

  if (!trimmedDescription) {
    errors.description = "Description is required";
  } else if (trimmedDescription.length > 2000) {
    errors.description = "Description must not exceed 2000 characters";
  }

  return errors;
}

export function AdminCreateConcertForm({ onSuccess }: AdminCreateConcertFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalSeats, setTotalSeats] = useState("500");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(name, totalSeats, description);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await createConcert({
        name: name.trim(),
        description: description.trim(),
        totalSeats: Number(totalSeats),
      });
      toast.success("Create successfully", {
        icon: <CheckCircleIcon />,
      });
      setName("");
      setDescription("");
      setTotalSeats("500");
      onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to create concert";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm md:h-full md:min-h-0">
      <div className="shrink-0 border-b border-[#E5E7EB] px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="text-base font-semibold text-[#1692EC] sm:text-lg">Create</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col px-4 py-4 sm:px-6 sm:py-5 md:min-h-0 md:flex-1 md:overflow-hidden"
      >
        <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Concert Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              placeholder="Please input concert name"
              maxLength={200}
              className={cn(
                inputClassName,
                errors.name
                  ? "border-[#F96464] focus:border-[#F96464] focus:ring-[#F96464]/20"
                  : "border-[#E5E7EB] focus:border-[#1692EC] focus:ring-[#1692EC]/20",
              )}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-[#F96464]">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Total of seat
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={totalSeats}
                onChange={(e) => {
                  setTotalSeats(e.target.value);
                  clearError("totalSeats");
                }}
                className={cn(
                  inputClassName,
                  "pr-10",
                  errors.totalSeats
                    ? "border-[#F96464] focus:border-[#F96464] focus:ring-[#F96464]/20"
                    : "border-[#E5E7EB] focus:border-[#1692EC] focus:ring-[#1692EC]/20",
                )}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <PublicIcon
                  src="/icon/user-white.png"
                  alt=""
                  size={18}
                  className="brightness-0 opacity-40"
                />
              </span>
            </div>
            {errors.totalSeats && (
              <p className="mt-1.5 text-sm text-[#F96464]">{errors.totalSeats}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <label className="mb-2 block shrink-0 text-sm font-medium text-[#374151]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearError("description");
            }}
            placeholder="Please input description"
            maxLength={2000}
            className={cn(
              "min-h-[80px] w-full flex-1 resize-none rounded-md border px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2",
              errors.description
                ? "border-[#F96464] focus:border-[#F96464] focus:ring-[#F96464]/20"
                : "border-[#E5E7EB] focus:border-[#1692EC] focus:ring-[#1692EC]/20",
            )}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-[#F96464]">{errors.description}</p>
          )}
        </div>

        <div className="mt-3 flex shrink-0 justify-end sm:mt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1692EC] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0070A4] disabled:opacity-60 sm:h-9 sm:w-auto"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <PublicIcon src="/icon/save.png" alt="" size={18} />
                Save
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
