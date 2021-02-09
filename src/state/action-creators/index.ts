import {
  BundleCompleteAction,
  BundleStartAction,
  DeleteCellAction,
  Direction,
  InsertAfterCellAction,
  MoveCellAction,
  UpdateCellAction,
} from '../actions';
import { ActionType } from '../action-types';
import { CellType } from '../cell';
import { AppDispatch } from '../store';
import bundle, { BundledResut } from '../../bundler';

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

const startBundle = (cellId: string): BundleStartAction => ({
  type: ActionType.BUNDLE_START,
  payload: { cellId },
});

const completeBundle = (cellId: string, bundled: BundledResut): BundleCompleteAction => ({
  type: ActionType.BUNDLE_COMPLETE,
  payload: { cellId, bundled },
});

export const createBundle = (cellId: string, input: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(startBundle(cellId));
    const bundled = await bundle(input);
    dispatch(completeBundle(cellId, bundled));
  };
