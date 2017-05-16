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
    // console.log("eeeeeeeeeeeeeeee");
    response = {
        success : "true",
        message : "调试成功",
        performanceList : [{
            performanceId:"1993",
            startTime:"2017-07-27 18:30",
        },{
            performanceId:"1994",
            startTime:"2017-07-27 20:00"
        }]
    }
    res.send(JSON.stringify(response));
})
//日历数据
router.post('/showPerformanceDate',function (req, res) {
    mongodb.open(function (err, product) {
        if(err){
            console.log("aaaaaaaaaaa");
            return
        }
        product.collection('playDate' +
            '',function (err, collection) {
            if(err){
                console.log("bbbbbbbbbbb");
                return
            }
            collection.findOne({"_id": "591ac91810fae122fc607ede"},function (err, doc) {
                mongodb.close();
                if(err){
                    console.log("cccccccccc");
                }
                console.log(doc);
                console.log("eeee");
                res.send(JSON.stringify(doc));
            })

        })
    })
    // response =
    // res.send(JSON.stringify(response));
})
//抛回场次查询数据
router.post('/areaListQuery',function (req, res) {
    response = {
        status:"success",
        address:"chooseArea",
        areaInfo:[
            {
                "performanceId": "20814",
                "smallAreaId": "13"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "7"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "5"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "6"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "14"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "12"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "10"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "9"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "4"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "3"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "11"
            },
            {
                "performanceId": "20814",
                "smallAreaId": "1"
            }
        ]
    };
    res.send(JSON.stringify(response));
})
//门票查询数据
router.post('/ticketQuery',function (req, res) {
    response = {
        status:"success",
        address:"/chooseTicket",
        ticketInfo:[
            {
                ticketName:"家庭套票",
                ticketPrice:"100",
                refundable:1,
                changeDate:0
            },
            {
                ticketName:"周末单人票",
                ticketPrice:"200",
                refundable:1,
                changeDate:1
            },
            {
                ticketName:"周末双人票",
                ticketPrice:"300",
                refundable:0,
                changeDate:0
            },{
                ticketName:"周末三人票",
                ticketPrice:"400",
                refundable:0,
                changeDate:1
            }
        ]
    }
    res.send(JSON.stringify(response));
})
//座位查询
router.post("/seatQuery",function (req, res) {
    response = {
        status:"success",
        data:[
            {
                "areaid": 0,
                "seatYRow": 2,
                "seatname": "",
                "seats": [
                    {
                        "saled": 1,
                        "seatCode": "1-116"
                    },
                    {
                        "saled": 1,
                        "seatCode": "1-115"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-114"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-113"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-112"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-111"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-110"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-109"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-108"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-107"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-106"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-105"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-104"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-103"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-102"
                    },
                    {
                        "saled": 0,
                        "seatCode": "1-101"
                    }
                ]
            },
            {
                "areaid": 0,
                "seatYRow": 3,
                "seatname": "",
                "seats": [
                    {
                        "saled": 1,
                        "seatCode": "2-119"
                    },
                    {
                        "saled": 1,
                        "seatCode": "2-118"
                    },
                    {
                        "saled": 1,
                        "seatCode": "2-117"
                    },
                    {
                        "saled": 1,
                        "seatCode": "2-116"
                    },
                    {
                        "saled": 1,
                        "seatCode": "2-115"
                    },
                    {
                        "saled": 1,
                        "seatCode": "2-114"
                    },
                    {
                        "saled": 1,
                        "seatCode": "2-113"
                    },
                    {
                        "saled": 1,
                        "seatCode": "2-112"
                    },
                    {
                        "saled": 0,
                        "seatCode": "2-111"
                    },
                    {
                        "saled": 0,
                        "seatCode": "2-110"
                    },
                    {
                        "saled": 0,
                        "seatCode": "2-109"
                    },
                    {
                        "saled": 0,
                        "seatCode": "2-108"
                    },
                    {
                        "saled": 0,
                        "seatCode": "2-107"
                    },
                    {
                        "saled": 0,
                        "seatCode": "2-106"
                    },
                    {
                        "saled": 0,
                        "seatCode": "2-105"
                    },
                    {
                        "saled": 0,
                        "seatCode": "2-104"
                    },
                    {
                        "saled": 0,
                        "seatCode": "2-103"
                    },
                    {
                        "saled": 1,
                        "seatCode": "2-102"
                    },
                    {
                        "saled": 1,
                        "seatCode": "2-101"
                    }
                ]
            },
            {
                "areaid": 0,
                "seatYRow": 4,
                "seatname": "",
                "seats": [
                    {
                        "saled": 2,
                        "seatCode": "3-120"
                    },
                    {
                        "saled": 2,
                        "seatCode": "3-119"
                    },
                    {
                        "saled": 2,
                        "seatCode": "3-118"
                    },
                    {
                        "saled": 1,
                        "seatCode": "3-117"
                    },
                    {
                        "saled": 1,
                        "seatCode": "3-116"
                    },
                    {
                        "saled": 1,
                        "seatCode": "3-115"
                    },
                    {
                        "saled": 1,
                        "seatCode": "3-114"
                    },
                    {
                        "saled": 1,
                        "seatCode": "3-113"
                    },
                    {
                        "saled": 1,
                        "seatCode": "3-112"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-111"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-110",
                    },
                    {
                        "saled": 0,
                        "seatCodeStr": "3排109号"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-108"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-107"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-106"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-105"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-104"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-103"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-102"
                    },
                    {
                        "saled": 0,
                        "seatCode": "3-101"
                    }
                ]
            },
            {
                "areaid": 0,
                "seatYRow": 5,
                "seatname": "",
                "seats": [
                    {
                        "saled": 1,
                        "seatCode": "4-121"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-120"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-119"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-118"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-117"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-116"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-115"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-114"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-113"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-112"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-111"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-110"
                    },
                    {
                        "saled": 1,
                        "seatCode": "4-109"
                    },
                    {
                        "saled": 0,
                        "seatCode": "4-108"
                    },
                    {
                        "saled": 0,
                        "seatCode": "4-107"
                    },
                    {
                        "saled": 0,
                        "seatCode": "4-106"
                    },
                    {
                        "saled": 0,
                        "seatCode": "4-105"
                    },
                    {
                        "saled": 0,
                        "seatCode": "4-104"
                    },
                    {
                        "saled": 2,
                        "seatCode": "4-103"
                    },
                    {
                        "saled": 2,
                        "seatCode": "4-102"
                    },
                    {
                        "saled": 2,
                        "seatCode": "4-101"
                    }
                ]
            }
    ]
}
res.send(JSON.stringify(response));
})


module.exports = router;