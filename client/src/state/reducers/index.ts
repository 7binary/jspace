import { combineReducers } from 'redux';
import cellsReducer from './cells.reducer';
import bundlesReducer from './bundles.reducer';

const rootReducer = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
