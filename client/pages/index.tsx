import React from "react";
import { AppContext } from "next/app";
import Link from "next/link";
import { AxiosInstance } from "axios";

import { CurrentUser, Junk } from "../interfaces";
import { Heading } from "../components";

interface Props {
  currentUser: CurrentUser | null;
  junk: [Junk];
}

const Landing = (props: Props) => {
  const { currentUser, junk } = props;

  const junkList = junk.map((junk) => (
    <tr key={junk.id}>
      <td className="px-6 py-4 whitespace-nowrap">{junk.title}</td>
      <td className="px-6 py-4 whitespace-nowrap">{junk.price}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link href="/junk/[junkId]" as={`/junk/${junk.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <main className="w-full container px-4">
      <Heading>
        {currentUser ? `Welcome ${currentUser.email}` : "You are not signed in"}
      </Heading>
      <table className="border-collapse table-auto min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            ></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{junkList}</tbody>
      </table>
    </main>
  );
};

Landing.getInitialProps = async (
  context: AppContext["ctx"],
  client: AxiosInstance,
  currentUser: CurrentUser | null
) => {
  const { data } = await client.get("/api/junk");

  return { junk: data };
};

export default Landing;
