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

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
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
            // console.log(collection);
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
    console.log(req.body['performanceId']);
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
    mongodb.open(function (err, db) {
        if(err){
            console.log("aaaaaaaaaaa");
            return
        }
        db.collection('seatsInfo',function (err, collection) {
            if(err){
                console.log("bbbbbbbbbbb");
                return
            }
            collection.findOne({"performance":req.body['performanceId']},function (err, doc) {
                mongodb.close();
                if(err){
                    console.log("cccccccccc");
                }
                res.send(JSON.stringify(doc));
            })

        })
    })
})
//查询订单
router.post("/menuQuery",function (req, res) {
    mongodb.open(function (err, db) {
        if(err){
            console.log("打开订单数据库！")
            return
        }
        db.collection('menuList',function (err, collection) {
            if(err){
                mongodb.close();
                console.log("打开订单数据库出错！");
            }
            collection.find({personContact:req.body['contect']}).sort({performance:-1}).toArray(function (err,doc) {
                console.log(req.body['contect']);
                mongodb.close();
                if(err){
                    console.log("订单查询集合时出错！");
                }
                res.send(JSON.stringify(doc));
            })
        })
    })
})
//查询订单
router.post("/allList",function (req, res) {
    mongodb.open(function (err, db) {
        if(err){
            console.log("打开订单数据库！")
            return
        }
        db.collection('menuList',function (err, collection) {
            if(err){
                mongodb.close();
                console.log("打开订单数据库出错！");
            }
            collection.find().sort({performance:-1}).toArray(function (err,doc) {
                console.log(req.body['contect']);
                mongodb.close();
                if(err){
                    console.log("订单查询集合时出错！");
                }
                res.send(JSON.stringify(doc));
            })
        })
    })
})
//创建订单
router.post("/creatMenu",function (req, res) {
    var oneMenu = {};
    oneMenu.success = "success";
    oneMenu.performance = req.body['performance'],
    oneMenu.ticketName = req.body['ticketName'],
    oneMenu.totalMoney = req.body['totalMoney'],
    oneMenu.ticketNum = req.body['ticketNum'],
    oneMenu.areaSelectNum = req.body['areaSelectNum'],
    oneMenu.areaSelectName = req.body['areaSelectName'],
    oneMenu.userName = req.body['userName'],
    oneMenu.personId = req.body['personId'],
    oneMenu.showTime = req.body['showTime'],
    oneMenu.personContact = req.body['personContact'],
    oneMenu.seatSelected = JSON.parse(req.body['seatSelected']),
    oneMenu.onlyId = randomString(32)
    mongodb.open(function (err, db) {
        if(err){
            console.log("创建订单时打开数据库出错！");
            return
        }

        db.collection('menuList',function (err, collection) {
            if(err){
                mongodb.close();
                console.log("生成订单时数据库出错！")
            }
            collection.insert(oneMenu,{safe:true},function (err, oneMenu) {
                mongodb.close();
            })
        })
        db.collection('seatsInfo',function (err, collection) {
            if(err){
                mongodb.close();
                console.log("打开座位数据库时失败！")
            }
            collection.save({})
        })
    })
    res.send(JSON.stringify(oneMenu));
})
//删除订单
router.post("/userDelMenu",function (req, res) {
    mongodb.open(function (err, db) {
        if(err){
            console.log("aaaaaaaaaaa");
            return
        }
        db.collection('menuList',function (err, collection) {
            if(err){
                console.log("bbbbbbbbbbb");
                return
            }
            collection.remove({"onlyId":req.body['onlyId']},function (err, doc) {
                console.log(req.body['onlyId']);
                mongodb.close();
                if(err){
                    console.log("cccccccccc");
                }
                res.send("");
            })

        })
    })
})

//管理员登陆
router.post("/manager",function (req, res) {
    mongodb.open(function (err, db) {
        if(err){
            console.log("aaaaaaaaaaa");
            return
        }
        db.collection('managers',function (err, collection) {
            if(err){
                console.log("bbbbbbbbbbb");
                return
            }
            collection.findOne({"userName":req.body['userName'],"passWord":req.body['passWord']},function (err, doc) {
                console.log(req.body['onlyId']);
                mongodb.close();
                if(err){
                    console.log("cccccccccc");
                }
                res.send(JSON.stringify(doc));
            })

        })
    })
})
// router.post("/productClick",function (req, res) {
//     mongodb.open(function (err, db) {
//         if(err){
//             console.log("aaaaaaaaaaa");
//             return
//         }
//         db.collection('seatsInfo',function (err, collection) {
//             if(err){
//                 console.log("bbbbbbbbbbb");
//                 return
//             }
//             collection.findOne({"performance":req.body['performanceId'],"areaid":req.body['areaId']},function (err, doc) {
//                 console.log(req.body['onlyId']);
//                 mongodb.close();
//                 if(err){
//                     console.log("cccccccccc");
//                 }
//                 res.send(JSON.stringify(doc));
//             })
//
//         })
//     })
// })
module.exports = router;