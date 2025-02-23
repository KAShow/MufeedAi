import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Wand2 } from "lucide-react";

export default function EditPromptStep() {
  const [prompt, setPrompt] = React.useState("");

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">تحرير البرومت</h2>
        <p className="text-muted-foreground">
          قم بتحرير البرومت النهائي قبل التصدير
        </p>
      </div>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="اكتب البرومت هنا..."
        className="min-h-[300px] text-lg"
      />

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" className="gap-2">
          <ArrowRight className="h-4 w-4" />
          السابق
        </Button>

        <Button className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Wand2 className="h-4 w-4" />
          توليد
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
