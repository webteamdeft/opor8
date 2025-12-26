
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Role, User } from '../types';

interface RoleGuardProps {
  user: User | null;
  allowedRoles?: Role[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ user, allowedRoles, children }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// HOC for Role-based access control
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: Role[]
) {
  return (props: P & { user: User | null }) => {
    if (!props.user) {
      return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(props.user.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Component {...props} />;
  };
}
