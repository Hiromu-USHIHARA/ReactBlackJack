import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import '@mantine/core/styles.css';

function AppWithHotkeys() {
  const { toggleColorScheme } = useMantineColorScheme();
  useHotkeys([['mod+J', () => toggleColorScheme()]]);
  return <App />;
}

function Root() {
  return (
    <MantineProvider defaultColorScheme="light">
      <AppWithHotkeys />
    </MantineProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);

reportWebVitals();
