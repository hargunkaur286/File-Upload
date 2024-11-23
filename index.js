const express = require("express");
const multer = require("multer");
const uuid = require("uuid").v4;

const app = express();

//handling the uploading of a single file at first

// const upload = multer({dest: "uploads/"});

// app.post("/upload", upload.single("file"), (req, res) => {
//     res.json({status: "success"});
// });

//multiple fields upload

// const upload = multer({dest: "uploads/"});
// const multiUpload = upload.fields([
//     {name: "avatar", maxCount: 1},
//     {name: "resume", maxCount: 1},
// ]);

// app.post("/upload", multiUpload, (req, res) => {
//     //below line shows the information of the uploaded file
//     console.log(req.files);
//     res.json({status: "success"});
// });

//for multiple file uploads

//custom filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${uuid()}-${originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

// ["image", "jpeg"]

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 2 },
});

app.post("/upload", upload.array("file"), (req, res) => {
  res.json({ status: "success" });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code == "LIMIT_FILE_SIZE") {
      return resstatus(400).json({
        message: "File is too large!",
      });
    }
    if(error.code == "LIMIT_FILE_COUNT"){
        return res.status(400).json({
            message: "File limit reached!",
        });
    }
    if(error.code == "LIMIT_UNEXPECTED_FILE"){
        return res.status(400).json({
            message: "File must be of image type!",
        });
    }
  }
});

app.listen(4000, () => console.log("listening on port 4000"));
