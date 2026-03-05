"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddMedication } from "@/hooks/use-AddMedication";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddMedicationModal({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const addMedication = useAddMedication({
    onSuccess: () => {
      onOpenChange(false);
      setName("");
      setDosage("");
      setScheduleTime("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanData = {
      name,
      dosage,
      scheduleTime,
    };

    addMedication.mutate(cleanData, {
      onSuccess: () => {
        toast.success("Medication added successfully");
      },
      onError: () => {
        toast.error("Failed to add medication");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-purple-600">
            Add Medication
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="pb-2">Medicine Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="pb-2">Dosage</Label>
            <Input value={dosage} onChange={(e) => setDosage(e.target.value)} />
          </div>

          <div>
            <Label className="pb-2">Schedule Time</Label>
            <Input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={addMedication.isPending}>
              {addMedication.isPending ? "Adding..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
