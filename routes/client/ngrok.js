// const express = require("express");
// const router = express.Router();

// let ngrokUrl = null;

// // ✅ API nhận URL Ngrok từ Django Local
// router.post("/receive-ngrok", (req, res) => {
//     console.log("📥 Nhận request từ Django:", req.body); // ✅ Debug dữ liệu nhận được

//     // 🔹 Kiểm tra xem `req.body` có tồn tại không
//     if (!req.body || !req.body.ngrok_url) {
//         console.log("❌ Lỗi: Request không có `ngrok_url`");
//         return res.status(400).json({ error: "Thiếu ngrok_url trong request body" });
//     }

//     ngrokUrl = req.body.ngrok_url;
//     console.log("✅ Ngrok URL mới:", ngrokUrl);
//     return res.json({ message: "Ngrok URL updated!", ngrok_url: ngrokUrl });
// });

// // ✅ API để lấy URL Ngrok mới nhất từ VPS
// router.get("/get-ngrok", (req, res) => {
//     return res.json({ ngrok_url: ngrokUrl || "Chưa có URL Ngrok nào được cập nhật!" });
// });

// module.exports = router;
// /