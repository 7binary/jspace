import {
  DeleteCellAction, Direction,
  InsertBeforeCellAction,
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

export const insertCellBefore = (id: string, type: CellType): InsertBeforeCellAction => ({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: { id, type },
});
