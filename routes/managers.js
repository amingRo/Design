/**
 * Created by amingRo on 2017/5/27.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/12345', function(req, res, next) {
    // res.send('user:' + req.params.username);
    res.render('manageLogin');
});
router.get('/admin/:username', function(req, res, next) {
    // res.send('user:' + req.params.username);
    res.render('manage',{user:req.params.username});
});
module.exports = router;