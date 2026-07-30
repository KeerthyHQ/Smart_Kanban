import { useState } from "react";

import Navbar from "./components/NavBar";
import Dashboard from "./components/Dashboard";

function App() {

  // SEARCH STATE
  const [searchTerm, setSearchTerm] =  useState("");

  // PRIORITY FILTER STATE
  const [priorityFilter, setPriorityFilter] = useState("all");

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-indigo-500
        via-purple-500
        to-indigo-600
      "
    >

      {/* NAVBAR */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* MAIN CONTENT */}
      <main
        className="
          max-w-7xl
          xl:max-w-[1440px]
          mx-auto
          px-3
          py-3
          sm:px-4
          sm:py-4
          md:px-5
          lg:px-6
          xl:px-8
        "
      >

        <Dashboard
          searchTerm={searchTerm}
          priorityFilter={priorityFilter}
        />

      </main>

    </div>
  );
}

export default App;
