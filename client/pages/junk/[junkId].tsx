import { AppContext } from "next/app";
import Router from "next/router";
import { AxiosInstance } from "axios";

import { CurrentUser, Junk, Order } from "../../interfaces";
import { useRequest } from "../../hooks";
import { Heading, Button } from "../../components";

interface Props {
  junk: Junk;
}

const JunkShow = ({ junk }: Props) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { junkId: junk.id },
    onSuccess: (order: Order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <main className="w-full container px-4 max-w-md mx-auto">
      <Heading>{junk.title}</Heading>
      <h4 className="text-base font-normal leading-normal mt-0 mb-2">
        Price: {junk.price}
      </h4>
      {errors}
      <Button onClick={() => doRequest()}>Purchase</Button>
    </main>
  );
};

JunkShow.getInitialProps = async (
  context: AppContext["ctx"],
  client: AxiosInstance,
  currentUser: CurrentUser | null
) => {
  const { junkId } = context.query;
  const { data } = await client.get(`/api/junk/${junkId}`);

  return { junk: data };
};

export default JunkShow;
