const fs = require("fs");
const { execSync } = require("child_process");

async function updateNgrokUrl() {
    try {
        let response = await fetch("http://127.0.0.1:4040/api/tunnels");
        let data = await response.json();

        if (data.tunnels && data.tunnels.length > 0) {
            let ngrokUrl = data.tunnels[0].public_url;

            // Cập nhật file config.js hoặc .env
            const configPath = "config.js"; // Hoặc ".env"
            fs.writeFileSync(configPath, `export const NGROK_URL = "${ngrokUrl}";\n`);
            console.log("Cập nhật URL ngrok thành công:", ngrokUrl);

            // Đẩy lên GitHub
            execSync("git add .", { stdio: "inherit" });
            execSync(`git commit -m "Update ngrok URL to ${ngrokUrl}"`, { stdio: "inherit" });
            execSync("git push origin main", { stdio: "inherit" }); // Đổi `main` thành branch của bạn nếu khác
            console.log("Đã đẩy code lên GitHub!");

        } else {
            console.log("Không tìm thấy đường dẫn ngrok.");
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật URL ngrok:", error);
    }
}

updateNgrokUrl();
