require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { s3Uploadv3 } = require("./s3Service");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB size, max 5 files
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

app.post(
  "/upload",
  uploadLimiter,
  upload.array("file"),
  async (req, res, next) => {
    try {
      const results = await s3Uploadv3(req.files);
      console.log(results);

      return res.status(200).json({
        status: "success",
        message: "File(s) uploaded successfully!",
        files: results.map((file) => ({
          fileName: file.originalname,
          fileUrl: file.Location, // Adjust based on AWS SDK version
        })),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "File upload failed.",
      });
    }
  }
);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "The uploaded file is too large. Maximum size allowed is 5MB.",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "You can only upload up to 5 files at a time.",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "Only image files are allowed.",
      });
    }
  } else if (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }

  next();
});

app.listen(4000, () => console.log("listening on port 4000"));
