"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import type { DashboardSport } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; category: string }) => void;
  initialData?: DashboardSport | null;
  title: string;
}

export function SportFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    setName(initialData?.name || "");
    setCategory(initialData?.category || "");
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>ឈ្មោះកីឡា</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>ប្រភេទ</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              ចាកចេញ
            </Button>
            <Button onClick={() => onSubmit({ name, category })}>
              រក្សាទុក
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
