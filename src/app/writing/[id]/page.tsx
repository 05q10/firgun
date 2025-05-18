"use client";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Writing {
  id: string;
  title: string;
  summary: string;
  genre: string[];
  themes: string[];
  tags: string[];
  content: string;
}

export default function WritingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [writing, setWriting] = useState<Writing | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedText, setSelectedText] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");

 useEffect(() => {
  if (!id) return;

  console.log("Fetching writing with ID:", id);

  axios
    .get(`http://localhost:5000/api/writings/${id}`)
    .then((res) => {
      console.log("Fetched writing data:", res.data);
      setWriting(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching writing:", err);
      setLoading(false);
    });
}, [id]);


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

      let aiMessage = response.data.message || "No response received";

      if (typeof aiMessage !== "string") {
        throw new Error("Invalid AI response format");
      }

      aiMessage = aiMessage
        .replace(/\*/g, "")
        .replace(/-\s/g, "")
        .replace(/\n{2,}/g, "\n")
        .trim();

      setChatResponse(aiMessage);
    } catch (error) {
      console.error("Error:", error);
      setChatResponse("Failed to get response");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!writing) return notFound();

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
              <p key={index} className="mb-2">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
