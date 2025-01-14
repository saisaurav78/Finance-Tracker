import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    setIsAuthenticated(false); // Update authentication status in context
    navigate('/'); // Redirect to login page
  };

  return (
    <header className='header'>
      <h1 className='header-title'>Finance Tracker</h1>
      <nav>
        <ul className='nav-list'>
          {!isAuthenticated ? (
            <>
              <li className='nav-item'>
                <Link to='/' className='nav-link'>
                  Login
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/register' className='nav-link'>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className='nav-item'>
                <span className='nav-link' style={{ cursor: 'pointer' }} onClick={handleLogout}>
                  Logout
                </span>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
