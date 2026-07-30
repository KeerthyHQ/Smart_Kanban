import { useEffect, useRef } from "react";

const DeleteModal = ({ task, onClose, onConfirm }) => {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!task) return undefined;

    cancelButtonRef.current?.focus();

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [task, onClose]);

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-dialog-title" className="text-base font-semibold text-slate-800">
          Delete task?
        </h2>
        <p id="delete-dialog-description" className="mt-2 text-sm text-slate-600">
          {task.title} will be permanently removed from this column.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Delete task
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
