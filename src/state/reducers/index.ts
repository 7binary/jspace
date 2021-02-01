import { combineReducers } from 'redux';
import cellsReducer from './cells.reducer';

const rootReducer = combineReducers({
  cells: cellsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
