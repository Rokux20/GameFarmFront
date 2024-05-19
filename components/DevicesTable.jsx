import { useState, useEffect } from "react";
import "../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";


const DevicesTable = () => {
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState("");
  const [consumer, setConsumer] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [farmId, setFarmId] = useState("");
  const [editingDevice, setEditingDevice] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://www.ecobovinos.somee.com/api/Devices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deviceName, consumer, farmId }),
        }
      );

      if (!response.ok) throw new Error("Failed to post");

      const newDevice = await response.json();
      setDevices([...devices, newDevice]);
      
      setDeviceName("");
      setConsumer("");
      setFarmId("");
    } catch (error) {
      console.error("Error posting device data:", error);
    }
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    setDeviceId(device.deviceId);
    setDeviceName(device.deviceName);
    setConsumer(device.consumer);
    setFarmId(device.farmId);
  };

  const handleUpdateDevice = async () => {
    try {
      const response = await fetch(
        `http://www.ecobovinos.somee.com/api/Devices/${editingDevice.deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId: editingDevice.deviceId,
            deviceName,
            consumer,
            farmId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      const updatedDevice = await response.json();
      setDevices(
        devices.map((device) =>
          device.deviceId === editingDevice.deviceId ? updatedDevice : device
        )
      );
      setEditingDevice(null);
      setDeviceId("");
      setDeviceName("");
      setConsumer("");
      setFarmId("");
    } catch (error) {
      console.error("Error updating device data:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://www.ecobovinos.somee.com/api/Devices/${searchId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching device data:", error);
      setSearchResult(null);
    }
  };

  const handleDelete = async (deviceId) => {
    try {
      const response = await fetch(
        `http://www.ecobovinos.somee.com/api/Devices/${deviceId}`,
        {
          method: "DELETE",
        }
      );

      setDevices(devices.filter((device) => device.deviceId !== deviceId));

      const updatedDevices = devices.filter((device) => device.deviceId !== deviceId);
      localStorage.setItem("devices", JSON.stringify(updatedDevices));
      await response.json();
    } catch (error) {
      console.error("Error deleting device data:", error);
    }
  };

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = "http://www.ecobovinos.somee.com/api/Devices";
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };
    const savedDevices = JSON.parse(localStorage.getItem("devices"));
    if (savedDevices) {
      setDevices(savedDevices);
    } else {
      fetchDeviceData();
    }
  }, []);

  return (
    <div>
      <h1 className="text-center p-3">Devices</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 p-3">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center text-secondary">Create Device</h3>
              <div className="mb-3">
                <label htmlFor="deviceName" className="form-label">
                  Device Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="deviceName"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="consumer" className="form-label">
                  Consumer
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="consumer"
                  value={consumer}
                  onChange={(e) => setConsumer(e.target.value)}
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
          {editingDevice && (
            <div className="col-md-4 p-3">
              <h3 className="text-center text-secondary">Edit Device</h3>
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
                <label htmlFor="editDeviceName" className="form-label">
                  Device Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDeviceName"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editConsumer" className="form-label">
                  Consumer
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editConsumer"
                  value={consumer}
                  onChange={(e) => setConsumer(e.target.value)}
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
                onClick={handleUpdateDevice}
              >
                Save
              </button>
            </div>
          )}
          <div className="col-md-4 p-3">
            <form onSubmit={handleSearch}>
              <h3 className="text-center text-secondary">Search Device by ID</h3>
              <div className="mb-3">
                <label htmlFor="searchId" className="form-label">
                  Device ID
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
            <h3 className="text-center text-secondary">Device List</h3>
            <table
              id="deviceTable"
              border="1"
              className="table table-striped w-100"
            >
              <thead>
                <tr>
                  <th scope="col">DeviceId</th>
                  <th scope="col">DeviceName</th>
                  <th scope="col">Consumer</th>
                  <th scope="col">FarmId</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.deviceId}>
                    <td>{device.deviceId}</td>
                    <td>{device.deviceName}</td>
                    <td>{device.consumer}</td>
                    <td>{device.farmId}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(device)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(device.deviceId)}
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
                    <th scope="col">DeviceId</th>
                    <th scope="col">DeviceName</th>
                    <th scope="col">Consumer</th>
                    <th scope="col">FarmId</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={searchResult.deviceId}>
                    <td>{searchResult.deviceId}</td>
                    <td>{searchResult.deviceName}</td>
                    <td>{searchResult.consumer}</td>
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
                        onClick={() => handleDelete(searchResult.deviceId)}
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

export default DevicesTable;
