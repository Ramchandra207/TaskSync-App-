function SearchFilter({

  search,
  setSearch,
  filter,
  setFilter

}) {

  return (

    <div className="flex gap-4 mt-6">

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="flex-1 border p-3 rounded-xl"
      />

      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
        className="border p-3 rounded-xl"
      >
        <option>All</option>
        <option>Completed</option>
        <option>Pending</option>
      </select>

    </div>
  )
}

export default SearchFilter