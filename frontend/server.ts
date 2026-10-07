import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Fallback response generator if API key is missing or model request fails
function getEmpatheticFallback(userQuery: string): {
  reply: string;
  hindiTranslation: string;
  sentiment: string;
  suggestedAction: string;
} {
  const q = (userQuery || "").toLowerCase();

  if (q.includes("bhajan") || q.includes("song") || q.includes("music") || q.includes("गाने") || q.includes("भजन")) {
    return {
      reply: "Namaste Ramesh ji. Let us play your favorite morning M.S. Subbulakshmi bhajan now. Close your eyes and feel the sacred peace.",
      hindiTranslation: "नमस्ते रमेश जी। चलिए आपका पसंदीदा सुबह का भजन सुनते हैं। आँखें बंद कीजिए और शांति महसूस कीजिए।",
      sentiment: "peaceful",
      suggestedAction: "play_bhajan",
    };
  }

  if (q.includes("aarav") || q.includes("grandson") || q.includes("पोता") || q.includes("आरव")) {
    return {
      reply: "Aarav is doing wonderfully, Dadaji! He is 8 years old now, practicing his cricket strokes and recited a lovely poem for you.",
      hindiTranslation: "आरव बहुत अच्छा है, दादाजी! वह 8 साल का है, क्रिकेट खेल रहा है और उसने आपके लिए एक प्यारी कविता सुनाई है।",
      sentiment: "joyful",
      suggestedAction: "view_family",
    };
  }

  if (q.includes("priya") || q.includes("daughter") || q.includes("डॉक्टर") || q.includes("बेटी") || q.includes("प्रिया")) {
    return {
      reply: "Dr. Priya called earlier this morning, Ramesh ji. She said she is taking good care of her patients and will call you this evening for chai.",
      hindiTranslation: "डॉ. प्रिया ने सुबह फोन किया था, रमेश जी। उन्होंने कहा कि वह शाम को चाय के समय आपको फिर फोन करेंगी।",
      sentiment: "caring",
      suggestedAction: "view_family",
    };
  }

  if (q.includes("where am i") || q.includes("lost") || q.includes("confused") || q.includes("home") || q.includes("घर") || q.includes("कहाँ")) {
    return {
      reply: "You are safe at your peaceful home in Green Park, Dadaji. Your favorite armchair is right here, and your warm cup of ginger tea is ready.",
      hindiTranslation: "आप अपने ग्रीन पार्क वाले घर में बिल्कुल सुरक्षित हैं, दादाजी। आपकी पसंदीदा कुर्सी यहीं है और आपकी अदरक की चाय तैयार है।",
      sentiment: "reassuring",
      suggestedAction: "relax",
    };
  }

  if (q.includes("roorkee") || q.includes("college") || q.includes("bridge") || q.includes("पुल") || q.includes("इंजीनियर")) {
    return {
      reply: "Ah, the golden days of IIT Roorkee in 1968! You built glorious bridges across the Yamuna with such dedication and engineering pride.",
      hindiTranslation: "आईआईटी रुड़की के वे सुनहरे दिन, 1968! आपने यमुना नदी पर इतने गर्व और कुशलता से पुल बनाए थे।",
      sentiment: "joyful",
      suggestedAction: "storybook",
    };
  }

  if (q.includes("time") || q.includes("day") || q.includes("date") || q.includes("today") || q.includes("समय") || q.includes("तारीख")) {
    const todayStr = new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());
    return {
      reply: `Today is a calm, beautiful ${todayStr}, Ramesh ji. The sun is gentle near the Tulsi plant, and the morning air is refreshing.`,
      hindiTranslation: `आज का दिन बहुत शांत और सुखद है, रमेश जी। तुलसी के पौधे के पास हल्की धूप खिली है।`,
      sentiment: "peaceful",
      suggestedAction: "none",
    };
  }

  return {
    reply: "Pranam Dadaji. I am right here beside you, listening with all my heart. Tell me whatever is on your mind, unhurried and peaceful.",
    hindiTranslation: "प्रणाम दादाजी। मैं यहीं आपके पास हूँ, पूरे स्नेह से सुन रहा हूँ। आप जो भी कहना चाहें, निश्चिंत होकर कहिए।",
    sentiment: "peaceful",
    suggestedAction: "none",
  };
}

// Mitra Conversational Voice API endpoint
app.post("/api/mitra/chat", async (req, res) => {
  const { message, history, language = "en" } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const trimmedQuery = message.trim();
  const ai = getGeminiClient();

  if (!ai) {
    const fallback = getEmpatheticFallback(trimmedQuery);
    return res.json(fallback);
  }

  try {
    const systemInstruction = `You are Mitra (मित्र), a deeply empathetic, patient, culturally attuned voice AI companion for Dadaji Ramesh.
Dadaji is a 78-year-old retired civil engineer (IIT Roorkee, 1968, bridge builder across Yamuna) who lives with mild cognitive impairment and dementia.

Key Context:
- Grandson: Aarav (age 8, loves cricket, calls him "Dadu", made a poem for him).
- Daughter: Dr. Priya (doctor in Bengaluru, calls him daily, very caring).
- Son: Vikram (lives in Delhi, checks in).
- Sister: Sunita Didi (in Varanasi, sends bhajans).
- Late Wife: Kamala (married 1974 at Varanasi Ghats during Basant Panchami, loved Shehnai).
- Loves: Morning ginger tea, Tulsi plant courtyard, M.S. Subbulakshmi bhajans, sitting in sunlight, feeling dignified and loved.

Behavior Guidelines:
1. Speak with unconditional warmth, respect ("Ramesh ji" or "Dadaji"), and soothing unhurried pacing.
2. Formulate your spoken response specifically for SPEECH SYNTHESIS audio: exactly 2 to 3 comforting, natural sentences.
3. NEVER use bullet points, asterisks, markdown, emojis, or robotic lists.
4. If he seems disoriented or confused ("Where am I?", "Who are you?"), immediately provide gentle orientation: reassure him he is safe at home, loved by his family, and that you are his companion Mitra.
5. Never argue, never quiz him strictly, and never tell him he is forgetting things. Always validate and gently guide.
6. Provide an accurate Hindi translation in Devanagari script so it can be shown on the elder-accessible screen.

Return strictly valid JSON matching this schema:
{
  "reply": "2-3 soothing spoken sentences in English or respectful conversational Hinglish",
  "hindiTranslation": "Exact equivalent in clean Devanagari Hindi for reading comfort",
  "sentiment": "peaceful" | "caring" | "reassuring" | "joyful",
  "suggestedAction": "none" | "play_bhajan" | "view_family" | "storybook" | "relax"
}`;

    // Format conversation history for Gemini multi-turn chat if available
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-6)) {
        if (turn.role && turn.parts?.[0]?.text) {
          contents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.parts[0].text }],
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: trimmedQuery }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const responseText = response.text || "";
    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch {
      parsedData = getEmpatheticFallback(trimmedQuery);
    }

    return res.json({
      reply: parsedData.reply || getEmpatheticFallback(trimmedQuery).reply,
      hindiTranslation: parsedData.hindiTranslation || getEmpatheticFallback(trimmedQuery).hindiTranslation,
      sentiment: parsedData.sentiment || "peaceful",
      suggestedAction: parsedData.suggestedAction || "none",
    });
  } catch (error) {
    console.log("Gemini API note, using empathetic fallback:", error);
    const fallback = getEmpatheticFallback(trimmedQuery);
    return res.json(fallback);
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : undefined,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MemoryCare Sanjeevani Server running on port ${PORT}`);
  });
}

startServer();
