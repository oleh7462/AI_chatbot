import { insertChatSchema, type Chat, type InsertChat, type Message, type InsertMessage } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

// CRUD interface for the application
export interface IStorage {
  // Chat operations
  createChat(chat: InsertChat): Promise<Chat>;
  getChat(id: string): Promise<Chat | undefined>;
  updateChat(id: string, update: Partial<Chat>): Promise<Chat | undefined>;
  getAllChats(): Promise<Chat[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessage(id: string): Promise<Message | undefined>;
  getChatMessages(chatId: string): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private chats: Map<string, Chat>;
  private messages: Map<string, Message>;

  constructor() {
    this.chats = new Map();
    this.messages = new Map();
  }

  // Chat operations
  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = insertChat.id || uuidv4();
    const now = new Date();
    
    const chat: Chat = {
      id,
      title: insertChat.title || "New Chat",
      createdAt: insertChat.createdAt || now,
      updatedAt: insertChat.updatedAt || now,
    };
    
    this.chats.set(id, chat);
    return chat;
  }

  async getChat(id: string): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async updateChat(id: string, update: Partial<Chat>): Promise<Chat | undefined> {
    const chat = this.chats.get(id);
    if (!chat) return undefined;
    
    const updatedChat = { ...chat, ...update };
    this.chats.set(id, updatedChat);
    return updatedChat;
  }

  async getAllChats(): Promise<Chat[]> {
    // Sort by updatedAt (newest first)
    return Array.from(this.chats.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  // Message operations
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = insertMessage.id || uuidv4();
    const now = new Date();
    
    const message: Message = {
      id,
      content: insertMessage.content,
      role: insertMessage.role as "user" | "assistant",
      chatId: insertMessage.chatId,
      createdAt: now,
    };
    
    this.messages.set(id, message);
    return message;
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    // Get all messages for a chat, sorted by createdAt
    return Array.from(this.messages.values())
      .filter(message => message.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}

export const storage = new MemStorage();
