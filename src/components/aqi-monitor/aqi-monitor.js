import { Component } from 'react';
import { CONFIG } from '../../utils/config';
import './aqi-monitor.scss';

export default class AQIMonitor extends Component {
  timerId;

  constructor(props) {
    super(props);

    this.state = {
      aqiData: {},
    };
  }

  componentDidMount() {
    this.initWebSocket();
  }

  throttleFunction = (func, data, delay) => {
    if (this.timerId) {
      return;
    }

    this.timerId = setTimeout(function () {
      func(data);
    }, delay);
  };

  updateAQIData = (data) => {
    const prevAQIData = JSON.parse(JSON.stringify(this.state.aqiData));

    data.forEach(({ city, aqi }) => {
      if (prevAQIData[city]) {
        const historySize = prevAQIData[city].history.length;
        prevAQIData[city].history.push({
          x: historySize + 1,
          y: prevAQIData[city].current,
        });
        prevAQIData[city].current = aqi;
        prevAQIData[city].lastUpdated = new Date();
      } else {
        prevAQIData[city] = {
          current: aqi,
          history: [],
          lastUpdated: new Date(),
        };
      }
    });

    this.timerId = undefined;
    this.setState({ aqiData: prevAQIData });
  };
  
  initWebSocket = () => {
    const ws = new WebSocket(CONFIG.WEBSOCKET_URL);

    ws.onopen = () => {
      console.log('Socket Started....');
    };

    ws.onmessage = (event) => {
      this.throttleFunction(
        this.updateAQIData.bind(this),
        JSON.parse(event.data),
        Object.keys(this.state.aqiData).length === 0 ? 0 : 5000
      );
    };

    ws.onerror = (err) => {
      console.log(err);
    };
  };

  getUpdatedAQITime = (currentTime) => {
    const timeDiff =
      (new Date().getTime() - new Date(currentTime).getTime()) / 1000;

    return timeDiff < 60 ? 'A few seconds ago' : `${timeDiff / 60} minute ago`;
  };

  getYValueForRange = (currentY) => {
    if (currentY >= 0 && currentY <= 50) {
      return 5;
    } else if (currentY > 50 && currentY <= 100) {
      return 10;
    } else if (currentY > 100 && currentY <= 200) {
      return 15;
    } else if (currentY > 200 && currentY <= 300) {
      return 20;
    } else if (currentY > 300 && currentY <= 400) {
      return 25;
    } else if (currentY > 400 && currentY <= 500) {
      return 30;
    }
  };

  getPointerDirection = (city) => {
    const { aqiData } = this.state;

    if (aqiData[city].history.length > 0) {
      const diff =
        this.getYValueForRange(aqiData[city].current) -
        this.getYValueForRange(
          aqiData[city].history[aqiData[city].history.length - 1].y
        );

      return diff > 0
        ? { dir: 'up', color: 'rgb(255, 0, 0)' }
        : { dir: 'down', color: 'rgb(0,176,80)' };
    }

    return '';
  };
  render() {
    const { aqiData } = this.state;

    return (
      <div className="aqi-monitor-cont">
        <div className="chart-div">
          <h3>Historical Data</h3>
          {Object.keys(aqiData).map((city) => (
            <div>
              {city}
              <svg width="500" height="25">
                <g className="container">
                  {aqiData[city].history.map((row, i) => (
                    <rect
                      x={i * 11}
                      y={25 - this.getYValueForRange(row.y)}
                      strokeWidth={1}
                      width={10}
                      height={this.getYValueForRange(row.y)}
                      fill={
                        CONFIG.COLOR_RANGE_MAPPING[
                          this.getYValueForRange(row.y)
                        ]
                      }
                    ></rect>
                  ))}
                </g>
              </svg>
            </div>
          ))}
        </div>
        <table className="aqi-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Current AQI</th>
              <th>Last Updated On</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(aqiData).map((city) => (
              <tr key={city}>
                <td>{city.toUpperCase()}</td>
                <td
                  style={{
                    color:
                      CONFIG.COLOR_RANGE_MAPPING[
                        this.getYValueForRange(aqiData[city].current)
                      ],
                  }}
                >
                  {aqiData[city].current.toFixed(2)}
                  {this.getPointerDirection(city) ? (
                    <i
                      class={`fas fa-arrow-${
                        this.getPointerDirection(city).dir
                      }`}
                      style={{ color: this.getPointerDirection(city).color }}
                    ></i>
                  ) : null}
                </td>
                <td>{this.getUpdatedAQITime(aqiData[city].lastUpdated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
