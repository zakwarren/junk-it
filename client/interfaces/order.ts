import { Junk } from "./junk";

export interface Order {
  id: string;
  version: number;
  status: string;
  expiresAt: string;
  userId: string;
  junk: Junk;
}
