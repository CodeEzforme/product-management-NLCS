const request = require('supertest');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const { expect } = require('chai');

// Import module validate của bạn
const validate = require('../validates/client/user.validate');

const app = express();

// Cấu hình để parse dữ liệu dạng URL-encoded và JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình session và flash (middleware req.flash được sử dụng trong validate)
app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: true }));
app.use(flash());

// Tạo route tạm để test middleware registerPost
app.post('/test-register', validate.registerPost, (req, res) => {
  // Nếu qua được middleware validate, trả về 200
  res.status(200).send('OK');
});

describe('Kiểm tra validate registerPost', function () {
  // Test trường hợp cơ bản: thiếu fullName
  it('Phải trả về lỗi khi fullName bị bỏ trống', function (done) {
    request(app)
      .post('/test-register')
      .send({ fullName: '', email: 'test@example.com', password: '123456' })
      .expect(302, done);
  });

  // Test trường hợp cơ bản: email không hợp lệ
  it('Phải trả về lỗi khi email không hợp lệ', function (done) {
    request(app)
      .post('/test-register')
      .send({ fullName: 'Nguyễn Văn A', email: 'email-khong-hop-le', password: '123456' })
      .expect(302, done);
  });

  // Test trường hợp hợp lệ: chỉ có các trường cần thiết
  it('Phải qua validate khi các trường cần thiết đều hợp lệ', function (done) {
    request(app)
      .post('/test-register')
      .send({ fullName: 'Nguyễn Văn A', email: 'test@example.com', password: '123456' })
      .expect(200, done);
  });

  // Test trường hợp đặc biệt: cố gắng tiêm SQL vào email
  it('Phải trả về lỗi khi email chứa payload tấn công SQL injection', function (done) {
    request(app)
      .post('/test-register')
      .send({ fullName: 'Tên hợp lệ', email: "' OR 1=1;--", password: '123456' })
      .expect(302, done);
  });

  // Test trường hợp đặc biệt: gửi thêm các trường không cần thiết
  it('Phải qua validate khi gửi thêm các trường không cần thiết cùng với các trường bắt buộc', function (done) {
    request(app)
      .post('/test-register')
      .send({
        fullName: 'Nguyễn Văn A',
        email: 'test@example.com',
        password: '123456',
        _id: "67cfe90cd10ad80007ea4329",
        tokenUser: "iVw1tSN2BwU4OEFQzdvoszGst0AvPg",
        acceptFriends: [],
        requestFriends: [{ someField: "value" }],
        friendList: [{ createdAt: "2025-03-11T07:41:00.476+00:00" }]
      })
      .expect(200, done);
  });

  // Test trường hợp đặc biệt: fullName chứa ký tự đặc biệt (ví dụ XSS)
  it('Phải qua validate khi fullName chứa ký tự đặc biệt', function (done) {
    request(app)
      .post('/test-register')
      .send({ 
        fullName: "<script>alert('XSS')</script>", 
        email: 'test@example.com', 
        password: '123456' 
      })
      .expect(200, done);
  });
});
