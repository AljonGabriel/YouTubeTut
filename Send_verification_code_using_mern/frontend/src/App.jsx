import Register from './components/Register';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Register />
    </>
  );
}

export default App;
