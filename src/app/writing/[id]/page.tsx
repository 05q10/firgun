"use client";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import writings from "../../../../public/writings.json";
import axios from "axios";

export default function WritingPage() {
  const params = useParams();
  const id = params?.id as string;
  const writing = writings.writings.find((w) => w.id === id);

  const [selectedText, setSelectedText] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  if (!writing) return notFound();

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      setSelectedText(selection.toString());
    }
  };

  const sendToChatbot = async () => {
    try {
      const refinedPrompt = `Explain in very simple terms, avoid high terminology and provide a structured, well-formatted answer: "${chatInput}"`;
  
      const response = await axios.post("/api/gemini", {
        prompt: refinedPrompt,
      });
  
      console.log("Raw AI Response:", response.data);
  
      // ✅ Ensure response is a string
      let aiMessage = response.data.message || "No response received";
      if (typeof aiMessage !== "string") {
        throw new Error("Invalid AI response format");
      }
  
      // ✅ Clean up and format AI response
      aiMessage = aiMessage
        .replace(/\*/g, "") // Remove asterisks
        .replace(/-\s/g, "") // Remove list dashes
        .replace(/\n{2,}/g, "\n") // Ensure paragraphs are spaced properly
        .trim();
  
      // ✅ Store the raw text, so we can format it dynamically in JSX
      setChatResponse(aiMessage);
    } catch (error) {
      console.error("Error:", error);
      setChatResponse("Failed to get response");
    }
  };
  
  
  
  
  

  return (
    <div className="p-6 max-w-2xl mx-auto" onMouseUp={handleTextSelection}>
      <h1 className="text-3xl font-bold">{writing.title}</h1>
      <p className="text-gray-600 mt-2">{writing.summary}</p>

      <div className="mt-4 space-y-4">
        {writing.content.split("\n\n").map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>

      {selectedText && (
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <p className="text-sm text-gray-700">Selected: {selectedText}</p>
          <button
            onClick={() => setChatInput(`"${selectedText}"`)}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            Copy to Chatbot
          </button>
        </div>
      )}

      {/* Chatbot Interface */}
      <div className="mt-6 p-4 bg-gray-50 border rounded">
        <h2 className="text-lg font-semibold">Chatbot</h2>
        <textarea
          className="w-full border p-2 mt-2"
          rows={3}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Enter a prompt (e.g., Explain this statement)"
        />
        <button
          onClick={sendToChatbot}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Send
        </button>

        {chatResponse && (
          <div className="mt-4 p-3 bg-gray-200 rounded">
            <h3 className="font-semibold">Response:</h3>
            {chatResponse.split("\n").map((line, index) => (
    <p key={index} className="mb-2">{line}</p>
  ))}
          </div>
        )}
      </div>
    </div>
  );
}
