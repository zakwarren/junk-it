import nats from "node-nats-streaming";

import { JunkCreatedPublisher } from "./events";

console.clear();

const stan = nats.connect("junk-it", "abc", { url: "http://localhost:4222" });

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const publisher = new JunkCreatedPublisher(stan);
  publisher.publish({
    id: "1",
    title: "Taco made of nachos",
    price: 100,
  });
});
