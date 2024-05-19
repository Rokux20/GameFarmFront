import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://www.ecobovinos.somee.com/api/User/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: username,
          password: password,
        }),
      });

      if (response.ok) {
        console.log('Inicio de sesión exitoso');
        navigate('/farms');
      } else {
        setError('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Se produjo un error al iniciar sesión. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className={styles.pageContainer}>
         <div className={styles.loginContainer}>
      <div className="login-container">
      <h2>Iniciar sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit"className={styles.loginButton}>Iniciar sesión</button>
      </form>
    </div>
    </div>
    
    </div>
   
  );
}

export default Login;
