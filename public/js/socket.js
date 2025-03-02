// var socket = io();
var socket = io("wss://chaluatungloan.food", {
    transports: ["websocket", "polling"],  // ✅ Hỗ trợ cả polling & websocket
    reconnectionAttempts: 5, // ✅ Thử lại 5 lần nếu bị mất kết nối
    reconnectionDelay: 1000, // ✅ Thử lại sau 1 giây
    timeout: 5000, // ✅ Timeout sau 5 giây nếu không kết nối được
    withCredentials: false
});

socket.on("connect", () => {
    console.log("🟢 WebSocket đã kết nối với server!");
});

socket.on("disconnect", () => {
    console.log("🔴 WebSocket bị ngắt kết nối! Thử lại...");
    setTimeout(() => socket.connect(), 2000);
});

socket.on("message", (msg) => {
    console.log("📩 Tin nhắn nhận được:", msg);
});
