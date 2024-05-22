import { useState, useEffect } from "react";
import "../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const Table = () => {
  const [farms, setFarms] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [farmId, setFarmId] = useState("");
  const [editingFarm, setEditingFarm] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://www.ecobovinos.somee.com/api/Farms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ farmName: farmName }),
        }
      );

      if (!response.ok) throw new Error("Failed to post");

      const newFarm = await response.json();
      setFarms([...farms, newFarm]);
      setFarmName("");
    } catch (error) {
      console.error("Error posting farm data:", error);
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFarmId(farm.farmId);
    setFarmName(farm.farmName);
  };

  const handleUpdateFarm = async () => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/Farms/${editingFarm.farmId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            farmId: editingFarm.farmId,
            farmName: farmName,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      const updatedFarm = await response.json();
      setFarms(
        farms.map((farm) =>
          farm.farmId === editingFarm.farmId ? updatedFarm : farm
        )
      );
      setEditingFarm(null);
      setFarmId("");
      setFarmName("");
    } catch (error) {
      console.error("Error updating farm data:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/Farms/${searchId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching farm data:", error);
      setSearchResult(null);
    }
  };

  const handleDelete = async (farmId) => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/Farms/${farmId}`,
        {
          method: "DELETE",
        }
      );

      setFarms(farms.filter((farm) => farm.farmId !== farmId));

      const updatedFarms = farms.filter((farm) => farm.farmId !== farmId);
      localStorage.setItem("farms", JSON.stringify(updatedFarms));
      await response.json();
    } catch (error) {
      console.error("Error deleting farm data:", error);
    }
  };
  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = "https://www.ecobovinos.somee.com/api/Farms";
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setFarms(data);
      } catch (error) {
        console.error("Error fetching farm data:", error);
      }
    };
    const savedFarms = JSON.parse(localStorage.getItem("farms"));
    if (savedFarms) {
      setFarms(savedFarms);
    } else {
      fetchFarmData();
    }
  }, []);

  return (
    <div>
      <h1 className="text-center p-3">Farms</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 p-3">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center text-secondary">Create Farms</h3>
              <div className="mb-3">
                <label htmlFor="farmName" className="form-label">
                  Farm Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="farmName"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
          {editingFarm && (
            <div className="col-md-4 p-3">
              <h3 className="text-center text-secondary">Edit Farm</h3>
              <div className="mb-3">
                <label htmlFor="editFarmId" className="form-label">
                  Farm ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editFarmId"
                  value={farmId}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editFarmName" className="form-label">
                  Farm Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editFarmName"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateFarm}
              >
                Save
              </button>
            </div>
          )}
          <div className="col-md-4 p-3">
            <form onSubmit={handleSearch}>
              <h3 className="text-center text-secondary">Search Farm by ID</h3>
              <div className="mb-3">
                <label htmlFor="searchId" className="form-label">
                  Farm ID
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
            <h3 className="text-center text-secondary">Farm List</h3>
            <table
              id="farmTable"
              border="1"
              className="table table-striped w-100"
            >
              <thead>
                <tr>
                  <th scope="col">FarmId</th>
                  <th scope="col">FarmName</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {farms.map((farm) => (
                  <tr key={farm.farmId}>
                    <td>{farm.farmId}</td>
                    <td>{farm.farmName}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(farm)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(farm.farmId)}
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
                    <th scope="col">FarmId</th>
                    <th scope="col">FarmName</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={searchResult.farmId}>
                    <td>{searchResult.farmId}</td>
                    <td>{searchResult.farmName}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(searchResult)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(searchResult.farmId)}
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

export default Table;
