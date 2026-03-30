import { FC, PropsWithChildren } from 'react';
import { useGetMeQuery } from '../../users';

const AuthInitializer: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useGetMeQuery();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  return <>{children}</>;
};

export default AuthInitializer;