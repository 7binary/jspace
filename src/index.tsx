import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import CodeWidget from './components/CodeWidget';

const App = () => {
  return (
    <div>
      <CodeWidget/>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
