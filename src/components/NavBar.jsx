import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav id="top-nav">
      <div className="nav-brand">
        <div className="nav-brand-icon">MM</div>
        <div className="nav-brand-name">MarketMind</div>
      </div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Career Coach
        </NavLink>
        <NavLink to="/knowledge-base" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Knowledge Base
        </NavLink>
        <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          How It Works
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
