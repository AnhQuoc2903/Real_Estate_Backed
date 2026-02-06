const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadCloudinary");

router.post("/ckeditor", upload.single("upload"), (req, res) => {
  return res.json({
    url: req.file.path, // CKEditor yêu cầu field "url"
  });
});

module.exports = router;
