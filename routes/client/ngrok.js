const express = require("express");
const router = express.Router();

let ngrokUrl = null; // Lưu URL Ngrok mới nhất

// API nhận URL Ngrok từ Django Local
router.post("/receive-ngrok", (req, res) => {
    const { ngrok_url } = req.body;
    if (!ngrok_url) {
        return res.status(400).json({ error: "Thiếu ngrok_url" });
    }
    ngrokUrl = ngrok_url;
    console.log("✅ Nhận URL Ngrok mới:", ngrokUrl);
    return res.json({ message: "Ngrok URL updated!", ngrok_url: ngrokUrl });
});

// API để lấy URL Ngrok mới nhất từ VPS
router.get("/get-ngrok", (req, res) => {
    return res.json({ ngrok_url: ngrokUrl || "Chưa có URL Ngrok nào được cập nhật!" });
});

module.exports = router;
