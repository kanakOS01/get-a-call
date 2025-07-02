import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve the base template image
  app.get('/api/base-template', (req, res) => {
    const templatePath = path.resolve(process.cwd(), 'attached_assets', 'base_template_1751430296419.jpeg');
    res.sendFile(templatePath);
  });

  // Serve drop icon
  app.get('/api/drop-icon', (req, res) => {
    const dropPath = path.resolve(process.cwd(), 'attached_assets', 'drop.png');
    res.sendFile(dropPath);
  });

  // Serve pick icon
  app.get('/api/pick-icon', (req, res) => {
    const pickPath = path.resolve(process.cwd(), 'attached_assets', 'pick.png');
    res.sendFile(pickPath);
  });

  const httpServer = createServer(app);

  return httpServer;
}
