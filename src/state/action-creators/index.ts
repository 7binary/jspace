import {
  DeleteCellAction, Direction,
  InsertAfterCellAction,
  MoveCellAction,
  UpdateCellAction,
} from '../actions';
import { ActionType } from '../action-types';
import { CellType } from '../cell';

export const updateCell = (id: string, content: string): UpdateCellAction => ({
  type: ActionType.UPDATE_CELL,
  payload: { id, content },
});

export const moveCell = (id: string, direction: Direction): MoveCellAction => ({
  type: ActionType.MOVE_CELL,
  payload: { id, direction },
});

export const deleteCell = (id: string): DeleteCellAction => ({
  type: ActionType.DELETE_CELL,
  payload: id,
});

export const insertCellAfter =
  (id: string | null, type: CellType, content?: string): InsertAfterCellAction => ({
    type: ActionType.INSERT_CELL_AFTER,
    payload: { id, type, content },
  });
