import { CONFIG } from '../../utils/config';
import './AQIScale.scss';

export default function AQIScale() {
  const scaleData = [
    {
      from: 0,
      to: 50,
      colorValue: 5,
    },
    {
      from: 51,
      to: 100,
      colorValue: 10,
    },
    {
      from: 101,
      to: 200,
      colorValue: 15,
    },
    {
      from: 201,
      to: 300,
      colorValue: 20,
    },
    {
      from: 301,
      to: 400,
      colorValue: 25,
    },
    {
      from: 401,
      to: 500,
      colorValue: 30,
    },
  ];
  return (
    <div className="scale-container">
      <h3>AQI Scale</h3>
      <div>
        {scaleData.map((row) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div class={`c100 p${row.to / 5} center`}>
              <span
                style={{ color: CONFIG.COLOR_RANGE_MAPPING[row.colorValue] }}
              >
                {row.from} - {row.to}
              </span>
              <div class="slice">
                <div
                  class="bar"
                  style={{
                    borderColor: CONFIG.COLOR_RANGE_MAPPING[row.colorValue],
                  }}
                ></div>
                <div
                  class="fill"
                  style={{
                    borderColor: CONFIG.COLOR_RANGE_MAPPING[row.colorValue],
                  }}
                ></div>
              </div>
            </div>
            <span>{CONFIG.SCALE_VALUE_MAPPING[row.colorValue]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
