import React from "react";
import PromptBuilderLayout from "./PromptBuilder/PromptBuilderLayout";
import ExportDialog from "./PromptBuilder/ExportDialog";
import { Button } from "./ui/button";

export default function Home() {
  const [exportData, setExportData] = React.useState({
    goals: "",
    audience: "",
    requirements: "",
    preferences: "",
  });
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  const handleSave = (data: any) => {
    setExportData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">منشئ النصوص الذكي</h1>
          <Button variant="default" onClick={() => setIsExportOpen(true)}>
            تصدير
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="h-[calc(100vh-8rem)]">
          <PromptBuilderLayout onSave={handleSave} />
        </div>
      </main>

      <ExportDialog
        promptData={exportData}
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
      />
    </div>
  );
}
