//src/hoc/withAuth.tsx
'use client';

import React, { ComponentType, FC } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Higher-Order Component that protects a page/component by requiring authentication.
 * It leverages the `useAuth` hook, so all redirect logic is centralized there.
 *
 * @example
 * const OrdersPage = () => <div>Orders</div>;
 * export const ProtectedOrdersPage = withAuth(OrdersPage);
 */
export const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
): FC<P> => {
  const AuthenticatedComponent: FC<P> = (props) => {
    // Pull state from the central auth hook
    const { isAuthenticated, loading, isLoaded } = useAuth();

    // While the auth state is resolving, show a minimal loader.
    if (loading || !isLoaded) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <span className="animate-spin rounded-full border-2 border-t-transparent h-8 w-8" />
        </div>
      );
    }

    // If the user is not authenticated, `useAuth` will already have kicked off a redirect.
    // We render `null` to avoid flashing protected content while that happens.
    if (!isAuthenticated) {
      return null;
    }

    // All good—render the protected component.
    return <WrappedComponent {...props} />;
  };

  // Give the HOC a helpful display name for React DevTools.
  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return AuthenticatedComponent;
};
