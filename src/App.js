import './App.css';
import logo from './logo.svg';

function App() {
  return (
    <div>
      <header>
        <div>Event-List</div>
        <div>
          <form>
            First Name
            <input placeholder="First Name" />
            Last Name
            <input placeholder="Last Name" />
            <button>Attending</button>
          </form>
        </div>
        <div>Guest List</div>
      </header>
    </div>
  );
}

export default App;
