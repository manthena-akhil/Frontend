import { render, screen } from '@testing-library/react';
import Forecast from '../components/Forecast';
import { SettingsProvider } from '../context/SettingsContext';

const days = [
  { day: 'Mon', date: '06 Oct', icon: '01d', condition: 'Clear Sky', maxTemperature: 30, minTemperature: 22, humidity: 60, windSpeed: 12 },
  { day: 'Tue', date: '07 Oct', icon: '10d', condition: 'Light Rain', maxTemperature: 27, minTemperature: 21, humidity: 80, windSpeed: 15 },
];

describe('Forecast', () => {
  it('renders a card per day with temperatures in Celsius', () => {
    localStorage.setItem('unit', 'C');
    render(<SettingsProvider><Forecast days={days} /></SettingsProvider>);
    expect(screen.getByText('2-day forecast')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('30°')).toBeInTheDocument();
    expect(screen.getByText('Light Rain')).toBeInTheDocument();
  });

  it('converts to Fahrenheit when selected', () => {
    localStorage.setItem('unit', 'F');
    render(<SettingsProvider><Forecast days={days} /></SettingsProvider>);
    expect(screen.getByText('86°')).toBeInTheDocument(); // 30°C
  });

  it('renders nothing without data', () => {
    const { container } = render(<SettingsProvider><Forecast days={[]} /></SettingsProvider>);
    expect(container).toBeEmptyDOMElement();
  });
});
