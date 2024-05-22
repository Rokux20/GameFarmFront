import { useState, useEffect } from "react";
import "../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const TypeEnergyTable = () => {
  const [typeEnergies, setTypeEnergies] = useState([]);
  const [typeEnergyName, setTypeEnergyName] = useState("");
  const [editingTypeEnergy, setEditingTypeEnergy] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://www.ecobovinos.somee.com/api/TypeEnergy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ typeEnergyName }),
        }
      );

      if (!response.ok) throw new Error("Failed to post");

      const newTypeEnergy = await response.json();
      setTypeEnergies([...typeEnergies, newTypeEnergy]);
      setTypeEnergyName("");
    } catch (error) {
      console.error("Error posting type energy data:", error);
    }
  };

  const handleEdit = (typeEnergy) => {
    setEditingTypeEnergy(typeEnergy);
    setTypeEnergyName(typeEnergy.typeEnergyName);
  };

  const handleUpdateTypeEnergy = async () => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/TypeEnergy/${editingTypeEnergy.typeEnergyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            typeEnergyId: editingTypeEnergy.typeEnergyId,
            typeEnergyName,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      const updatedTypeEnergy = await response.json();
      setTypeEnergies(
        typeEnergies.map((typeEnergy) =>
          typeEnergy.typeEnergyId === editingTypeEnergy.typeEnergyId ? updatedTypeEnergy : typeEnergy
        )
      );
      setEditingTypeEnergy(null);
      setTypeEnergyName("");
    } catch (error) {
      console.error("Error updating type energy data:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/TypeEnergy/${searchId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching type energy data:", error);
      setSearchResult(null);
    }
  };

  const handleDelete = async (typeEnergyId) => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/TypeEnergy/${typeEnergyId}`,
        {
          method: "DELETE",
        }
      );

      setTypeEnergies(typeEnergies.filter((typeEnergy) => typeEnergy.typeEnergyId !== typeEnergyId));

      await response.json();
    } catch (error) {
      console.error("Error deleting type energy data:", error);
    }
  };

  useEffect(() => {
    const fetchTypeEnergyData = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = "https://www.ecobovinos.somee.com/api/TypeEnergy";
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setTypeEnergies(data);
      } catch (error) {
        console.error("Error fetching type energy data:", error);
      }
    };
    fetchTypeEnergyData();
  }, []);

  return (
    <div>
      <h1 className="text-center p-3">Type Energy</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 p-3">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center text-secondary">Create Type Energy</h3>
              <div className="mb-3">
                <label htmlFor="typeEnergyName" className="form-label">
                  Type Energy Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="typeEnergyName"
                  value={typeEnergyName}
                  onChange={(e) => setTypeEnergyName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
          {editingTypeEnergy && (
            <div className="col-md-4 p-3">
              <h3 className="text-center text-secondary">Edit Type Energy</h3>
              <div className="mb-3">
                <label htmlFor="editTypeEnergyName" className="form-label">
                  Type Energy Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editTypeEnergyName"
                  value={typeEnergyName}
                  onChange={(e) => setTypeEnergyName(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateTypeEnergy}
              >
                Save
              </button>
            </div>
          )}
          <div className="col-md-4 p-3">
            <form onSubmit={handleSearch}>
              <h3 className="text-center text-secondary">Search Type Energy by ID</h3>
              <div className="mb-3">
                <label htmlFor="searchId" className="form-label">
                  Type Energy ID
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
            <h3 className="text-center text-secondary">Type Energy List</h3>
            <table
              id="typeEnergyTable"
              border="1"
              className="table table-striped w-100"
            >
              <thead>
                <tr>
                  <th scope="col">Type Energy ID</th>
                  <th scope="col">Type Energy Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {typeEnergies.map((typeEnergy) => (
                  <tr key={typeEnergy.typeEnergyId}>
                    <td>{typeEnergy.typeEnergyId}</td>
                    <td>{typeEnergy.typeEnergyName}</td>
                    <td>
                    <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(typeEnergy)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(typeEnergy.typeEnergyId)}
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
                    <th scope="col">Type Energy ID</th>
                    <th scope="col">Type Energy Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={searchResult.typeEnergyId}>
                    <td>{searchResult.typeEnergyId}</td>
                    <td>{searchResult.typeEnergyName}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(searchResult)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(searchResult.typeEnergyId)}
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

export default TypeEnergyTable;

