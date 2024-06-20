import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Press Start 2P', cursive;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #121212;
    color: #ffffff;
    overflow-x: hidden;
  }
  
  a {
    color: #61dafb;
    text-decoration: none;
  }

  a:hover {
    color: #21a1f1;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  header {
    background-color: #282c34;
    padding: 20px;
    color: white;
    text-align: center;
  }

  .content {
    padding: 20px;
  }
`;

export default GlobalStyle;
