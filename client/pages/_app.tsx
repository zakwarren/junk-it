import type { AppProps, AppContext } from "next/app";
import "tailwindcss/tailwind.css";

import { buildClient } from "../api";

interface CurrentUser {
  id: string;
  email: string;
}

interface Props extends AppProps {
  currentUser: CurrentUser | null;
}

interface InitialProps {
  pageProps: {};
  currentUser: CurrentUser | null;
}

const AppComponent = ({ Component, pageProps, currentUser }: Props) => (
  <>
    <h1>Header: {currentUser?.email}</h1>
    <Component {...pageProps} />
  </>
);

AppComponent.getInitialProps = async (
  appContext: AppContext
): Promise<InitialProps> => {
  let pageProps = {};
  if (appContext.Component?.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  try {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get("/api/users/currentuser");
    return { pageProps, ...data };
  } catch (err) {
    console.log(err);
    return { pageProps, currentUser: null };
  }
};

export default AppComponent;
