import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  it('shows a message when the city is empty and does not search', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} onLocation={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a city name.');
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('searches with the trimmed city name', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} onLocation={() => {}} />);
    await userEvent.type(screen.getByLabelText('City name'), '  Hyderabad  ');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('Hyderabad');
  });

  it('shows recent searches and calls onLocation', async () => {
    const onSearch = vi.fn(); const onLocation = vi.fn();
    render(<SearchBar onSearch={onSearch} onLocation={onLocation} recent={['Delhi']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Delhi' }));
    expect(onSearch).toHaveBeenCalledWith('Delhi');
    await userEvent.click(screen.getByRole('button', { name: /Use My Location/ }));
    expect(onLocation).toHaveBeenCalled();
  });
});
