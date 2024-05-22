import { useState } from 'react';
import styles from './Register.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [users, setUsers] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      navigate('/login');
    } catch (error) {
      console.error("Error posting user data:", error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.registerContainer}>
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Usuario:</label>
             <input
                  type="text"
                  className="form-control"
                  id="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
          </div>
          <button type="submit" className={styles.registerButton}>Registrarse</button>
        </form>
        <p>
          ¿Ya tienes una cuenta? <Link to="/login" className={styles.loginLink}>Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
