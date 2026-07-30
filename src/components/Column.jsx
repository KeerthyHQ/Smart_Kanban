import Card from "./Card";
import { useState } from "react";

import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const Column = ({
  title,
  tasks,
  columnKey,
  addTask,
  onRequestDelete,
  editTask,
  sortDirection,
  onTogglePrioritySort,
}) => {

  // TASK INPUT STATE
  const [newTask, setNewTask] =
    useState("");

  // SHOW/HIDE INPUT
  const [showInput, setShowInput] =
    useState(false);

  // PRIORITY STATE
  const [priority, setPriority] =
    useState("medium");

  // DUE DATE FOR THE NEW TASK (YYYY-MM-DD)
  const [dueDate, setDueDate] = useState("");

  const resetNewTaskForm = () => {
    setNewTask("");
    setPriority("medium");
    setDueDate("");
    setShowInput(false);
  };

  const handleAddTask = () => {
    addTask(columnKey, newTask, priority, dueDate);
    resetNewTaskForm();
  };

  // DROPPABLE COLUMN
  const { setNodeRef } = useDroppable({
    id: columnKey,
  });

  // COLUMN HEADER COLORS
  const columnColor =
    title === "To Do"
      ? "bg-blue-200"

      : title === "In Progress"
      ? "bg-orange-200"

      : "bg-green-200";

  return (

    <div
      ref={setNodeRef}

      className="
        bg-white/80
        backdrop-blur-md
        rounded-2xl
        shadow-lg
        border
        border-white/40
        p-3
        sm:p-4
        w-full
        max-w-none
        min-h-[380px]
        sm:min-h-[420px]
        flex
        flex-col
      "
    >

      {/* COLUMN HEADER */}
      <div
        className="
          flex
          justify-between
          items-center
          mb-3
          sm:mb-4
        "
      >

        {/* TITLE */}
        <h2
          className="
            text-base
            sm:text-lg
            font-semibold
            text-slate-700
          "
        >
          {title}
        </h2>

        <div className="flex items-center gap-2">
          {/* PRIORITY SORT TOGGLE */}
          <button
            type="button"
            onClick={() => onTogglePrioritySort(columnKey)}
            aria-label={`Sort ${title} priorities ${
              sortDirection === "desc" ? "low to high" : "high to low"
            }`}
            title={`Priority: ${
              sortDirection === "desc" ? "High to Low" : "Low to High"
            }`}
            className="
              rounded-lg
              border
              border-slate-200
              bg-white
              px-1.5
              sm:px-2
              py-1
              text-[11px]
              sm:text-xs
              font-semibold
              text-slate-600
              transition
              hover:border-indigo-300
              hover:text-indigo-600
            "
          >
            {sortDirection === "desc" ? "H ↓ L" : "L ↑ H"}
          </button>

          {/* TASK COUNT */}
          <div
            className={`
              ${columnColor}

              w-8
              h-8
              text-sm
              rounded-full
              flex
              items-center
              justify-center
              font-bold
              text-slate-700
              shadow-sm
            `}
          >
            {tasks.length}
          </div>
        </div>

      </div>

      {/* TASK LIST */}
      <div className="flex-1">

        <SortableContext
          items={tasks.map(
            (task) => task.id
          )}

          strategy={
            verticalListSortingStrategy
          }
        >

          {tasks.map((task) => (

            <Card
              key={task.id}

              task={task}

              columnKey={columnKey}

              onRequestDelete={onRequestDelete}

              editTask={editTask}
            />

          ))}

        </SortableContext>

      </div>

      {/* ADD TASK SECTION */}
      <div className="mt-3 sm:mt-4">

        {
          showInput ? (

            <div
              className="
                bg-slate-100
                rounded-xl
                p-3
              "
            >

              {/* PRIORITY BUTTONS */}
              <div
                className="
                  flex
                  gap-2
                  mb-3
                "
              >

                {/* HIGH */}
                <button
                  onClick={() =>
                    setPriority("high")
                  }

                  className={`
                    w-8
                    h-8
                    text-sm
                    rounded-full
                    font-bold
                    transition

                    ${
                      priority === "high"
                        ? "bg-red-400 text-white ring-2 ring-red-500"
                        : "bg-red-200"
                    }
                  `}
                >
                  H
                </button>

                {/* MEDIUM */}
                <button
                  onClick={() =>
                    setPriority("medium")
                  }

                  className={`
                    w-8
                    h-8
                    text-sm
                    rounded-full
                    font-bold
                    transition

                    ${
                      priority === "medium"
                        ? "bg-orange-400 text-white ring-2 ring-orange-500"
                        : "bg-orange-200"
                    }
                  `}
                >
                  M
                </button>

                {/* LOW */}
                <button
                  onClick={() =>
                    setPriority("low")
                  }

                  className={`
                    w-8
                    h-8
                    text-sm
                    rounded-full
                    font-bold
                    transition

                    ${
                      priority === "low"
                        ? "bg-green-400 text-white ring-2 ring-green-500"
                        : "bg-green-200"
                    }
                  `}
                >
                  L
                </button>

              </div>

              {/* INPUT */}
              <input
                type="text"

                autoFocus

                placeholder="Enter task..."

                value={newTask}

                onChange={(e) =>
                  setNewTask(
                    e.target.value
                  )
                }

                onKeyDown={(e) => {

                  if (e.key === "Enter") {

                    handleAddTask();
                  }
                }}

                className="
                  w-full
                  px-3
                  py-2
                  text-sm
                  rounded-xl
                  border
                  border-gray-300
                  outline-none
                  bg-white
                  focus:ring-2
                  focus:ring-indigo-300
                "
              />

              {/* DUE DATE */}
              <div className="mt-2">
                <label
                  htmlFor={`due-date-${columnKey}`}
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Due date
                </label>
                <input
                  id={`due-date-${columnKey}`}
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="
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
              </div>

              {/* ACTION BUTTONS */}
              <div
                className="
                  flex
                  gap-2
                  mt-3
                "
              >

                {/* ADD */}
                <button
                  onClick={() => {

                    handleAddTask();
                  }}

                  className="
                    flex-1
                    py-1.5
                    text-sm
                    rounded-xl
                    bg-indigo-500
                    text-white
                    font-medium
                    hover:bg-indigo-600
                    transition
                  "
                >
                  Add Task
                </button>

                {/* CANCEL */}
                <button
                  onClick={() => {

                    resetNewTaskForm();
                  }}

                  className="
                    px-3
                    py-1.5
                    text-sm
                    rounded-xl
                    bg-gray-200
                    hover:bg-gray-300
                    transition
                  "
                >
                  Cancel
                </button>

              </div>

            </div>

          ) : (

            <button
              onClick={() =>
                setShowInput(true)
              }

              className="
                w-full
                py-2
                text-sm
                rounded-xl
                bg-slate-100
                hover:bg-slate-200
                text-slate-700
                font-medium
                transition
                border
                border-dashed
                border-slate-300
              "
            >
              + Add Task
            </button>

          )
        }

      </div>

    </div>
  );
};

export default Column;
