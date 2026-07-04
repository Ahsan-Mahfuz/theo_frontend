import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './authSlice';

// Register endpoint modules so their injected endpoints attach to baseApi.
import './api/authApi';
import './api/accommodationApi';
import './api/assignmentApi';
import './api/scheduleApi';
import './api/calendarApi';
import './api/chatApi';
import './api/notificationApi';
import './api/paymentApi';
import './api/supportApi';
import './api/contentApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
