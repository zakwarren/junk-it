import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect("junk-it", "abc", { url: "http://localhost:4222" });

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "1",
    title: "Taco made of nachos",
    price: 100,
  });

  stan.publish("junk:created", data, () => {
    console.log("Event published");
  });
});
