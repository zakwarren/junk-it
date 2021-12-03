import { useState, useEffect } from "react";
import { AppContext } from "next/app";
import { AxiosInstance } from "axios";

import { Order } from "../../interfaces";
import { Heading } from "../../components";

interface Props {
  order: Order | null;
}

const getMsLeft = (expiresAt: string | undefined) => {
  if (expiresAt) {
    return new Date(expiresAt).getTime() - new Date().getTime();
  }
  return 0;
};

const OrderShow = ({ order }: Props) => {
  const [timeLeft, setTImeLeft] = useState(getMsLeft(order?.expiresAt));

  useEffect(() => {
    const findTImeLeft = () => {
      const msLeft = getMsLeft(order?.expiresAt);
      setTImeLeft(Math.round(msLeft / 1000));
    };

    const timerId = setInterval(findTImeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  return (
    <main className="w-full container px-4 max-w-md mx-auto">
      <Heading>{order?.junk.title}</Heading>
      <h4 className="text-base font-normal leading-normal mt-0 mb-2">
        Price: {order?.junk.price}
      </h4>
      <h4 className="text-base font-normal leading-normal mt-0 mb-2">
        {timeLeft >= 0
          ? `${timeLeft} seconds until order expires.`
          : "Order expired"}
      </h4>
    </main>
  );
};

OrderShow.getInitialProps = async (
  context: AppContext["ctx"],
  client: AxiosInstance
) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
