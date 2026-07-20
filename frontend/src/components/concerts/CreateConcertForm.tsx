"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createConcert } from "@/lib/api/concerts";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface CreateConcertFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateConcertForm({
  open,
  onClose,
  onSuccess,
}: CreateConcertFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setName("");
    setDescription("");
    setTotalSeats("");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await createConcert({
        name: name.trim(),
        description: description.trim(),
        totalSeats: Number(totalSeats),
      });
      toast.success("Concert created successfully");
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to create concert";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create New Concert">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Concert Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Summer Music Festival"
          required
          maxLength={200}
          error={errors.name}
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the concert..."
          required
          maxLength={2000}
          error={errors.description}
        />
        <Input
          label="Total Seats"
          type="number"
          min={1}
          value={totalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
          placeholder="100"
          required
          error={errors.totalSeats}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Concert
          </Button>
        </div>
      </form>
    </Modal>
  );
}
