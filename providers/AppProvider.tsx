import { BookmarkProvider } from '@/context/BookmarkContext';
import { store } from '@/services/store';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import SocketProvider from './SocketProvider';
import AuthProvider from './AuthProvider';
import CallProvider from './CallProvider';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketProvider>
          {/* <CallProvider> */}
          <BookmarkProvider>{children}</BookmarkProvider>
          {/* </CallProvider> */}
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
};

export default AppProvider;
