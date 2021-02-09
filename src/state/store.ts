import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { ActionType } from './action-types';

// @ts-ignore
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
export type AppDispatch = typeof store.dispatch;

// start data for demo purpose
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: 'code',
    content: `import React from 'react';
import ReactDOM from 'react-dom';
const App = () => <h1 style={{textAlign:'center'}}>Hello</h1>;
ReactDOM.render(<App/>, document.querySelector('#root'));`,
  },
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: 'text',
    content: `# Click to edit!
- Mark Down
- Syntax`,
  },
});

