import { AI_PROVIDERS } from "./ai-providers";

export const getApiKey = (providerId: string) => {
  // أولاً نحاول الحصول على المفتاح من ملف .env
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (envKey) return envKey;

  // إذا لم يكن هناك مفتاح في .env، نبحث في localStorage
  return localStorage.getItem(`${providerId}_api_key`);
};

export const generateAIPrompt = async (
  content: string,
  providerId = "openrouter",
): Promise<string> => {
  const provider = AI_PROVIDERS.find((p) => p.id === providerId);
  if (!provider) throw new Error("مزود غير معروف");

  const apiKey = getApiKey(providerId);
  if (!apiKey) throw new Error("API Key غير متوفر");

  try {
    const response = await fetch(provider.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tempolabs.ai",
        "X-Title": "Tempo Labs",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: "user",
            content: `أريد برومت لإنشاء موقع مع المواصفات التالية:\n\n${content}\n\nأرجو تحليل هذه المواصفات وإعطائي برومت مناسب لإنشاء هذا الموقع.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.error?.message || "خطأ في الاتصال بالخدمة");
    }

    const data = await response.json();
    console.log("API Response:", data);

    return data.choices?.[0]?.message?.content || "خطأ في معالجة الاستجابة";
  } catch (error) {
    console.error("Error generating AI prompt:", error);
    throw new Error("حدث خطأ أثناء توليد البرومت");
  }
};
