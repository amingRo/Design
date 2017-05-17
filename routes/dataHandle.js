var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('../Settings');
var session = require('express-session');
var mongodb = require('./../models/db');

app.use(session({
    secret:settings.cookieSecret,
    store:new MongoStore({
        db:settings.db,
        host:settings.host,
        port:settings.port,
        url:settings.url
    })
}));
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({extended:false}))

function Data() {

}
//首页选项卡数据
router.post('/process_get',function (req, res) {
    mongodb.open(function (err, db) {
        if(err){
            console.log("aaaaaaaaaaa");
            return
        }
        db.collection('playTime',function (err, collection) {
            if(err){
                console.log("bbbbbbbbbbb");
                return
            }
            console.log(collection);
            collection.findOne({},function (err, doc) {
                mongodb.close();
                if(err){
                    console.log("cccccccccc");
                }
                res.send(JSON.stringify(doc));
            })

        })
    })
})
//日历数据
router.post('/showPerformanceDate',function (req, res) {
    mongodb.open(function (err, db) {
        if(err){
            console.log("aaaaaaaaaaa");
            return
        }
        db.collection('playDate',function (err, collection) {
            if(err){
                console.log("bbbbbbbbbbb");
                return
            }
            console.log(collection);
            collection.findOne({},function (err, doc) {
                mongodb.close();
                if(err){
                    console.log("cccccccccc");
                }
                res.send(JSON.stringify(doc));
            })

        })
    })
})
//抛回场次查询数据
router.post('/areaListQuery',function (req, res) {
    mongodb.open(function (err, db) {
        if(err){
            console.log("aaaaaaaaaaa");
            return
        }
        db.collection('areaInfo',function (err, collection) {
            if(err){
                console.log("bbbbbbbbbbb");
                return
            }
            collection.findOne({},function (err, doc) {
                mongodb.close();
                if(err){
                    console.log("cccccccccc");
                }
                res.send(JSON.stringify(doc));
            })

        })
    })
})
//门票查询数据
router.post('/ticketQuery',function (req, res) {
    mongodb.open(function (err, db) {
        if(err){
            console.log("aaaaaaaaaaa");
            return
        }
        db.collection('ticketKind',function (err, collection) {
            if(err){
                console.log("bbbbbbbbbbb");
                return
            }
            collection.findOne({},function (err, doc) {
                mongodb.close();
                if(err){
                    console.log("cccccccccc");
                }
                res.send(JSON.stringify(doc));
            })

        })
    })
})
//座位查询
router.post("/seatQuery",function (req, res) {
    response =
res.send(JSON.stringify(response));
})


module.exports = router;