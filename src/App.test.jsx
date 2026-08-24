import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import App from './App';

test('renders blackjack title', () => {
  render(
    <MantineProvider>
      <App />
    </MantineProvider>
  );
  expect(screen.getByText(/black jack/i)).toBeInTheDocument();
});
