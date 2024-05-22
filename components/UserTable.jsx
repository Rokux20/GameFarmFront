import { useState, useEffect } from "react";
import "../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://www.ecobovinos.somee.com/api/User",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usuario, password }),
        }
      );

      if (!response.ok) throw new Error("Failed to post");

      const newUser = await response.json();
      setUsers([...users, newUser]);
      setUsuario("");
      setPassword("");
    } catch (error) {
      console.error("Error posting user data:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUsuario(user.usuario);
    setPassword(user.password);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/User/${editingUser.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: editingUser.userId,
            usuario,
            password,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      const updatedUser = await response.json();
      setUsers(
        users.map((user) =>
          user.userId === editingUser.userId ? updatedUser : user
        )
      );
      setEditingUser(null);
      setUsuario("");
      setPassword("");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/User/${searchId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setSearchResult(null);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/User/${userId}`,
        {
          method: "DELETE",
        }
      );

      setUsers(users.filter((user) => user.userId !== userId));

      await response.json();
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = "https://www.ecobovinos.somee.com/api/User";
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div>
      <h1 className="text-center p-3">User</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 p-3">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center text-secondary">Create User</h3>
              <div className="mb-3">
                <label htmlFor="usuario" className="form-label">
                  Usuario
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
          {editingUser && (
            <div className="col-md-4 p-3">
              <h3 className="text-center text-secondary">Edit User</h3>
              <div className="mb-3">
                <label htmlFor="editUsuario" className="form-label">
                  Usuario
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editUsuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="editPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateUser}
              >
                Save
              </button>
            </div>
          )}
          <div className="col-md-4 p-3">
            <form onSubmit={handleSearch}>
              <h3 className="text-center text-secondary">Search User by ID</h3>
              <div className="mb-3">
                <label htmlFor="searchId" className="form-label">
                  User ID
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
            <h3 className="text-center text-secondary">User List</h3>
            <table
              id="userTable"
              border="1"
              className="table table-striped w-100"
            >
              <thead>
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Usuario</th>
                  <th scope="col">Password</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.usuario}</td>
                    <td>{'*'.repeat(user.password.length)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(user)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user.userId)}
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
                    <th scope="col">User ID</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Password</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={searchResult.userId}>
                    <td>{searchResult.userId}</td>
                    <td>{searchResult.usuario}</td>
                    <td>{'*'.repeat(searchResult.password.length)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(searchResult)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(searchResult.userId)}
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

export default UserTable;

