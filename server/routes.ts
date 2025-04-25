import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAIResponse } from "./lib/openai";
import { z } from "zod";
import { insertChatSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chats API
  app.get("/api/chats", async (req, res) => {
    try {
      const chats = await storage.getAllChats();
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chats" });
    }
  });

  app.post("/api/chats", async (req, res) => {
    try {
      const validation = insertChatSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid chat data", errors: validation.error.format() });
      }
      
      const chat = await storage.createChat(validation.data);
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ message: "Failed to create chat" });
    }
  });

  app.get("/api/chats/:chatId", async (req, res) => {
    try {
      const { chatId } = req.params;
      const chat = await storage.getChat(chatId);
      
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      res.json(chat);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat" });
    }
  });

  // Chat Messages API
  app.get("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const { chatId } = req.params;
      const messages = await storage.getChatMessages(chatId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const { chatId } = req.params;
      const { v4: uuidv4 } = await import("uuid");
      
      // Generate an ID and add it to the message data
      const messageData = { 
        ...req.body, 
        chatId,
        id: uuidv4() 
      };
      
      const validation = insertMessageSchema.safeParse(messageData);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid message data", errors: validation.error.format() });
      }
      
      // Check if chat exists
      const chat = await storage.getChat(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      // Save user message
      const userMessage = await storage.createMessage(validation.data);
      
      // Generate AI response
      const previousMessages = await storage.getChatMessages(chatId);
      const aiContent = await generateAIResponse(previousMessages, userMessage.content);
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        id: uuidv4(),
        chatId,
        content: aiContent,
        role: "assistant"
      });
      
      // Update chat with title based on first message if it's new
      if (previousMessages.length === 0) {
        const titleGenerationPrompt = `Based on this user message: "${userMessage.content}", generate a very short chat title (max 5 words).`;
        const title = await generateAIResponse([], titleGenerationPrompt);
        await storage.updateChat(chatId, { title: title.split("\n")[0].trim() });
      }
      
      // Update the last activity timestamp
      await storage.updateChat(chatId, { updatedAt: new Date() });
      
      // Return both messages
      res.status(201).json([userMessage, aiMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
