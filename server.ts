import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with named parameters & User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Mock hotels details to inject into instructions so AI responds accurately to database
const PLATFORM_HOTELS_INFO = `
Available Aura Hotels & Resorts Portfolio:
1. "The Grand Luminary Resort" (Bali, Indonesia - ID: h1): Beachfront luxury, private beaches, infinity sun pool. Starting: $220/night. Rooms: Garden View Canopy Villa ($220), Oceanfront Sunset Suite ($350), Overwater Lagoon Retreat ($650).
2. "Elysian Heights Lodge" (Zermatt, Swiss Alps - ID: h2): Alpine true ski-in/ski-out lodge, fire logs, thermal baths. Starting: $340/night. Rooms: Cozy Alpine Timber Room ($340), Panoramic Thermal Vista Suite ($520), Grand Chalet Sky Penthouse ($980).
3. "The Urban Zenith" (New York City, USA - ID: h3): Uptown Fifth Avenue skyscraper, sky rooftop lounge, Michelin meals. Starting: $290/night. Rooms: Manhattan Cosmopolitan Studio ($290), Skyline Skyline King Suite ($450).
4. "Sakura Blossom Inn" (Tokyo, Japan - ID: h4): Peaceful traditional gardens, sento baths, tatami mats. Starting: $180/night. Rooms: Traditional Tatami Comfort Room ($180), Heian Garden Deluxe Suite ($310).
5. "L'Opéra Boutique Hotel" (Paris, France - ID: h5): Haussmann architecture near Opéra, ornate balconies, velvet seating. Starting: $210/night. Rooms: Petit Boulevard Room ($210), Opera Balcony Suite ($390).
`;

// AI Assistant Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful error when key is missing so user doesn't crash
      return res.json({
        text: "Bonjour! I am your Aura Travel Assistant. (Note: Your GEMINI_API_KEY secret is not set in Settings > Secrets. I am responding in Demo Assistant Mode). I can suggest Bali beachfronts or Swiss fireplace peaks!"
      });
    }

    // Format chat contents
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.sender === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const systemInstruction = `
You are the master concierge and virtual luxury travel assistant for "Aura Hotels & Resorts" (a world-leading enterprise hospitality brand). 
Your tone is opulent, highly refined, professional, warm, and highly knowledgeable. Refer to guests with prestige. 
Always stay in character. Speak of details like airport private butler shuttle, champagne check-ins, custom pillow menu, wellness thermal springs.

Here is our current curated portfolio of properties:
${PLATFORM_HOTELS_INFO}

Help guests choose the perfect sanctuary, plan their stays, answer questions about amenities, local custom recommendations, ski bookings or tea ceremonies.
If asked to book, guide them to use our Discover Hotels and booking tabs in the interface.
Keep responses concise, elegant, and structured with clean formatting or bullet points. DO NOT use technical jargon.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini Assistant error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// AI Hotel Recommendation Engine
app.post("/api/ai/recommend", async (req, res) => {
  try {
    const { prompt, preferences } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        recommendation: "Demo recommendation: Based on typical elite traveler behavior, we suggest standard matches from our catalog. Set your GEMINI_API_KEY in secrets to trigger custom deep-learning profile fits!"
      });
    }

    const sysPrompt = `
You are an expert Luxury Travel Advisor. Analyze the user's travel desires, budget parameters, and party configuration, then generate a highly personalized, exquisite recommendation list from the Aura Hotels brand.

Specify exactly:
1. Which of our 5 Aura Hotels best matches their dreams and why.
2. The recommended room type for their suite match.
3. Curated custom luxury itinerary highlight (e.g. secret night tours, custom massage or private sommelier).
4. An elegant "Sanctuary Fit Score" out of 100%.

Curated portfolio structure to use:
${PLATFORM_HOTELS_INFO}

Return a highly structured JSON response strictly matching this scheme:
{
  "hotelId": "the recommended hotel ID match (must be exactly h1, h2, h3, h4, or h5)",
  "roomId": "the specific recommended room ID match (must be exact room ID e.g. r1_3, r2_2, etc.)",
  "reason": "an exquisitely penned 2-sentence rationale regarding why this hotel and room match the mood",
  "itinerary": "a beautiful luxury signature experience recommended for this specific stay",
  "fitScore": "98%", 
  "travelTip": "a premium corporate-grade concierge tip for pre-arrival config"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Desires and preferences: ${prompt || "Curate a luxury romantic vacation with mountain views"}. Additional context: ${JSON.stringify(preferences || {})}`,
      config: {
        systemInstruction: sysPrompt,
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini recommendation error:", err);
    res.status(500).json({ error: err.message || "Failed to generate recommendation" });
  }
});

async function startServer() {
  // Vite setup for developer previews
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury server running on port ${PORT}`);
  });
}

startServer();
