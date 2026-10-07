import { render, screen } from '@testing-library/react';
import WeatherCard from '../components/WeatherCard';

it('renders label and value', () => {
  render(<WeatherCard icon="💧" label="Humidity" value="65%" />);
  expect(screen.getByText('Humidity')).toBeInTheDocument();
  expect(screen.getByText('65%')).toBeInTheDocument();
});
