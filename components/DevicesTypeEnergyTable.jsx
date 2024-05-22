import { useState, useEffect } from "react";
import "../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const DevicesTypeEnergyTable = () => {
  const [devicesTypeEnergy, setDevicesTypeEnergy] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [typeEnergyId, setTypeEnergyId] = useState("");
  const [editingDeviceTypeEnergy, setEditingDeviceTypeEnergy] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://www.ecobovinos.somee.com/api/DevicesTypeEnergy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deviceId, typeEnergyId }),
        }
      );

      if (!response.ok) throw new Error("Failed to post");

      const newDeviceTypeEnergy = await response.json();
      setDevicesTypeEnergy([...devicesTypeEnergy, newDeviceTypeEnergy]);
      setDeviceId("");
      setTypeEnergyId("");
    } catch (error) {
      console.error("Error posting device type energy data:", error);
    }
  };

  const handleEdit = (deviceTypeEnergy) => {
    setEditingDeviceTypeEnergy(deviceTypeEnergy);
    setDeviceId(deviceTypeEnergy.deviceId);
    setTypeEnergyId(deviceTypeEnergy.typeEnergyId);
  };

  const handleUpdateDeviceTypeEnergy = async () => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/DevicesTypeEnergy/${editingDeviceTypeEnergy.devicesEnergyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId,
            typeEnergyId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      const updatedDeviceTypeEnergy = await response.json();
      setDevicesTypeEnergy(
        devicesTypeEnergy.map((deviceTypeEnergy) =>
          deviceTypeEnergy.devicesEnergyId === editingDeviceTypeEnergy.devicesEnergyId ? updatedDeviceTypeEnergy : deviceTypeEnergy
        )
      );
      setEditingDeviceTypeEnergy(null);
      setDeviceId("");
      setTypeEnergyId("");
    } catch (error) {
      console.error("Error updating device type energy data:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/DevicesTypeEnergy/${searchId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching device type energy data:", error);
      setSearchResult(null);
    }
  };

  const handleDelete = async (devicesEnergyId) => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/DevicesTypeEnergy/${devicesEnergyId}`,
        {
          method: "DELETE",
        }
      );

      setDevicesTypeEnergy(devicesTypeEnergy.filter((deviceTypeEnergy) => deviceTypeEnergy.devicesEnergyId !== devicesEnergyId));

      await response.json();
    } catch (error) {
      console.error("Error deleting device type energy data:", error);
    }
  };

  useEffect(() => {
    const fetchDeviceTypeEnergyData = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = "https://www.ecobovinos.somee.com/api/DevicesTypeEnergy";
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setDevicesTypeEnergy(data);
      } catch (error) {
        console.error("Error fetching device type energy data:", error);
      }
    };
    fetchDeviceTypeEnergyData();
  }, []);

  return (
    <div>
      <h1 className="text-center p-3">Devices Type Energy</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 p-3">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center text-secondary">Create Device Type Energy</h3>
              <div className="mb-3">
                <label htmlFor="deviceId" className="form-label">
                  Device ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="deviceId"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="typeEnergyId" className="form-label">
                  Type Energy ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="typeEnergyId"
                  value={typeEnergyId}
                  onChange={(e) => setTypeEnergyId(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
          {editingDeviceTypeEnergy && (
            <div className="col-md-4 p-3">
              <h3 className="text-center text-secondary">Edit Device Type Energy</h3>
              <div className="mb-3">
                <label htmlFor="editDeviceId" className="form-label">
                  Device ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDeviceId"
                  value={deviceId}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editTypeEnergyId" className="form-label">
                  Type Energy ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editTypeEnergyId"
                  value={typeEnergyId}
                  onChange={(e) => setTypeEnergyId(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateDeviceTypeEnergy}
              >
                Save
              </button>
            </div>
          )}
          <div className="col-md-4 p-3">
            <form onSubmit={handleSearch}>
              <h3 className="text-center text-secondary">Search Device Type Energy by ID</h3>
              <div className="mb-3">
                <label htmlFor="searchId" className="form-label">
                  Device Type Energy ID
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
                <h3 className="text-center text-secondary">Device Type Energy List</h3>
                <table
                  id="deviceTypeEnergyTable"
                  border="1"
                  className="table table-striped w-100"
                >
                  <thead>
                    <tr>
                      <th scope="col">DevicesEnergyId</th>
                      <th scope="col">DeviceId</th>
                      <th scope="col">TypeEnergyId</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devicesTypeEnergy.map((deviceTypeEnergy) => (
                      <tr key={deviceTypeEnergy.devicesEnergyId}>
                        <td>{deviceTypeEnergy.devicesEnergyId}</td>
                        <td>{deviceTypeEnergy.deviceId}</td>
                        <td>{deviceTypeEnergy.typeEnergyId}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(deviceTypeEnergy)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(deviceTypeEnergy.devicesEnergyId)}
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
                        <th scope="col">DevicesEnergyId</th>
                        <th scope="col">DeviceId</th>
                        <th scope="col">TypeEnergyId</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={searchResult.devicesEnergyId}>
                        <td>{searchResult.devicesEnergyId}</td>
                        <td>{searchResult.deviceId}</td>
                        <td>{searchResult.typeEnergyId}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(searchResult)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(searchResult.devicesEnergyId)}
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
    
    export default DevicesTypeEnergyTable;
    
