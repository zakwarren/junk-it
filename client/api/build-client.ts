import { NextApiRequest } from "next";
import axios from "axios";

const serverSideAxios = axios.create({
  baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
  withCredentials: true,
});

export const buildClient = ({ req }: { req: NextApiRequest }) => {
  serverSideAxios.defaults.headers = req.headers;
  return serverSideAxios;
};
