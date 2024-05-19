import { useState, useEffect } from "react";
import "../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [finished, setFinished] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [farmId, setFarmId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://www.ecobovinos.somee.com/api/Tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description, finished, farmId }),
        }
      );

      if (!response.ok) throw new Error("Failed to post");

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setDescription("");
      setFinished(false);
    } catch (error) {
      console.error("Error posting task data:", error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setDescription(task.description || "");
    setFinished(task.finished || false);
  };

  const handleUpdateTask = async () => {
    try {
      const response = await fetch(
        `http://www.ecobovinos.somee.com/api/Tasks/${editingTask.taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskId: editingTask.taskId,
            description,
            finished,
            farmId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      const updatedTask = await response.json();
      setTasks(
        tasks.map((task) =>
          task.taskId === editingTask.taskId ? updatedTask : task
        )
      );
      setEditingTask(null);
      setDescription("");
      setFinished(false);
    } catch (error) {
      console.error("Error updating task data:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://www.ecobovinos.somee.com/api/Tasks/${searchId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching task data:", error);
      setSearchResult(null);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(
        `http://www.ecobovinos.somee.com/api/Tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      setTasks(tasks.filter((task) => task.taskId !== taskId));

      await response.json();
    } catch (error) {
      console.error("Error deleting task data:", error);
    }
  };

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = "http://www.ecobovinos.somee.com/api/Tasks";
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };
    fetchTaskData();
  }, []);

  return (
    <div>
      <h1 className="text-center p-3">Tasks</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 p-3">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center text-secondary">Create Task</h3>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="editFinished"
                  checked={finished}
                  onChange={(e) => setFinished(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="editFinished">
                  Finished
                </label>
              </div>

              <div className="mb-3">
                <label htmlFor="farmId" className="form-label">
                  Farm ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="farmId"
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
          {editingTask && (
            <div className="col-md-4 p-3">
              <h3 className="text-center text-secondary">Edit Task</h3>
              <div className="mb-3">
                <label htmlFor="editDescription" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="editFinished"
                  checked={finished}
                  onChange={(e) => setFinished(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="editFinished">
                  Finished
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="farmId" className="form-label">
                  Farm ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="farmId"
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateTask}
              >
                Save
              </button>
            </div>
          )}
          <div className="col-md-4 p-3">
            <form onSubmit={handleSearch}>
              <h3 className="text-center text-secondary">Search Task by ID</h3>
              <div className="mb-3">
                <label htmlFor="searchId" className="form-label">
                  Task ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="searchId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <h3 className="text-center text-secondary">Task List</h3>
            <table
              id="taskTable"
              border="1"
              className="table table-striped w-100"
            >
              <thead>
                <tr>
                  <th scope="col">Task ID</th>
                  <th scope="col">Description</th>
                  <th scope="col">Finished</th>
                  <th scope="col">Farm ID</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.taskId}>
                    <td>{task.taskId}</td>
                    <td>{task.description}</td>
                    <td>{task.finished ? "Yes" : "No"}</td>
                    <td>{task.farmId}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(task)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(task.taskId)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {searchResult && (
          <div className="row mt-4">
            <div className="col-12">
              <h3 className="text-center text-secondary">Search Result</h3>
              <table
                id="searchResultTable"
                border="1"
                className="table table-striped w-100"
              >
                <thead>
                  <tr>
                    <th scope="col">Task ID</th>
                    <th scope="col">Description</th>
                    <th scope="col">Finished</th>
                    <th scope="col">Farm ID</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={searchResult.taskId}>
                    <td>{searchResult.taskId}</td>
                    <td>{searchResult.description}</td>
                    <td>{searchResult.finished ? "Yes" : "No"}</td>
                    <td>{searchResult.farmId}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(searchResult)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(searchResult.taskId)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksTable;
