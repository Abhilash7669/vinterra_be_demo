import { IncomingMessage } from "http";
import { WebSocket } from "ws";
import { Server } from "ws";

export function broadcastMessage(
  message: unknown,
  _wss: Server<typeof WebSocket, typeof IncomingMessage>,
) {
  for (const client of _wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
      console.log("Sending message");
    }
  }
}
