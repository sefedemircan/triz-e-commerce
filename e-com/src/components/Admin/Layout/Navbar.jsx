import { NavLink } from '@mantine/core';
import { useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export function AdminNavbar({ menuItems }) {
  const location = useLocation();

  return (
    <nav>
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          component={Link}
          to={item.path}
          label={item.label}
          leftSection={<item.icon size={20} />}
          active={location.pathname === item.path}
          variant="filled"
          styles={{
            root: {
              marginBottom: '0.5rem',
              '&[data-active]': {
                backgroundColor: 'var(--mantine-color-orange-6)',
                color: 'var(--mantine-color-white)'
              }
            }
          }}
        />
      ))}
    </nav>
  );
}

AdminNavbar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired
    })
  ).isRequired
}; 