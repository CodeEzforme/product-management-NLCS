const Users = require('../../models/user.model');

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  try {
    res.render('client/pages/rooms-chat/index', {
      pageTitle: 'Danh sách phòng'
    })

  } catch (error) {
    console.log('Error occurred:', error);
    req.flash('error', 'Error occurred, redirect to previous page');
    res.redirect('back')
  }
}