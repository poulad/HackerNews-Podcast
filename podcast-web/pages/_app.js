import '../styles/globals.css'
import Layout from "./components/layout";
import {useEffect} from "react";
import {Fragment} from "react";
import theme from '../src/theme';
import {ThemeProvider} from '@material-ui/core/styles';

function MyApp({Component, pageProps}) {

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return <Fragment>
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  </Fragment>
}

export default MyApp
