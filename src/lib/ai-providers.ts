export type AIProvider = {
  id: string;
  name: string;
  keyPrefix: string;
  apiEndpoint: string;
  keyPlaceholder: string;
  keyInstructions: string;
  model: string;
};

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    keyPrefix: "sk-or",
    apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
    keyPlaceholder: "sk-or-...",
    keyInstructions: "https://openrouter.ai/keys",
    model: "google/gemini-2.0-pro-exp-02-05:free",
  },
];
