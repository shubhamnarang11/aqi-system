import './App.css';
import AQIMonitor from './components/aqi-monitor/AQIMonitor';
import AQIScale from './components/aqi-scale/AQIScale';

function App() {
  return (
    <div className="App">
      <h2>AQI</h2>
      <AQIMonitor></AQIMonitor>
      <AQIScale></AQIScale>
    </div>
  );
}

export default App;
