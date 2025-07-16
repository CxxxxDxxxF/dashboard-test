export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.originalUrl} not found`,
            statusCode: 404,
        },
    });
};
//# sourceMappingURL=notFoundHandler.js.map