import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';

export const withPermission = (permission: string) => {
  return function WithPermissionComponent(Component: React.ComponentType) {
    return function WrappedComponent(props: any) {
      const { user } = useContext(AuthContext);
      
      if (!user || !user.permissions?.includes(permission)) {
        return null;
      }
      
      return <Component {...props} />;
    };
  };
};

export const useHasPermission = (permission: string) => {
  const { user } = useContext(AuthContext);
  return user?.permissions?.includes(permission) ?? false;
};