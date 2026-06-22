import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav id="top-nav">
      <div className="nav-brand">
        <div className="nav-brand-icon">📊</div>
        <div className="nav-brand-name">MarketMind</div>
      </div>
      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Chatbot
        </NavLink>
        <NavLink
          to="/how-it-works"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          How It Works
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
