import { useState } from "react";
import { askAI } from "../services/ai";

const tools = [
  { action: "priority", label: "🎯 Suggest priority" },
  { action: "breakdown", label: "📋 Break down task" },
  { action: "summary", label: "📝 Board summary" },
  { action: "coach", label: "💪 Productivity coach" },
];

const AIHub = ({ board }) => {
  const [taskText, setTaskText] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizeSpacing = (value) =>
    value
      .replace(/\*{3,}/g, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*\s*\[\s*\]\s*/g, "- [ ] ")
      .replace(/\*\s*\[x\s*\]\s*/gi, "- [x] ")
      .replace(/\*\s+([A-Za-z])/g, "- $1")
      .replace(/([\.,;:!\?])([^\s\n])/g, "$1 $2")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .trim();

  const formatContent = (value) => {
    if (!value) return "";

    return normalizeSpacing(value)
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("- [ ]") || trimmed.startsWith("- [x]")) {
          return trimmed;
        }
        if (/^\d+\./.test(trimmed)) {
          return trimmed.replace(/^(\d+)\.\s*/, "$1. ");
        }
        if (/^-\s+/.test(trimmed)) {
          return trimmed;
        }
        return trimmed;
      })
      .join("\n");
  };

  // RUN SELECTED TOOL
  const runTool = async (action) => {
    //edge cases
    if (["priority", "breakdown"].includes(action) && !taskText.trim()) {
      setError("Enter a task first for this tool.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const rawAnswer = await askAI(action, taskText, board);
      const formatted = formatContent(rawAnswer);

      setChatHistory((previous) => [
        ...previous,
        {
          role: "You",
          text: `🛠 ${action.toUpperCase()}\n\n${taskText}`,
        },
        {
          role: "AI",
          text: formatted,
        },
      ]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Chat functionality
  const sendChat = async (event) => {
    event.preventDefault();
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = chatMessage.trim();
    setChatMessage("");
    setIsLoading(true);
    setError("");

    try {
      const aiMessage = await askAI("chat", userMessage, board);
      setChatHistory((previous) => [
        ...previous,
        { role: "You", text: userMessage },
        { role: "AI", text: formatContent(aiMessage) },
      ]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-4 rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-4 shadow-xl shadow-slate-200/40 backdrop-blur-md">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            AI workspace
          </h2>
          <p className="text-xs text-slate-600">
            Smart suggestions using your current board.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700">
              Thinking...
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-6">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

  <h3 className="mb-2 text-lg font-semibold text-slate-900">
    Ask AI anything about your board
  </h3>

  <p className="mb-4 text-sm text-slate-500">
    Describe your task or ask AI to analyze your board.
  </p>

  <textarea
    rows={5}
    value={taskText}
    onChange={(e) => setTaskText(e.target.value)}
    placeholder="Write your task, ask a question, or describe what you need help with..."
    className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
  />

  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
    {tools.map((tool) => (
      <button
        key={tool.action}
        type="button"
        disabled={isLoading}
        onClick={() => runTool(tool.action)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-60"
      >
        {tool.label}
      </button>
    ))}
  </div>

</div>
          
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  AI chat assistant
                </h3>
                <p className="text-xs text-slate-500">
                  Ask follow-up questions in a conversational chat format.
                </p>
              </div>
            </div>

            <div className="mt-5 flex h-[520px] flex-col rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {chatHistory.length === 0 ? (
                  <div className="rounded-3xl bg-white px-4 py-5 text-sm text-slate-500 shadow-sm">
                    Start the conversation by asking a question, then the AI
                    response will appear as chat bubbles.
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-end gap-3 ${
                        message.role === "You"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "AI" && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
                          🤖
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] whitespace-pre-wrap rounded-[24px] px-5 py-3 text-sm leading-7 shadow-sm ${
                          message.role === "You"
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-slate-800"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendChat} className="mt-4 flex gap-2">
                <input
                  value={chatMessage}
                  onChange={(event) => setChatMessage(event.target.value)}
                  placeholder="Ask about your tasks..."
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIHub;
