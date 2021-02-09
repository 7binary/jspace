import produce from 'immer';
import { BundledResut } from '../../bundler';
import { Action } from '../actions';
import { ActionType } from '../action-types';

interface BundlesState {
  [key: string]: {
    loading: boolean;
    bundled: BundledResut;
  } | undefined;
}

const initialState = {};

const bundlesReducer = produce((state: BundlesState, action: Action) => {
  switch (action.type) {

    case ActionType.BUNDLE_START:
      state[action.payload.cellId] = {
        loading: true,
        bundled: {
          transpiled: '',
          code: '',
          error: null,
        },
      };
      return state;

    case ActionType.BUNDLE_COMPLETE:
      state[action.payload.cellId] = {
        loading: false,
        bundled: action.payload.bundled,
      };
      return state;

    default:
      return state;
  }
}, initialState);

export default bundlesReducer;
