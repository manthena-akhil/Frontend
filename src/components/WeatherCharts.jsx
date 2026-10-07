import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useSettings } from '../context/SettingsContext';
import { toUnit } from '../utils/weather';

const round = (n) => Math.round(n * 10) / 10;

function ChartCard({ title, children }) {
  return (
    <div className="card chart-card">
      <h3>{title}</h3>
      <div className="chart-scroll"><div className="chart-inner">{children}</div></div>
    </div>
  );
}

export default function WeatherCharts({ hours = [], days = [] }) {
  const { unit } = useSettings();
  if (!hours.length && !days.length) return null;

  const hourly = hours.map((h) => ({ time: h.time, temperature: round(toUnit(h.temperature, unit)), humidity: h.humidity, wind: h.windSpeed }));
  const weekly = days.map((d) => ({ day: d.day, max: round(toUnit(d.maxTemperature, unit)), min: round(toUnit(d.minTemperature, unit)) }));
  const grid = <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />;

  return (
    <section className="block" aria-label="Weather charts">
      <h2>Charts</h2>
      <div className="charts-grid">
        <ChartCard title={`Temperature (°${unit})`}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourly}>{grid}<XAxis dataKey="time" stroke="var(--muted)" /><YAxis stroke="var(--muted)" width={36} /><Tooltip />
              <Line type="monotone" dataKey="temperature" name="Temperature" stroke="var(--accent)" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Humidity (%)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourly}>{grid}<XAxis dataKey="time" stroke="var(--muted)" /><YAxis domain={[0, 100]} stroke="var(--muted)" width={36} /><Tooltip />
              <Area type="monotone" dataKey="humidity" name="Humidity" stroke="var(--cool)" fill="var(--cool)" fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Wind speed (km/h)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourly}>{grid}<XAxis dataKey="time" stroke="var(--muted)" /><YAxis stroke="var(--muted)" width={36} /><Tooltip />
              <Line type="monotone" dataKey="wind" name="Wind" stroke="var(--storm)" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={`Weekly temperature (°${unit})`}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>{grid}<XAxis dataKey="day" stroke="var(--muted)" /><YAxis stroke="var(--muted)" width={36} /><Tooltip /><Legend />
              <Bar dataKey="max" name="Max" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="min" name="Min" fill="var(--cool)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}
