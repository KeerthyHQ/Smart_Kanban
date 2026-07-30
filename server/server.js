import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
    path: "./server/.env",
});

const app = express();

const PORT = process.env.PORT || 3001;

const apiKey = process.env.GEMINI_API_KEY;

const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

app.use(cors());

app.use(express.json());

// Build Prompt
const buildPrompt = ({ action, message, board }) => {
  const tasks = board
    ? `Current Kanban Board:\n${JSON.stringify(board, null, 2)}`
    : "No board data was provided.";

  const instructions = {
    priority: `
Analyze the task and suggest an appropriate priority.

Respond ONLY in this format:

Priority: High | Medium | Low

Reason:
<one concise sentence>

Keep the response under 40 words.
`,

    breakdown: `
Break the task into 3 to 6 practical implementation steps.

Respond ONLY in this format:

Task Breakdown

1. Step one
2. Step two
3. Step three

Keep each step short and actionable.
`,

    summary: `
Analyze the entire Kanban board.

Respond ONLY in this format:

Board Summary

Progress:
- ...

Risks:
- ...

Next Best Action:
- ...

If the user's message refers to a specific task, include:

Regarding "<task name>":
- Current Status:
- Priority:
- Recommendation:

Leave one blank line between every section.
Use bullet points.
Keep the response under 150 words.
`,

    coach: `
Provide practical productivity coaching.

Respond ONLY in this format:

Observation:
...

Advice:
...

Next Step:
...

Be encouraging, practical, and concise.
Keep the response under 120 words.
`,

    chat: `
Answer the user's question naturally.

Rules:
- Use short paragraphs.
- Use bullet points when appropriate.
- Leave a blank line between sections.
- If listing items, use "-" bullets.
- Keep the response under 150 words.
`,
  };

  return `
You are KanbanFlow AI, an intelligent project management assistant.

Your responsibilities:
- Analyze Kanban boards.
- Help prioritize work.
- Break tasks into actionable steps.
- Summarize project progress.
- Give productivity advice.
- Answer questions about the board.

Rules:
- Never invent tasks that are not on the board.
- Base answers only on the supplied board data.
- Be concise and practical.
- Maintain the exact response format requested.
- Do not use Markdown (** or ##).
- Always leave a blank line between headings and content.

${instructions[action]}

${tasks}

User Request:
${message || "Analyze the board."}
`;
};

//Routing

app.post("/api/ai", async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY in .env",
      });
    }

    const { action, message, board } = req.body;

    const allowedActions = [
      "priority",
      "breakdown",
      "summary",
      "coach",
      "chat",
    ];

    if (!allowedActions.includes(action)) {
      return res.status(400).json({
        error: "Unknown AI action",
      });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildPrompt({
                    action,
                    message,
                    board,
                  }),
                },
              ],
            },
          ],
        }),
      }
    );
    
    const geminiData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error:
          geminiData.error?.message ||
          "Gemini request failed",
      });
    }

    const answer =
      geminiData.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim();

    return res.json({
      answer: answer || "No answer was generated.",
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message || "AI request failed",
    });
  }
});

app.listen(PORT, () => {
    console.log(`AI Server running on port ${PORT}`);
});