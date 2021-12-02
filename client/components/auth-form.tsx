import { useState, FormEvent } from "react";
import Router from "next/router";

import { useRequest } from "../hooks";
import { Heading } from "./heading";
import { Button } from "./button";

interface Props {
  title: string;
  url: string;
}

export const AuthForm = (props: Props) => {
  const { title, url } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url,
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const onSumbit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <form
      onSubmit={onSumbit}
      className="w-full max-w-md container mx-auto px-4"
    >
      <Heading className="text-6xl font-normal leading-normal mt-0 mb-2 text-purple-800">
        {title}
      </Heading>
      <div className="md:flex md:items-center mb-6">
        <label
          htmlFor="email"
          className="md:w-1/3 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
        >
          Email Address
        </label>
        <input
          className="md:w-2/3 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="md:flex md:items-center mb-6">
        <label
          htmlFor="password"
          className="md:w-1/3 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
        >
          Password
        </label>
        <input
          className="md:w-2/3 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <Button>Submit</Button>
    </form>
  );
};
