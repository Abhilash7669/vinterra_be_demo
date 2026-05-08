export type TResponseDTO<T> = {
  success: boolean;
  message?: string;
  data?: T;
};
