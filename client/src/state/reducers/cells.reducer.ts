import produce from 'immer';

import { Cell } from '../cell';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellsReducer = produce((state: CellsState, action: Action) => {
  switch (action.type) {

    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;

    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter(id => id !== action.payload);
      return state;

    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: action.payload.content || '',
        type: action.payload.type,
        id: action.payload.id || randomId(),
      };
      state.data[cell.id] = cell;
      const foundIndex = state.order.findIndex(id => id === action.payload.id);

      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }
      return state;

    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex(id => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }

      const swap = state.order[targetIndex];
      state.order[targetIndex] = state.order[index];
      state.order[index] = swap;
      return state;

    default:
      return state;
  }
}, initialState);

const randomId = () => Math.random().toString(36).substr(2, 5);

export default cellsReducer;
