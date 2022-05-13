import logo from './logo.svg';
import './App.css';
import TextField from "./components/TextField";
import RegisterRefugee from './components/RegisterRefugee/RegisterRefugee';
import EnlistDocument from './components/EnlistDocument/EnlistDocument';
import ProveClaim from './components/ProveClaim/ProveClaim';
function App() {
  return (
    <div className="App">
      <RegisterRefugee />
      <EnlistDocument/>
      <ProveClaim />
    </div>
  );
}

export default App;
