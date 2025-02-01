import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';

const BreadcrumbsComponent = () => {
  const location = useLocation();
  const history = useHistory();

  // Get the path segments from the current URL
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" onClick={() => history.push('/')}>
          Home
        </Link>
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          return (
            <Link
              key={path}
              color="inherit"
              onClick={() => history.push(path)}
            >
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsComponent;
