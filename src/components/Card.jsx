import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const formatDueDate = (dueDate) =>
  new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dueDate}T00:00:00`));

const Card = ({ task, columnKey, onRequestDelete, editTask }) => {
  // EDIT MODE STATE
  const [isEditing, setIsEditing] = useState(false);

  // EDITED TASK TITLE
  const [editedTask, setEditedTask] = useState(task.title);

  // EDITED PRIORITY
  const [editedPriority, setEditedPriority] = useState(task.priority);

  // EDITED DUE DATE
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || "");

  // SORTABLE DRAG
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,

      data: {
        fromColumn: columnKey,
      },
    });

  // DRAG STYLE
  const style = {
    transform: CSS.Transform.toString(transform),

    transition,
  };

  // SAVE EDIT
  const handleSaveEdit = () => {
    if (editedTask.trim() !== "") {
      editTask(
        task.id,
        columnKey,
        editedTask,
        editedPriority,
        editedDueDate
      );
    }

    setIsEditing(false);
  };

  // PRIORITY COLORS
  const priorityColor =
    task.priority === "high"
      ? "bg-red-200"
      : task.priority === "medium"
        ? "bg-orange-200"
        : "bg-green-200";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${priorityColor}

        rounded-xl
        shadow-sm
        p-2.5
        sm:p-3
        mb-2.5
        sm:mb-3
        border
        border-white/40
        hover:shadow-md
        transition-all
        duration-200
      `}
    >
      {/* CARD HEADER */}
      <div
        className="
          flex
          justify-between
          items-start
          gap-2
        "
      >
        {/* LEFT SIDE */}
        <div
          className="
            flex
            gap-2
            flex-1
          "
        >
          {/* DRAG HANDLE */}
          <div
            {...listeners}
            {...attributes}
            className="
              cursor-grab
              text-sm
              sm:text-base
              font-bold
              text-slate-700
              mt-0.5
              select-none
            "
          >
            ☰
          </div>

          {/* CONTENT */}
          <div className="flex-1">
            {isEditing ? (
              <div
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveEdit();
                  }
                }}
              >
                {/* PRIORITY BUTTONS */}
                <div
                  className="
                      flex
                      gap-2
                      mb-2
                    "
                >
                  {/* HIGH */}
                  <button
                    onClick={() => setEditedPriority("high")}
                    className={`
                        w-8
                        h-8
                        rounded-full
                        font-bold
                        transition

                        ${
                          editedPriority === "high"
                            ? "bg-red-400 text-white ring-2 ring-red-500"
                            : "bg-red-200"
                        }
                      `}
                  >
                    H
                  </button>

                  {/* MEDIUM */}
                  <button
                    onClick={() => setEditedPriority("medium")}
                    className={`
                        w-8
                        h-8
                        rounded-full
                        font-bold
                        transition

                        ${
                          editedPriority === "medium"
                            ? "bg-orange-400 text-white ring-2 ring-orange-500"
                            : "bg-orange-200"
                        }
                      `}
                  >
                    M
                  </button>

                  {/* LOW */}
                  <button
                    onClick={() => setEditedPriority("low")}
                    className={`
                        w-8
                        h-8
                        rounded-full
                        font-bold
                        transition

                        ${
                          editedPriority === "low"
                            ? "bg-green-400 text-white ring-2 ring-green-500"
                            : "bg-green-200"
                        }
                      `}
                  >
                    L
                  </button>
                </div>

                {/* EDIT INPUT */}
                <input
                  type="text"
                  autoFocus
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  className="
                      w-full
                      px-3
                      py-1.5
                      text-sm
                      rounded-xl
                      border
                      border-gray-300
                      outline-none
                      focus:ring-2
                      focus:ring-indigo-300
                      bg-white
                    "
                />

                {/* EDIT DUE DATE */}
                <label className="mt-2 block text-xs font-medium text-slate-600">
                  Due date
                  <input
                    type="date"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    className="
                      mt-1
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-1.5
                      text-sm
                      outline-none
                      focus:ring-2
                      focus:ring-indigo-300
                    "
                  />
                </label>

                {/* SAVE BUTTON */}
                <button
                  onClick={handleSaveEdit}
                  className="
                      mt-2
                      px-3
                      py-1.5
                      text-sm
                      rounded-xl
                      bg-indigo-500
                      text-white
                      hover:bg-indigo-600
                      transition
                    "
                >
                  Save
                </button>
              </div>
            ) : (
              <>
              <p
                onDoubleClick={() => setIsEditing(true)}
                className="
                    text-slate-800
                    text-xs
                    sm:text-sm
                    font-medium
                    break-words
                    cursor-pointer
                  "
              >
                {task.title}
              </p>

              {task.dueDate && (
                <time
                  dateTime={task.dueDate}
                  className="mt-1 block text-[11px] font-medium text-slate-600 sm:text-xs"
                >
                  Due {formatDueDate(task.dueDate)}
                </time>
              )}
              </>
            )}
          </div>
        </div>

        {/* DELETE BUTTON */}
        <button
          type="button"
          onClick={() => onRequestDelete(task, columnKey)}
          aria-label={`Delete ${task.title}`}
          className="
            text-red-500
            hover:text-red-700
            text-base
            font-bold
            transition
          "
        >
          ✕
        </button>
      </div>

    </div>
  );
};

export default Card;
