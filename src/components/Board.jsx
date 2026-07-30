import Column from "./Column";
import DeleteModal from "./DeleteModal";
import UndoToast from "./UndoToast";

import { useState } from "react";

import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core";

import {
  arrayMove,
} from "@dnd-kit/sortable";

const priorityRank = {
  high: 3,
  medium: 2,
  low: 1,
};

const sortTasksByPriority = (tasks, direction) => {
  const multiplier = direction === "desc" ? -1 : 1;

  return [...tasks].sort(
    (firstTask, secondTask) =>
      (priorityRank[firstTask.priority] - priorityRank[secondTask.priority]) *
      multiplier
  );
};

const Board = ({
  board,
  setBoard,
  searchTerm,
  priorityFilter,
}) => {

  // PER-COLUMN PRIORITY SORT DIRECTION
  const [sortDirections, setSortDirections] = useState({
    todo: "desc",
    inprogress: "desc",
    done: "desc",
  });

  const [taskPendingDeletion, setTaskPendingDeletion] = useState(null);
  const [lastDeletedTask, setLastDeletedTask] = useState(null);

  // TOGGLE A COLUMN BETWEEN HIGH-TO-LOW AND LOW-TO-HIGH
  const togglePrioritySort = (columnKey) => {
    setSortDirections((previousDirections) => {
      const nextDirection =
        previousDirections[columnKey] === "desc" ? "asc" : "desc";

      setBoard((previousBoard) => ({
        ...previousBoard,
        [columnKey]: sortTasksByPriority(
          previousBoard[columnKey],
          nextDirection
        ),
      }));

      return {
        ...previousDirections,
        [columnKey]: nextDirection,
      };
    });
  };

  // ADD TASK
  const addTask = (columnKey, taskTitle, priority, dueDate) => {

    if (!taskTitle.trim()) return;

    const newTask = {

      id: Date.now().toString(),

      title: taskTitle,

      priority,

      dueDate,
    };

    setBoard((prev) => ({

      ...prev,

      [columnKey]: [...prev[columnKey], newTask],
    }));
  };

  // ASK FOR CONFIRMATION BEFORE DELETING A TASK
  const requestTaskDeletion = (task, columnKey) => {
    setTaskPendingDeletion({ task, columnKey });
  };

  const confirmTaskDeletion = () => {
    if (!taskPendingDeletion) return;

    const { task, columnKey } = taskPendingDeletion;
    const taskIndex = board[columnKey].findIndex((item) => item.id === task.id);

    if (taskIndex === -1) return;

    setBoard((previousBoard) => ({
      ...previousBoard,
      [columnKey]: previousBoard[columnKey].filter((item) => item.id !== task.id),
    }));
    setLastDeletedTask({ task, columnKey, taskIndex });
    setTaskPendingDeletion(null);
  };

  const undoTaskDeletion = () => {
    if (!lastDeletedTask) return;

    const { task, columnKey, taskIndex } = lastDeletedTask;

    setBoard((previousBoard) => {
      if (previousBoard[columnKey].some((item) => item.id === task.id)) {
        return previousBoard;
      }

      const restoredTasks = [...previousBoard[columnKey]];
      restoredTasks.splice(taskIndex, 0, task);

      return {
        ...previousBoard,
        [columnKey]: restoredTasks,
      };
    });
    setLastDeletedTask(null);
  };

  // EDIT TASK
  const editTask = (
    taskId,
    columnKey,
    updatedTask,
    updatedPriority,
    updatedDueDate
  ) => {

    setBoard((prev) => ({

      ...prev,

      [columnKey]: prev[columnKey].map( (task) =>task.id === taskId ? {
                  ...task,
                  title: updatedTask,
                  priority: updatedPriority,
                  dueDate: updatedDueDate,
                }: task
        ),

    }));
  };

  // FIND COLUMN OF TASK & Return True if exists
  const findTaskColumn = (taskId) => {

    return Object.keys(board).find(
      (columnKey) =>

        board[columnKey].some(
          (task) =>
            task.id === taskId
        )
    );
  };

  // HANDLE DRAG END
  const handleDragEnd = (event) => {

    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // SOURCE COLUMN
    const fromColumn =
      findTaskColumn(activeId);

    // DESTINATION COLUMN
    let toColumn;

    // DROPPED ON COLUMN
    if (
      board[overId]
    ) {

      toColumn = overId;

    } else {

      // DROPPED ON TASK
      toColumn =
        findTaskColumn(overId);
    }

    if (
      !fromColumn ||
      !toColumn
    )
      return;

    // SAME COLUMN REORDER
    if (
      fromColumn === toColumn
    ) {

      const tasks = [
        ...board[fromColumn],
      ];

      const oldIndex =
        tasks.findIndex(
          (task) =>
            task.id === activeId
        );

      const newIndex =
        tasks.findIndex(
          (task) =>
            task.id === overId
        );

      // SAME POSITION
      if (
        oldIndex === newIndex
      )
        return;

      const reorderedTasks =
        arrayMove(
          tasks,
          oldIndex,
          newIndex
        );

      setBoard((prev) => ({

        ...prev,

        [fromColumn]: reorderedTasks,

      }));

    } else {

      // MOVE BETWEEN COLUMNS

      const taskToMove = board[fromColumn].find((task) => task.id === activeId);

      if (!taskToMove)
        return;

      setBoard((prev) => ({

        ...prev,

        [fromColumn]:prev[fromColumn].filter((task) =>task.id !==activeId),

        [toColumn]: [...prev[toColumn],taskToMove],
      }));
    }
  };

  // FILTER TASKS
  const filteredTasks = (tasks) => {

    return tasks.filter(
      (task) => {

        const matchesSearch =
          task.title
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesPriority =
          priorityFilter ===
          "all"

            ? true

            : task.priority ===
              priorityFilter;

        return (
          matchesSearch &&
          matchesPriority
        );
      }
    );
  };

  return (

    <DndContext
      collisionDetection={
        closestCorners
      }

      onDragEnd={
        handleDragEnd
      }
    >

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-4
          items-start
        "
      >

        {/* TODO */}
        <Column
          title="To Do"

          tasks={sortTasksByPriority(
            filteredTasks(board.todo),
            sortDirections.todo
          )}

          columnKey="todo"

          sortDirection={sortDirections.todo}

          onTogglePrioritySort={togglePrioritySort}

          addTask={addTask}

          onRequestDelete={requestTaskDeletion}

          editTask={editTask}
        />

        {/* IN PROGRESS */}
        <Column
          title="In Progress"

          tasks={sortTasksByPriority(
            filteredTasks(board.inprogress),
            sortDirections.inprogress
          )}

          columnKey="inprogress"

          sortDirection={sortDirections.inprogress}

          onTogglePrioritySort={togglePrioritySort}

          addTask={addTask}

          onRequestDelete={requestTaskDeletion}

          editTask={editTask}
        />

        {/* DONE */}
        <Column
          title="Done"

          tasks={sortTasksByPriority(
            filteredTasks(board.done),
            sortDirections.done
          )}

          columnKey="done"

          sortDirection={sortDirections.done}

          onTogglePrioritySort={togglePrioritySort}

          addTask={addTask}

          onRequestDelete={requestTaskDeletion}

          editTask={editTask}
        />

      </div>

      <DeleteModal
        task={taskPendingDeletion?.task}
        onClose={() => setTaskPendingDeletion(null)}
        onConfirm={confirmTaskDeletion}
      />
      <UndoToast
        deletedTask={lastDeletedTask}
        onUndo={undoTaskDeletion}
        onDismiss={() => setLastDeletedTask(null)}
      />
    </DndContext>
  );
};

export default Board;
