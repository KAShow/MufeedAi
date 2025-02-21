import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingDialogProps {
  open: boolean;
  timeLeft: number;
}

export function LoadingDialog({ open, timeLeft }: LoadingDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px] text-center p-8">
        <DialogHeader>
          <DialogTitle>يرجى الانتظار</DialogTitle>
          <DialogDescription>جاري توليد البرومت المناسب...</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-primary">{timeLeft} ثانية</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
