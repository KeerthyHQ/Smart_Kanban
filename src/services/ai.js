const API_URL = import.meta.env.VITE_API_URL;

export const askAI = async (action, message, board) => {
  try {
    const response = await fetch(`${API_URL}/api/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action, 
        message, 
        board 
      }),
    });

    const rawBody = await response.text();
    let data = {};

    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      throw new Error("The AI server returned an invalid response. Make sure the backend is running and try again.");
    }

    if (!response.ok) {
      throw new Error(data.error || "AI request failed");
    }

    return data.answer || "No answer was generated.";
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to reach the AI server. Make sure the backend is running.");
  }
};
