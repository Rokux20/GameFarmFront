import { useState, useEffect } from "react";
import "../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const CropsTable = () => {
  const [crops, setCrops] = useState([]);
  const [cropName, setCropName] = useState("");
  const [cropId, setCropId] = useState("");
  const [farmId, setFarmId] = useState("");
  const [editingCrop, setEditingCrop] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://www.ecobovinos.somee.com/api/Crops",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cropName, farmId }),
        }
      );

      if (!response.ok) throw new Error("Failed to post");

      const newCrop = await response.json();
      setCrops([...crops, newCrop]);
      setCropId("");
      setCropName("");
      setFarmId("");
    } catch (error) {
      console.error("Error posting crop data:", error);
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setCropId(crop.cropId);
    setCropName(crop.cropName);
    setFarmId(crop.farmId);
  };

  const handleUpdateCrop = async () => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/Crops/${editingCrop.cropId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cropId: editingCrop.cropId,
            cropName,
            farmId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      const updatedCrop = await response.json();
      setCrops(
        crops.map((crop) =>
          crop.cropId === editingCrop.cropId ? updatedCrop : crop
        )
      );
      setEditingCrop(null);
      setCropId("");
      setCropName("");
      setFarmId("");
    } catch (error) {
      console.error("Error updating crop data:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/Crops/${searchId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching crop data:", error);
      setSearchResult(null);
    }
  };

  const handleDelete = async (cropId) => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/Crops/${cropId}`,
        {
          method: "DELETE",
        }
      );

      setCrops(crops.filter((crop) => crop.cropId !== cropId));

      const updatedCrops = crops.filter((crop) => crop.cropId !== cropId);
      localStorage.setItem("crops", JSON.stringify(updatedCrops));
      await response.json();
    } catch (error) {
      console.error("Error deleting crop data:", error);
    }
  };

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = "https://www.ecobovinos.somee.com/api/Crops";
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setCrops(data);
      } catch (error) {
        console.error("Error fetching crop data:", error);
      }
    };
    const savedCrops = JSON.parse(localStorage.getItem("crops"));
    if (savedCrops) {
      setCrops(savedCrops);
    } else {
      fetchCropData();
    }
  }, []);

  return (
    <div>
      <h1 className="text-center p-3">Crops</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 p-3">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center text-secondary">Create Crop</h3>
              <div className="mb-3">
                <label htmlFor="cropName" className="form-label">
                  Crop Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cropName"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                />
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
          {editingCrop && (
            <div className="col-md-4 p-3">
              <h3 className="text-center text-secondary">Edit Crop</h3>
              <div className="mb-3">
                <label htmlFor="editCropId" className="form-label">
                  Crop ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editCropId"
                  value={cropId}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editCropName" className="form-label">
                  Crop Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editCropName"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editFarmId" className="form-label">
                  Farm ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editFarmId"
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateCrop}
              >
                Save
              </button>
            </div>
          )}
          <div className="col-md-4 p-3">
            <form onSubmit={handleSearch}>
              <h3 className="text-center text-secondary">Search Crop by ID</h3>
              <div className="mb-3">
                <label htmlFor="searchId" className="form-label">
                  Crop ID
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
            <h3 className="text-center text-secondary">Crop List</h3>
            <table
              id="cropTable"
              border="1"
              className="table table-striped w-100"
            >
              <thead>
                <tr>
                  <th scope="col">CropId</th>
                  <th scope="col">CropName</th>
                  <th scope="col">FarmId</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop) => (
                  <tr key={crop.cropId}>
                    <td>{crop.cropId}</td>
                    <td>{crop.cropName}</td>
                    <td>{crop.farmId}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(crop)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(crop.cropId)}
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
                    <th scope="col">CropId</th>
                    <th scope="col">CropName</th>
                    <th scope="col">FarmId</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={searchResult.cropId}>
                    <td>{searchResult.cropId}</td>
                    <td>{searchResult.cropName}</td>
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
                        onClick={() => handleDelete(searchResult.cropId)}
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

export default CropsTable;
