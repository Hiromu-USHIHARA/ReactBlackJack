import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import "@mantine/core/styles.css"

function Root(){
  const [colorScheme, setColorScheme] = useState("light");

  // toggle function
  const toggleColorScheme = () => setColorScheme((prev) => (prev==="light" ? "dark" : "light"));
  // short cut: ctrl+J
  useHotkeys([["mod+J", ()=>toggleColorScheme()]]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
      <App colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
    </MantineProvider>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Root />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
