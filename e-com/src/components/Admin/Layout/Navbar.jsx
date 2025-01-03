import { NavLink } from '@mantine/core';
import { useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export function AdminNavbar({ menuItems }) {
  const location = useLocation();

  return (
    <nav>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            component={Link}
            to={item.path}
            label={item.label}
            leftSection={<item.icon size={20} />}
            active={isActive}
            variant="filled"
            mb="xs"
            styles={(theme) => ({
              root: {
                '&[dataActive]': {
                  backgroundColor: theme.colors.orange[6],
                  color: theme.white
                }
              }
            })}
          />
        );
      })}
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