import { AI_PROVIDERS } from "./ai-providers";

export const getApiKey = (providerId: string) => {
  // أولاً نحاول الحصول على المفتاح من ملف .env
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;

  // إذا لم يكن هناك مفتاح في .env، نبحث في localStorage
  return localStorage.getItem(`${providerId}_api_key`);
};

export const generateAIPrompt = async (
  content: string,
  providerId = "gemini",
): Promise<string> => {
  const provider = AI_PROVIDERS.find((p) => p.id === providerId);
  if (!provider) throw new Error("مزود غير معروف");

  const apiKey = getApiKey(providerId);
  if (!apiKey) throw new Error("API Key غير متوفر");

  try {
    const response = await fetch(`${provider.apiEndpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `قم بتحويل المتطلبات التالية إلى برومت منظم ومفصل:\n\n${content}\n\nيجب أن يتضمن البرومت:\n1. وصف دقيق للموقع وأهدافه\n2. تفاصيل الجمهور المستهدف\n3. المتطلبات التقنية والتكنولوجيا المستخدمة\n4. تفاصيل التصميم والهوية البصرية\n5. أي متطلبات إضافية مهمة`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.error?.message || "خطأ في الاتصال بالخدمة");
    }

    const data = await response.json();
    console.log("API Response:", data);

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "خطأ في معالجة الاستجابة"
    );
  } catch (error) {
    console.error("Error generating AI prompt:", error);
    throw new Error("حدث خطأ أثناء توليد البرومت");
  }
};
