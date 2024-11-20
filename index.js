const express = require("express");
const multer = require("multer");

const app = express();

//handling the uploading of a single file at first

// const upload = multer({dest: "uploads/"});

// app.post("/upload", upload.single("file"), (req, res) => {
//     res.json({status: "success"});
// });

//for multiple file uploads
// const upload = multer({dest: "uploads/"});

// app.post("/upload", upload.array("file", 2), (req, res) => {
//     res.json({status: "success"});
// });

//multiple fields upload

const upload = multer({dest: "uploads/"});
const multiUpload = upload.fields([
    {name: "avatar", maxCount: 1}, 
    {name: "resume", maxCount: 1},
]);

app.post("/upload", multiUpload, (req, res) => {
    //below line shows the information of the uploaded file
    console.log(req.files);
    res.json({status: "success"});
});

app.listen(4000, () => console.log("listening on port 4000"));

