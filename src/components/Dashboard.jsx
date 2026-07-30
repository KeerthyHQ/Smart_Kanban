import { useEffect, useState } from "react";
import AIHub from "./AIHub";
import Board from "./Board";
import StatsCard from "./StatsCard";

const defaultBoard = {
  todo: [
    { id: "1", title: "Learn React", priority: "medium" },
    { id: "2", title: "Build Kanban UI", priority: "high" },
  ],
  inprogress: [
    { id: "3", title: "Implement Drag & Drop", priority: "medium" },
  ],
  done: [],
};

const Dashboard = ({ searchTerm, priorityFilter }) => {
  const [board, setBoard] = useState(() => {
    const savedBoard = localStorage.getItem("kanban-board");
    return savedBoard ? JSON.parse(savedBoard) : defaultBoard;
  });

  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(board));
  }, [board]);

  const totalTasks = board.todo.length + board.inprogress.length + board.done.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = [...board.todo, ...board.inprogress].filter(
    (task) => task.dueDate && new Date(`${task.dueDate}T00:00:00`) < today
  ).length;

  return (
    <>
      <section
        aria-label="Task summary"
        className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        <StatsCard label="All tasks" value={totalTasks} tone="border-slate-200 bg-white/90" />
        <StatsCard label="To do" value={board.todo.length} tone="border-blue-100 bg-blue-50/90" />
        <StatsCard label="In progress" value={board.inprogress.length} tone="border-orange-100 bg-orange-50/90" />
        <StatsCard label="Overdue" value={overdueTasks} tone="border-red-100 bg-red-50/90" />
        <StatsCard label="Done" value={board.done.length} tone="border-green-100 bg-green-50/90" />
      </section>

      

      <Board
        board={board}
        setBoard={setBoard}
        searchTerm={searchTerm}
        priorityFilter={priorityFilter}
      />

      <AIHub board={board} />
      
    </>
  );
};

export default Dashboard;
