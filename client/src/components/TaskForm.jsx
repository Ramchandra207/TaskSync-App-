function TaskForm({

  title,
  setTitle,
  addTask,
  editId

}) {

  return (

    <div className="flex gap-4">

      <input
        type="text"
        placeholder="Enter task..."
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        className="flex-1 border p-3 rounded-xl"
      />

      <button
        onClick={addTask}
        className="bg-blue-600 text-white px-6 rounded-xl"
      >
        {editId !== null
          ? "Update"
          : "Add"}
      </button>

    </div>
  )
}

export default TaskForm