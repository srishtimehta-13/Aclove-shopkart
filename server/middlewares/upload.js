import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const allowedImageTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/gif"
        ];

        if (!allowedImageTypes.includes(file.mimetype)) {
            callback(new Error("Only JPEG, PNG, WebP, AVIF, and GIF images are allowed"));
            return;
        }

        callback(null, true);
    }
});

export default upload;