import { AppContext } from "next/app";
import { AxiosInstance } from "axios";

import { Order } from "../../interfaces";
import { Heading } from "../../components";

interface Props {
  orders: Order[];
}

const OrderIndex = (props: Props) => {
  const { orders } = props;
  return (
    <main className="w-full container px-4 max-w-md mx-auto">
      <Heading>My Orders</Heading>
      <ul className="divide-y-2 divide-gray-100">
        {orders
          ? orders.map((order) => (
              <li key={order.id} className="p-3">
                {order.junk.title} - {order.status}
              </li>
            ))
          : null}
      </ul>
    </main>
  );
};

OrderIndex.getInitialProps = async (
  _context: AppContext["ctx"],
  client: AxiosInstance
) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
