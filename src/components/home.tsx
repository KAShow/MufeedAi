import React from "react";
import PromptBuilderLayout from "./PromptBuilder/PromptBuilderLayout";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              مفيد AI
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              موقع يساعدك تبني مواقع
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-3 sm:py-6">
        <div className="h-[calc(100vh-8rem)]">
          <PromptBuilderLayout />
        </div>
      </main>

      <footer className="border-t bg-gradient-to-r from-primary/5 to-secondary/5 py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm text-muted-foreground">
            برنامج مفتوح المصدر صنع بواسطة
            <a
              href="https://github.com/KAShow/MufeedAi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline mr-1"
            >
              خليفة شويطر
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
