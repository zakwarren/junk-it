import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQCZ/cAHFEmNhkrrkDfgv/KCQxDj2yCaoRlwUTPdo79PbnXg+njW
hqhj1LUpykQnmcZPbVuryj9m/sqXWcOSoxCHFeCsapvu1uaWtow5dwlrrfFSI4TJ
8LIlekqMRg2VlSuDZcnMwzpJeo5J2FyBeRIA0aEGjEZU/r8fKtPRwdf6UQIDAQAB
AoGAQ6gjSHj3YADSxfCVPF/ZMrY4o4PRLV7+iESFHyokkcecbv5dPRPoxAPenL/L
dgKwCJGppy6y8JOdeyXrMXAHgD+7UbXgKHZUdJ42+QboyFw6LZMuA+n/+0GhmA0J
iVyU/AuKZ56Mq1kUbtXhjZA/R0q0xiaVvobG5T0XNAHeVIECQQD3cvazmmO/S5Fn
YRtXo235+mqM43yLtb+LXi2sDWEZnM/w68ciG9ql4ybS6ojcsYjaYVyujdqIQDEI
pQF8cQaZAkEAn1AFC5Nv+JqxNvQk4XMMk71ZBa3YqK5TiGxdDIj1dsn2CyJz3bcx
zpJHb1knMzo5iQC+ur7RBLwrZA8wNeA8eQJAOj2LxTAEZCTkH0Hizpi/rMN8ypZM
XRG0+Jd9Bm7LuNyIsLq9ztBhgQPawm/DMLZ0cHnT952ZntIE+HTlyaVMmQJAIjPV
wXR315GudjPYLya6DoXaNOPr3dr/SAyrtWM5/7TARAezhGguI0E4YOltBwx7CbTF
PeZ1jWSwlBzGpuprUQJAIHWjH1+mcFgFwShhcu/noFHgJzKNblQZDgPAaiN+z3c9
WDf+eemq7ZCg+Yxr0Xk+c1osFdeAeEEWweCAxY2GNw==
-----END RSA PRIVATE KEY-----`;
  process.env.JWT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZ/cAHFEmNhkrrkDfgv/KCQxDj
2yCaoRlwUTPdo79PbnXg+njWhqhj1LUpykQnmcZPbVuryj9m/sqXWcOSoxCHFeCs
apvu1uaWtow5dwlrrfFSI4TJ8LIlekqMRg2VlSuDZcnMwzpJeo5J2FyBeRIA0aEG
jEZU/r8fKtPRwdf6UQIDAQAB
-----END PUBLIC KEY-----`;

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY!, {
    algorithm: "RS256",
  });
  const session = JSON.stringify({ jwt: token });
  const base64 = Buffer.from(session).toString("base64");
  return [`express:sess=${base64}`];
};
