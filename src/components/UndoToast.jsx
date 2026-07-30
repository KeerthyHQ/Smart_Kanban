import { useEffect } from "react";

const UndoToast = ({ deletedTask, onUndo, onDismiss }) => {
  useEffect(() => {
    if (!deletedTask) return undefined;

    const timeoutId = window.setTimeout(onDismiss, 7000);
    return () => window.clearTimeout(timeoutId);
  }, [deletedTask, onDismiss]);

  if (!deletedTask) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 text-sm text-white shadow-xl"
      role="status"
    >
      <span>Task deleted.</span>
      <button
        type="button"
        onClick={onUndo}
        className="font-semibold text-indigo-200 transition hover:text-white"
      >
        Undo
      </button>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onDismiss}
        className="text-slate-300 transition hover:text-white"
      >
        Close
      </button>
    </div>
  );
};

export default UndoToast;
