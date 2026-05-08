export type TSendMessage = {
  type: TTypeLiterals;
  data: string;
  info?: {
    fromUserId: string;
  };
};

export type TIncomingMessage = {
  type: TTypeLiterals;
  data: string | RTCSessionDescription;
  info: {
    userId: string;
    fromUserId: string;
  };
};

export type TTypeLiterals =
  | "join"
  | "message"
  | "offer"
  | "answer"
  | "connected";
