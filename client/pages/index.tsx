import React from "react";
import { NextApiRequest } from "next";
import axios from "axios";

interface CurrentUser {
  id: string;
  email: string;
}

interface Props {
  currentUser: CurrentUser | null;
}

const Landing = (props: Props) => {
  const { currentUser } = props;
  console.log(currentUser);

  return (
    <main className="w-full max-w-lg container px-4">
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-purple-800">
        Landing Page
      </h1>
    </main>
  );
};

export default Landing;

export const getServerSideProps = async ({
  req,
}: {
  req: NextApiRequest;
}): Promise<{ props: Props }> => {
  try {
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      { headers: req.headers }
    );
    return { props: { currentUser: response.data } };
  } catch (err) {
    console.log(err);
    return { props: { currentUser: null } };
  }
};
