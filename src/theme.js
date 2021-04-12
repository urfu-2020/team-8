import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#ffffff',
      light: '#61dafb',
      dark: '#21a1c4',
    },
    secondary: {
      main: '#b5ecfb',
      light: '#61dafb',
      dark: '#21a1c4',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#282c34',
    },
  },
  spacing: 8,
  overrides: {
    MuiPaper: {
      root: {
        padding: '20px',
        margin: '10px 0px 10px 0px',
        backgroundColor: '#fff', // 5d737e
        height: "100%",

      },
    },
    MuiButton: {
      root: {
        margin: '5px',
      },
    },
    
  },
});
export default theme;