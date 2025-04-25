export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  chatId: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
