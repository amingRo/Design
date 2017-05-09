var express = require('express');
var app = express();
var bodyParser = require("body-parser");

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({extended:false})

//首页选项卡数据
app.post('/process_get',urlencodedParser,function (req, res) {
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

module.exports = router;