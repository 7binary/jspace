import { ActionType } from '../action-types';
import { CellType } from '../cell';

export type Direction = 'up' | 'down';

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

export interface InsertAfterCellAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellType;
    content?: string;
  }
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

export type Action = MoveCellAction | DeleteCellAction | InsertAfterCellAction | UpdateCellAction;
