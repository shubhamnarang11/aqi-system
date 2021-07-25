import './App.css';
import AQIMonitor from './components/aqi-monitor/aqi-monitor';
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
