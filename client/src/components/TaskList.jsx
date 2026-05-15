function TaskList({

  filteredTasks,
  toggleTask,
  editTask,
  deleteTask

}) {

  return (

    <div className="mt-8 space-y-4">

      {filteredTasks.map((task) => (

        <div
          key={task.id}
          className="flex justify-between items-center bg-gray-100 p-4 rounded-xl"
        >

          <div className="flex items-center gap-4">

            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                toggleTask(task.id)
              }
            />

            <p
              className={
                task.completed
                  ? "line-through text-gray-500"
                  : ""
              }
            >
              {task.text}
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                editTask(task)
              }
              className="bg-yellow-400 px-4 py-2 rounded-lg"
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteTask(task.id)
              }
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>

          </div>

        </div>
      ))}

    </div>
  )
}

export default TaskList