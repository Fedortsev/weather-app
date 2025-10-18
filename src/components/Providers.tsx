'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeCities } from '@/store/citiesSlice';

function InitializeCities({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeCities());
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitializeCities>{children}</InitializeCities>
    </Provider>
  );
}
