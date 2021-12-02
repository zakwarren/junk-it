import type { AppProps, AppContext } from "next/app";
import "tailwindcss/tailwind.css";

import { buildClient } from "../api";
import { Header } from "../components";

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
    <Header currentUser={currentUser} />
    <Component {...pageProps} currentUser={currentUser} />
  </>
);

AppComponent.getInitialProps = async (
  appContext: AppContext
): Promise<InitialProps> => {
  let pageProps = {};
  let currentUser = null;
  const client = buildClient(appContext.ctx);

  try {
    const { data } = await client.get("/api/users/currentuser");
    currentUser = data?.currentUser;
  } catch (err) {
    console.log(err);
  }

  if (appContext.Component?.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      // @ts-ignore
      client,
      currentUser
    );
  }

  return { pageProps, currentUser };
};

export default AppComponent;
