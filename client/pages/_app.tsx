import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";

const App = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default App;
