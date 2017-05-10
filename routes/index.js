var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '万达主题娱乐中央预定系统' });
});

router.get('/chooseArea', function(req, res, next) {
    res.render('chooseArea', { title: '万达主题娱乐中央预定系统' });
});
router.get('/chooseTicket', function(req, res, next) {
    res.render('chooseTicket', { title: '万达主题娱乐中央预定系统' });
});
router.get('/confirmPackage', function(req, res, next) {
    res.render('confirmPackage', { title: '万达主题娱乐中央预定系统' });
});
router.get('/paySuccess', function(req, res, next) {
    res.render('paySuccess', { title: '万达主题娱乐中央预定系统' });
});
router.get('/login',function (req, res, next) {
    res.render('login')
})
// router.get("/users/:username",function (req, res) {
//     res.send("user:" + req.params.username);
// })


module.exports = router;
