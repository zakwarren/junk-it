import { useState, FormEvent } from "react";
import Router from "next/router";

import { useRequest } from "../../hooks";
import { Heading, Button } from "../../components";

const NewJunk = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/junk",
    method: "post",
    body: { title, price },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <form
      className="w-full max-w-md container mx-auto px-4"
      onSubmit={onSubmit}
    >
      <Heading>Create Junk</Heading>
      <div className="md:flex md:items-center mb-6">
        <label
          htmlFor="title"
          className="md:w-1/3 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
        >
          Title
        </label>
        <input
          className="md:w-2/3 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="md:flex md:items-center mb-6">
        <label
          htmlFor="price"
          className="md:w-1/3 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
        >
          Price
        </label>
        <input
          className="md:w-2/3 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          name="price"
          type="number"
          value={price}
          min="0"
          step="0.01"
          onBlur={onBlur}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      {errors}
      <Button>Submit</Button>
    </form>
  );
};

export default NewJunk;
