import { applyMiddleware, createStore, compose, AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import rootReducer, { RootState } from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// @ts-ignore
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;
const persistConfig = { key: 'root', storage };
const persistedReducer = persistReducer(persistConfig, rootReducer);

type DispatchFunctionType = ThunkDispatch<RootState, undefined, AnyAction>;

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware<DispatchFunctionType, RootState>(thunk)),
);
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;

