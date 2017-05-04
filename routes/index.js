var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '万达主题娱乐中央预定系统' });
});
router.get('/chooseArea.exe', function(req, res, next) {
    res.render('chooseArea', { title: '万达主题娱乐中央预定系统' });
});
router.get('/chooseTicket.exe', function(req, res, next) {
    res.render('chooseTicket', { title: '万达主题娱乐中央预定系统' });
});
router.get('/confirmPackage.exe', function(req, res, next) {
    res.render('confirmPackage', { title: '万达主题娱乐中央预定系统' });
});
router.get('/paySuccess.exe', function(req, res, next) {
    res.render('paySuccess', { title: '万达主题娱乐中央预定系统' });
});
router.get('/user/:username')
module.exports = router;
