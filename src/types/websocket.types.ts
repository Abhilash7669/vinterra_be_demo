import { WebSocket } from "ws";

export type AliveWebSocket = WebSocket & {
  isAlive?: boolean;
};
