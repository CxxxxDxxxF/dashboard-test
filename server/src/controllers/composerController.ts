import { Request, Response } from 'express';

export class ComposerController {
  static async draftPost(req: Request, res: Response) {
    res.status(201).json({ success: true, message: 'Draft saved', data: req.body });
  }
  static async previewPost(req: Request, res: Response) {
    res.json({ success: true, message: 'Preview', data: req.body });
  }
  static async submitPost(req: Request, res: Response) {
    res.status(201).json({ success: true, message: 'Post submitted', data: req.body });
  }
} 