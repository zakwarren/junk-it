import type { AppProps, AppContext } from "next/app";
import Head from "next/head";
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
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
    <Header currentUser={currentUser} />
    <Component {...pageProps} currentUser={currentUser} />
  </>
);

AppComponent.getInitialProps = async (
  appContext: AppContext
): Promise<InitialProps> => {
  if (!process.env.NEXT_PUBLIC_STRIPE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_KEY should be defined");
  }

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
