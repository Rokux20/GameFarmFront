// App.js
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import DevicesTypeEnergyTable from '../components/DevicesTypeEnergyTable';
import GameTable from '../components/GameTable';
import TasksTable from '../components/TasksTable';
import TypeEnergyTable from '../components/TypeEnergyTable';
import UserTable from '../components/UserTable';
import FarmsTable from '../components/FarmsTable';
import CropsTable from '../components/CropsTable';
import DevicesTable from '../components/DevicesTable';
import Login from '../components/Login';
import NavBar from '../components/Navbar';
import Register from '../components/Register';
import './App.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const noNavBarRoutes = ['/login', '/', '/register'];
  const shouldRenderNavBar = !noNavBarRoutes.includes(location.pathname);

  return (
    <div>
      {shouldRenderNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/crops" element={<CropsTable />} />
        <Route path="/devices" element={<DevicesTable />} />
        <Route path="/type-energy" element={<TypeEnergyTable />} />
        <Route path="/farms" element={<FarmsTable />} />
        <Route path="/device-type-energy" element={<DevicesTypeEnergyTable />} />
        <Route path="/users" element={<UserTable />} />
        <Route path="/games" element={<GameTable />} />
        <Route path="/tasks" element={<TasksTable />} />
      </Routes>
    </div>
  );
}

export default App;
