import { useEffect, useState } from "react";
import API from "./services/api";

function App() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [activeMenu, setActiveMenu] =
    useState("Dashboard");

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    status: "Pending",
  });

  // FETCH TASKS

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/tasks");

      setTasks(res.data);

      setLoading(false);

    } catch {

      setError("Failed to fetch tasks");

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchTasks();

  }, []);

  // ADD / UPDATE TASK

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.title) {

      setError("Title required");

      return;
    }

    try {

      if (editId) {

        await API.put(
          `/tasks/${editId}`,
          formData
        );

        setEditId(null);

      } else {

        await API.post(
          "/tasks",
          formData
        );
      }

      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        status: "Pending",
      });

      fetchTasks();

      setActiveMenu("Dashboard");

    } catch {

      setError("Operation failed");
    }
  };

  // DELETE

  const deleteTask = async (id) => {

    try {

      await API.delete(
        `/tasks/${id}`
      );

      fetchTasks();

      setSelectedTask(null);

    } catch {

      setError("Delete failed");
    }
  };

  // EDIT

  const editTask = (task) => {

    setFormData({
      title: task.title,
      description: task.description,
      dueDate:
        task.dueDate?.substring(0, 10),
      priority: task.priority,
      status: task.status,
    });

    setEditId(task._id);

    setActiveMenu("Add Task");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SEARCH FILTER

  const filteredTasks = tasks.filter(
    (task) => {

      const matchesSearch =
        task.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      if (filter === "Completed") {

        return (
          matchesSearch &&
          task.status === "Completed"
        );
      }

      if (filter === "Pending") {

        return (
          matchesSearch &&
          task.status === "Pending"
        );
      }

      return matchesSearch;
    }
  );

  return (

    <div className="min-h-screen bg-[#edf2ff] flex">

      {/* SIDEBAR */}

      <div className="w-64 bg-[#111827] text-white p-6 hidden md:block">

        <h1 className="text-3xl font-bold mb-12">

          TaskSync

        </h1>

        <div className="space-y-5">

          <div
            onClick={() =>
              setActiveMenu("Dashboard")
            }
            className={`p-4 rounded-2xl cursor-pointer ${
              activeMenu === "Dashboard"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            Dashboard
          </div>

          <div
            onClick={() =>
              setActiveMenu("Add Task")
            }
            className={`p-4 rounded-2xl cursor-pointer ${
              activeMenu === "Add Task"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            Add Task
          </div>

          <div
            onClick={() =>
              setActiveMenu("Analytics")
            }
            className={`p-4 rounded-2xl cursor-pointer ${
              activeMenu === "Analytics"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            Analytics
          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="flex-1 p-8">

        {/* TOPBAR */}

        <div className="flex flex-col lg:flex-row justify-between gap-5">

          <h1 className="text-4xl font-bold">

            {activeMenu}

          </h1>

          {/* SEARCH */}

          <div className="relative w-full lg:w-[400px]">

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full p-4 rounded-2xl border bg-white shadow-md outline-none"
            />

            {/* SEARCH DROPDOWN */}

            {search && (

              <div className="absolute top-16 left-0 w-full bg-white rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">

                {filteredTasks.length > 0 ? (

                  filteredTasks.map((task) => (

                    <div
                      key={task._id}
                      onClick={() => {

                        setSelectedTask(task);

                        setSearch("");

                      }}
                      className="p-4 border-b hover:bg-gray-100 cursor-pointer"
                    >

                      <h2 className="font-bold">
                        {task.title}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {task.status}
                      </p>

                    </div>
                  ))

                ) : (

                  <p className="p-4 text-gray-500">
                    No Tasks Found
                  </p>
                )}

              </div>
            )}

          </div>

        </div>

        {/* DASHBOARD */}

        {activeMenu === "Dashboard" && (

          <>

            {/* STATS */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">

              <div className="bg-white p-6 rounded-3xl shadow-md">

                <p className="text-gray-500">
                  Total Tasks
                </p>

                <h2 className="text-4xl font-bold mt-3">

                  {tasks.length}

                </h2>

              </div>

              <div className="bg-white p-6 rounded-3xl shadow-md">

                <p className="text-gray-500">
                  Completed
                </p>

                <h2 className="text-4xl font-bold text-green-500 mt-3">

                  {
                    tasks.filter(
                      t => t.status === "Completed"
                    ).length
                  }

                </h2>

              </div>

              <div className="bg-white p-6 rounded-3xl shadow-md">

                <p className="text-gray-500">
                  Pending
                </p>

                <h2 className="text-4xl font-bold text-yellow-500 mt-3">

                  {
                    tasks.filter(
                      t => t.status === "Pending"
                    ).length
                  }

                </h2>

              </div>

              <div className="bg-white p-6 rounded-3xl shadow-md">

                <p className="text-gray-500">
                  High Priority
                </p>

                <h2 className="text-4xl font-bold text-red-500 mt-3">

                  {
                    tasks.filter(
                      t => t.priority === "High"
                    ).length
                  }

                </h2>

              </div>

            </div>

            {/* SELECTED TASK */}

            {selectedTask && (

              <div className="bg-white p-8 rounded-3xl shadow-md mt-10">

                <div className="flex justify-between items-center">

                  <h2 className="text-3xl font-bold">

                    {selectedTask.title}

                  </h2>

                  <span className="bg-blue-600 text-white px-4 py-2 rounded-xl">

                    {selectedTask.priority}

                  </span>

                </div>

                <p className="text-gray-600 mt-6 text-lg">

                  {selectedTask.description}

                </p>

                <div className="mt-6 space-y-3">

                  <p>
                    Status:
                    {" "}
                    <b>
                      {selectedTask.status}
                    </b>
                  </p>

                  <p>
                    Due Date:
                    {" "}
                    {selectedTask.dueDate?.substring(0,10)}
                  </p>

                </div>

                <div className="flex gap-4 mt-8">

                  <button
                    onClick={() =>
                      editTask(selectedTask)
                    }
                    className="bg-yellow-400 px-6 py-3 rounded-2xl"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteTask(selectedTask._id)
                    }
                    className="bg-red-500 text-white px-6 py-3 rounded-2xl"
                  >
                    Delete
                  </button>

                </div>

              </div>
            )}

            {/* TASK LIST */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

              {filteredTasks.map((task) => (

                <div
                  key={task._id}
                  onClick={() =>
                    setSelectedTask(task)
                  }
                  className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl cursor-pointer transition"
                >

                  <div className="flex justify-between">

                    <h2 className="text-2xl font-bold">

                      {task.title}

                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        task.priority === "High"
                          ? "bg-red-500"
                          : task.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >

                      {task.priority}

                    </span>

                  </div>

                  <p className="text-gray-500 mt-4">

                    {task.description}

                  </p>

                </div>
              ))}

            </div>

          </>
        )}

        {/* ADD TASK */}

        {activeMenu === "Add Task" && (

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-md mt-10"
          >

            <h2 className="text-3xl font-bold mb-8">

              {editId
                ? "Update Task"
                : "Create New Task"}

            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <input
                type="text"
                placeholder="Task Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="border p-4 rounded-2xl"
              />

              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: e.target.value,
                  })
                }
                className="border p-4 rounded-2xl"
              />

              <textarea
                placeholder="Task Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="border p-4 rounded-2xl md:col-span-2"
              />

              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value,
                  })
                }
                className="border p-4 rounded-2xl"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="border p-4 rounded-2xl"
              >
                <option>Pending</option>
                <option>Completed</option>
              </select>

            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl mt-8"
            >

              {editId
                ? "Update Task"
                : "Add Task"}

            </button>

          </form>
        )}

        {/* ANALYTICS */}

        {activeMenu === "Analytics" && (

          <div className="grid md:grid-cols-3 gap-6 mt-10">

            <div className="bg-white p-10 rounded-3xl shadow-md">

              <h2 className="text-2xl text-gray-500">
                Completed
              </h2>

              <p className="text-6xl font-bold text-green-500 mt-5">

                {
                  tasks.filter(
                    t => t.status === "Completed"
                  ).length
                }

              </p>

            </div>

            <div className="bg-white p-10 rounded-3xl shadow-md">

              <h2 className="text-2xl text-gray-500">
                Pending
              </h2>

              <p className="text-6xl font-bold text-yellow-500 mt-5">

                {
                  tasks.filter(
                    t => t.status === "Pending"
                  ).length
                }

              </p>

            </div>

            <div className="bg-white p-10 rounded-3xl shadow-md">

              <h2 className="text-2xl text-gray-500">
                High Priority
              </h2>

              <p className="text-6xl font-bold text-red-500 mt-5">

                {
                  tasks.filter(
                    t => t.priority === "High"
                  ).length
                }

              </p>

            </div>

          </div>
        )}

        {error && (

          <p className="text-red-500 mt-6">

            {error}

          </p>
        )}

      </div>

    </div>
  );
}

export default App;