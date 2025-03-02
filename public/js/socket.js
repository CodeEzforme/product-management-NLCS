var socket = io("https://chaluatungloan.food", {
    transports: ["websocket", "polling"],
    secure: true,
    withCredentials: true,
});
