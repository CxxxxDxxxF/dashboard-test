export class ComposerController {
    static async draftPost(req, res) {
        res.status(201).json({ success: true, message: 'Draft saved', data: req.body });
    }
    static async previewPost(req, res) {
        res.json({ success: true, message: 'Preview', data: req.body });
    }
    static async submitPost(req, res) {
        res.status(201).json({ success: true, message: 'Post submitted', data: req.body });
    }
}
//# sourceMappingURL=composerController.js.map