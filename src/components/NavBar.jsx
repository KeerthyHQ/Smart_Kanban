import logo from "../assets/logo.png";

const Navbar = ({
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
}) => {
  return (
    <div
      className="
        sticky
        top-0
        z-50
        backdrop-blur-md
        bg-white/70
        border-b
        border-white/40
        shadow-sm
      "
    >
      {/* NAVBAR CONTAINER */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-3
          py-2.5
          sm:px-4
          md:px-5
          lg:px-6
          flex
          flex-col
          md:flex-row
          gap-3
          md:gap-4
          md:items-center
          md:justify-between
        "
      >
        {/* TITLE */}
        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-2.5
          "
        >
          {/* LOGO */}
          <img
            src={logo}
            alt="Kanban Logo"
            className="
              w-8
              h-8
              sm:w-9
              sm:h-9
              rounded-xl
              shadow-sm
              hover:rotate-3
              hover:scale-105
              transition
            "
          />

          {/* APP TITLE */}
          <div>
            <h1
              className="
                text-lg
                sm:text-xl
                font-semibold
                text-slate-700
              "
            >
              Kanban Flow
            </h1>

            
          </div>
        </div>

        {/* SEARCH BAR */}
        <div
          className="
            order-3
            w-full
            flex-1
            flex
            justify-center
            md:order-none
          "
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="
              w-full
              md:w-[280px]
              lg:w-[320px]
              px-3
              py-1.5
              text-sm
              rounded-xl
              border
              border-gray-300
              bg-white
              shadow-sm
              outline-none
              transition
              focus:ring-2
              focus:ring-indigo-300
              focus:border-indigo-300
            "
          />
        </div>

        {/* RIGHT SECTION → PRIORITY FILTERS */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            flex-wrap
            sm:justify-start
          "
        >
          {/* LABEL */}
          <p
            className="
              text-sm
              font-medium
              text-slate-600
            "
          >
            Priority
          </p>

          {/* ALL */}
          <button
            onClick={() => setPriorityFilter("all")}
            className={`
              w-8
              h-8
              text-xs
              sm:text-sm
              rounded-full
              font-bold
              shadow-sm
              transition
              hover:scale-105

              ${
                priorityFilter === "all"
                  ? "bg-gray-400 text-white ring-2 ring-gray-500"
                  : "bg-white text-gray-500 ring-2 ring-gray-500"
              }
            `}
          >
            A
          </button>

          {/* HIGH */}
          <button
            onClick={() => setPriorityFilter("high")}
            className={`
              w-8
              h-8
              text-sm
              rounded-full
              font-bold
              shadow-sm
              transition
              hover:scale-105

              ${
                priorityFilter === "high"
                  ? "bg-red-500 text-white ring-2 ring-red-600"
                  : "bg-white text-red-600 ring-2 ring-red-600"
              }
            `}
          >
            H
          </button>

          {/* MEDIUM */}
          <button
            onClick={() => setPriorityFilter("medium")}
            className={`
              w-8
              h-8
              text-sm
              rounded-full
              font-bold
              shadow-sm
              transition
              hover:scale-105

              ${
                priorityFilter === "medium"
                  ? "bg-orange-400 text-white ring-2 ring-orange-500"
                  : "bg-white text-orange-400 ring-2 ring-orange-400"
              }
            `}
          >
            M
          </button>

          {/* LOW */}
          <button
            onClick={() => setPriorityFilter("low")}
            className={`
              w-8
              h-8
              text-sm
              rounded-full
              font-bold
              shadow-sm
              transition
              hover:scale-105

              ${
                priorityFilter === "low"
                  ? "bg-green-400 text-white ring-2 ring-green-500"
                  : "bg-white text-green-500 ring-2 ring-green-500"
              }
            `}
          >
            L
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
