import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/crops">Crops</Link></li>
        <li><Link to="/devices">Devices</Link></li>
        <li><Link to="/type-energy">Type Energy</Link></li>
        <li><Link to="/farms">Farms</Link></li>
        <li><Link to="/device-type-energy">Device Type Energy</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/games">Games</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;