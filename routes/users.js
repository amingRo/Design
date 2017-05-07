var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:username', function(req, res, next) {
  // res.send('user:' + req.params.username);
  res.render('users', { title: '万达主题娱乐中央预定系统' });
});

module.exports = router;
