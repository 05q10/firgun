import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);

    if (!GEMINI_API_KEY) {
      console.error("🚨 GEMINI_API_KEY is missing!");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    // ✅ Extract the generated response as a string
    let aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

    // ✅ Ensure the response is a string
    aiResponse = typeof aiResponse === "string" ? aiResponse.trim() : "Invalid response format";

    console.log("Formatted AI Response:", aiResponse);
    return NextResponse.json({ message: aiResponse });
  } catch (error: any) {
    console.error("🔥 Error calling Gemini API:", error?.response?.data || error.message);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
