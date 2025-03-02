const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser")
const session = require("express-session");
const moment = require("moment");
const cors = require("cors");  // ✅ Thêm dòng này để import CORS middleware
var path = require('path');
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config();


const database = require("./config/database");
const systemConfig = require("./config/system");

database.connect();

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");


const app = express();
const port = process.env.PORT;


app.use(cors());
app.use(express.json()); // ✅ Cần có dòng này để parse JSON từ request body
app.use(express.urlencoded({ extended: true })); // ✅ Hỗ trợ dữ liệu form
const ngrokRoutes = require("./routes/ngrok"); // Đúng đường dẫn
app.use("/api", ngrokRoutes);

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// // // Socket.io
const server = http.createServer(app);
// const io = new Server(server);
// global._io = io;

// ✅ Cấu hình WebSocket
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    transports: ["polling", "websocket"],  // ✅ Hỗ trợ cả polling & websocket
    allowEIO3: true  // ✅ Hỗ trợ phiên bản socket.io cũ
});

io.on("connection", (socket) => {
    console.log("🟢 WebSocket kết nối thành công!");

    socket.on("message", (msg) => {
        console.log("📩 Tin nhắn nhận được:", msg);
        io.emit("message", msg); // Gửi lại cho tất cả client
    });

    socket.on("disconnect", () => {
        console.log("🔴 WebSocket bị ngắt kết nối!");
    });
});

// Flash
app.use(cookieParser("LGASGFSAADSJFD"));
// app.use(session({
//     cookie: {
//         maxAge: 60000
//     }
// }));
app.use(flash());

app.use(session({
    secret: "LGASGFSAADSJFD",
    resave: true, // ✅ Không lưu session nếu không có thay đổi
    saveUninitialized: true, // ✅ Tạo session mới nếu chưa có
    cookie: { maxAge: 60000 }
}));

// Hết Flash

// tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// hết TinyMCE

app.use(express.static(`${__dirname}/public`));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// biến toàn cục
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
// Hết biến toàn cục


//routes
const trimInput = (req, res, next) => {
    for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    }
    next();
}
app.use(trimInput);
// // ///////////////////////////////////////////test connect server routes//////////////////////////////////////////
// const testConnection = () => {
//     const options = {
//         hostname: '127.0.0.1',
//         port: 8000,
//         path: '/items/',
//         method: 'GET'
//     };

//     const req = http.request(options, (res) => {
//         let data = '';

//         console.log(`Status Code: ${res.statusCode}`); // Log mã trạng thái HTTP

//         res.on('data', (chunk) => {
//             // console.log('Received chunk:', chunk.toString()); // Log từng phần dữ liệu
//             data += chunk;
//         });

//         res.on('end', () => {
//             // console.log('Raw Data:', data || 'No data received'); // Log dữ liệu thô
//             try {
//                 const parsedData = JSON.parse(data);
//                 console.log('Parsed JSON Data:', parsedData);
//             } catch (error) {
//                 console.error('Error parsing JSON:', error.message);
//             }
//         });
//     });

//     req.on('error', (error) => {
//         console.error('Error connecting to Django API:', error.message);
//     });

//     req.end();
// };

// testConnection();
// // ///////////////////////////////////////////test connect server routes//////////////////////////////////////////

routeAdmin(app);
route(app);

app.get('*', (req, res) => {
    res.render('client/pages/errors/404', {
        pageTitle: '404 Not Found'
    })
})


server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});