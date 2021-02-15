import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store, persistor } from 'src/state';
import CellList from 'src/components/CellList';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CellList/>
      </PersistGate>
    </Provider>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
