import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setApiKey } from "@/lib/openai";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ApiKeyDialog({
  open,
  onOpenChange,
  onSuccess,
}: ApiKeyDialogProps) {
  const [key, setKey] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.startsWith("sk-")) {
      setError("يجب أن يبدأ مفتاح API بـ 'sk-'");
      return;
    }
    localStorage.setItem("openai_api_key", key);
    setApiKey(key);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>إدخال مفتاح OpenAI API</DialogTitle>
          <DialogDescription>
            أدخل مفتاح API الخاص بك لتفعيل ميزة تحويل النص إلى برومت ذكي
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="sk-..."
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError("");
              }}
              className="font-mono"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button type="submit" className="w-full">
            حفظ
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
