import React from "react";
import { NextApiRequest } from "next";

import { buildClient } from "../api";

interface CurrentUser {
  id: string;
  email: string;
}

interface Props {
  currentUser: CurrentUser | null;
}

const Landing = (props: Props) => {
  const { currentUser } = props;

  return (
    <main className="w-full container px-4">
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-purple-800">
        {currentUser ? `Welcome ${currentUser.email}` : "You are not signed in"}
      </h1>
    </main>
  );
};

export default Landing;

export const getServerSideProps = async (context: {
  req: NextApiRequest;
}): Promise<{ props: Props }> => {
  try {
    const client = buildClient(context);
    const { data } = await client.get("/api/users/currentuser");
    return { props: data };
  } catch (err) {
    console.log(err);
    return { props: { currentUser: null } };
  }
};
