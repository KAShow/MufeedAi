import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AI_PROVIDERS } from "@/lib/ai-providers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ApiKeyFormProps {
  providerId: string;
  onSubmit: (key: string) => void;
}

function ApiKeyForm({ providerId, onSubmit }: ApiKeyFormProps) {
  const [key, setKey] = React.useState(
    () => localStorage.getItem(`${providerId}_api_key`) || "",
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [error, setError] = React.useState("");
  const provider = AI_PROVIDERS.find((p) => p.id === providerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !key) return;

    // حفظ المفتاح مباشرة في localStorage
    localStorage.setItem(`${providerId}_api_key`, key);
    onSubmit(key);
  };

  if (!provider) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2 relative">
        {key && !isEditing ? (
          <div className="flex items-center gap-2">
            <Input type="password" value="••••••••" disabled />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Button>
          </div>
        ) : (
          <Input
            type="password"
            placeholder={provider.keyPlaceholder}
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setError("");
            }}
            className="font-mono"
          />
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-sm text-muted-foreground">
          يمكنك الحصول على المفتاح من:
          <a
            href={provider.keyInstructions}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline mr-1"
          >
            {provider.name}
          </a>
        </p>
      </div>

      <Button type="submit" className="w-full">
        حفظ
      </Button>
    </form>
  );
}

export default function ApiKeyDialog({
  open,
  onOpenChange,
  onSuccess,
}: ApiKeyDialogProps) {
  const [selectedProvider] = React.useState("gemini");

  const handleSubmit = (key: string) => {
    localStorage.setItem(`${selectedProvider}_api_key`, key);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>إدخال مفتاح API</DialogTitle>
          <DialogDescription>
            اختر مزود الذكاء الاصطناعي وأدخل مفتاح API الخاص بك
          </DialogDescription>
        </DialogHeader>
        <ApiKeyForm providerId="gemini" onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
