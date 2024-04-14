const uploadToCloudinary = require('../../helpers/uploadToCloudinary');
///////////ck khoi uplod files
module.exports.uploadFields = async (req, res, next) => {
  for (const key in req["files"]) {
    req.body[key] = [];

    const array = req["files"][key];
    for (const item of array) {
      try {
        const result = await uploadToCloudinary(item.buffer);
        req.body[key].push(result);
      } catch (error) {
        console.log(error);
      }
    }
  }
  next();
};

//////////









module.exports.upload = async (req, res, next) => {
  if(req.file) {
    const result = await uploadToCloudinary(req.file.buffer);

    req.body[req.file.fieldname] = result;
  }
  next();
}


// const multer = require('multer');
// const path = require('path');

// // Multer configuration
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, path.join(__dirname, '../uploads/'));
//     },
//     filename: (req, file, callback) => {
//         const filename = `${Date.now()}-${file.originalname}`;
//         callback(null, filename);
//     },
// });

// const fileFilter = (req, file, callback) => {
//     const allowedMimes = ['image/jpg', 'image/png'];
//     if (allowedMimes.includes(file.mimetype)) {
//         callback(null, true);
//     } else {
//         callback(new Error('Invalid file type. Only JPEG and PNG images are allowed.'), false);
//     }
// };


// module.exports = upload;


////////////////////////////////////

// const ApiError = require('../../middlewares/api-error.js')
// const uploadImageHelper = require('../../helpers/uploadImage.helper.js')

// module.exports.uploadImage = async (req, res, next) => {
//     if (req.file) {
//         req.body[req.file.fieldname] = await uploadImageHelper.uploadToCloudinary(req.file.buffer)
//     }
//     if (req.files && req.files.length) {
//         req.body[req.files[0].fieldname] = []
//         for (file of req.files) {
//             const url = await uploadImageHelper.uploadToCloudinary(file.buffer)
//             req.body[file.fieldname].push(url)
//         }
//     }
//     next()
// }