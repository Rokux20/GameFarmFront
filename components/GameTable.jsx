import { useState, useEffect } from "react";
import "../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const GameTable = () => {
  const [games, setGames] = useState([]);
  const [partida, setPartida] = useState("");
  const [userId, setUserId] = useState("");
  const [farmId, setFarmId] = useState("");
  const [editingGame, setEditingGame] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://www.ecobovinos.somee.com/api/Game",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ partida, userId, farmId }),
        }
      );

      if (!response.ok) throw new Error("Failed to post");

      const newGame = await response.json();
      setGames([...games, newGame]);
      setPartida("");
      setUserId("");
      setFarmId("");
    } catch (error) {
      console.error("Error posting game data:", error);
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setPartida(game.partida);
    setUserId(game.userId);
    setFarmId(game.farmId);
  };

  const handleUpdateGame = async () => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/Game/${editingGame.gameId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: editingGame.gameId,
            partida,
            userId,
            farmId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      const updatedGame = await response.json();
      setGames(
        games.map((game) =>
          game.gameId === editingGame.gameId ? updatedGame : game
        )
      );
      setEditingGame(null);
      setPartida("");
      setUserId("");
      setFarmId("");
    } catch (error) {
      console.error("Error updating game data:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/Game/${searchId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching game data:", error);
      setSearchResult(null);
    }
  };

  const handleDelete = async (gameId) => {
    try {
      const response = await fetch(
        `https://www.ecobovinos.somee.com/api/Game/${gameId}`,
        {
          method: "DELETE",
        }
      );

      setGames(games.filter((game) => game.gameId !== gameId));

      await response.json();
    } catch (error) {
      console.error("Error deleting game data:", error);
    }
  };

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = "https://www.ecobovinos.somee.com/api/Game";
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };
    fetchGameData();
  }, []);

  return (
    <div>
      <h1 className="text-center p-3">Game</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 p-3">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center text-secondary">Create Game</h3>
              <div className="mb-3">
                <label htmlFor="partida" className="form-label">
                  Partida
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="partida"
                  value={partida}
                  onChange={(e) => setPartida(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="userId" className="form-label">
                  User ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
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
          {editingGame && (
            <div className="col-md-4 p-3">
              <h3 className="text-center text-secondary">Edit Game</h3>
              <div className="mb-3">
                <label htmlFor="editPartida" className="form-label">
                  Partida
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editPartida"
                  value={partida}
                  onChange={(e) => setPartida(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editUserId" className="form-label">
                  User ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editUserId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
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
                onClick={handleUpdateGame}
              >
                Save
              </button>
            </div>
          )}
          <div className="col-md-4 p-3">
            <form onSubmit={handleSearch}>
              <h3 className="text-center text-secondary">Search Game by ID</h3>
              <div className="mb-3">
                <label htmlFor="searchId" className="form-label">
                  Game ID
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
            <h3 className="text-center text-secondary">Game List</h3>
            <table
              id="gameTable"
              border="1"
              className="table table-striped w-100"
            >
              <thead>
                <tr>
                  <th scope="col">Game ID</th>
                  <th scope="col">Partida</th>
                  <th scope="col">User ID</th>
                  <th scope="col">Farm ID</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.gameId}>
                    <td>{game.gameId}</td>
                    <td>{game.partida}</td>
                    <td>{game.userId}</td>
                    <td>{game.farmId}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(game)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(game.gameId)}
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
                    <th scope="col">Game ID</th>
                    <th scope="col">Partida</th>
                    <th scope="col">User ID</th>
                    <th scope="col">Farm ID</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={searchResult.gameId}>
                    <td>{searchResult.gameId}</td>
                    <td>{searchResult.partida}</td>
                    <td>{searchResult.userId}</td>
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
                        onClick={() => handleDelete(searchResult.gameId)}
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

export default GameTable;

