/**
 * Created by amingRo on 2017/2/15.
 */

//对Date对象定义的原型函数
Date.prototype.format = function(format)
{
    var o =
        {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(),    //day
            "h+" : this.getHours(),   //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
            "S" : this.getMilliseconds() //millisecond
        };
    if(/(y+)/.test(format))
        format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}


$(function () {
    queryPerformanceDate($("#selectDate").val())
})
var calanderObj ;
function showPerformanceDate(obj) {
    calanderObj = document.getElementById("selectDate");
    $.ajax({
        url: "/data/showPerformanceDate",
        // 数据发送方式
        type: "post",
        data: {
            "currentDate": $("#selectDate").val()
        },
        // 接受数据格式
        dataType : "json",
        // 要传递的数据
        // 回调函数，接受服务器端返回给客户端的值，即result值
        success : showSubCalander ,
        error:function (a) {
            console.log("日历查询失败！");
            console.log(a.readyState);
        }
    });

}

function showSubCalander (data) {
    console.dir(data);
    var year = data.currentYear;
    var month = data.currentMonth;
    var currentDate = new Date(year, month-1, 1);
    var _currentTime = new Date().getTime();
    var _d = new Date(_currentTime);
    // console.log(_d);
    $("#showCalander").find("span").html(year + "年" + month + "月");
    var calendarHead = $("#showCalander").find("ul[id='calendarHead']");
    var calendar = $("#showCalander").find("ul[id='calendar']");
    calendarHead.html("");
    calendar.html("");
    calendarHead.append("<li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li>");
    $.each(data.data, function(i, itemCal) {

        var dayStr = "";
        if (itemCal.date != undefined && itemCal.date != '') {
            var currentDate = new Date(itemCal.date);
            dayStr = currentDate.getDate();

            if(itemCal.performances.length>0){
                var pdate = "";
                $.each(itemCal.performances, function(index, it) {
                    if (pdate == "") {
                        pdate = pdate + it.startTime.split(" ")[0];
                        console.log(it.startTime.split(" ")[0]);
                    }
                });
                var content ="";
                if (currentDate < new Date(_d.format("yyyy-MM-dd").replace("-", "/").replace("-", "/"))) {
                    content = "<li class='day_befor'>"+dayStr+"</li>";
                } else {
                    content = "<li class='show' onclick='queryPerformanceDate(\"" + pdate + "\")'>"+dayStr + "</li>";
                }
                calendar.append(content);
            } else {
                calendar.append("<li class='day_befor'>"+dayStr+"</li>");
            }
            calendar.append("</div>")
        } else {
            calendar.append("<li class='day_befor'>"+dayStr+"</li>");
            calendar.append("</div>");

        }
    });

    $("#showCalander").show();
}


// 改变月份
function changeCalander(obj) {
    // var tr = document.getElementById("calanderSpan");
    var _date = new Date($("#currentDate").val());
    console.log(_date.format("yyyy-MM-dd"));
    var currentMonthDate;
    if (obj.id == "next") {
        currentMonthDate=addMonth(_date,1);
    } else if (obj.id == "pre") {
        currentMonthDate=subMonth(_date,1);
    }
    console.log(currentMonthDate.format("yyyy-MM-dd"));
    $.ajax({
        url: "/data/subcalandar/data/index",
        // 数据发送方式
        type: "post",
        // 接受数据格式
        dataType : "json",
        data: {
            "idCompany":$("#idCompany").val(),
            "currentDate":currentMonthDate.format("yyyy-MM-dd")
        },
        // 要传递的数据
        // 回调函数，接受服务器端返回给客户端的值，即result值
        success : showSubCalander ,
        error: function (a) {
            console.log("changeCalander err!");
            alert(a.readyState);
        }
    });

}
function addMonth(d,num){
    var a = new Date(d);
    a.setDate("01");
    var m = a.getMonth()+num;
    var year=a.getFullYear();
    if(m >11){
        a.setFullYear(year+1);
        a.setMonth(0);
    }else if(m <1){
        a.setFullYear()(year-1);
        a.setMonth(11);
    }else{
        a.setMonth(m);
        a.setYear(year);
    }
    a.setDate("01");
    return a;
}
function subMonth(d,num){
    var a = new Date(d);
    a.setDate("01");
    var m = a.getMonth()-num;
    var year=a.getFullYear();
    if(m >= 0){
        a.setMonth(m);
        a.setFullYear(year);
    }else{
        a.setFullYear(year-1);
        a.setMonth(11);
    }
    a.setDate("01");
    return a;
}



//查询场次信息
function queryPerformanceDate(showDate){
    $("#showTime").val("");
    $("#idPerformance").val("");
    $(".timee").html("");
    $("#showCalander").css("display","none");
    $.ajax({
        type: "post",
        // url : basePath+"/ticket/getPerformances?showDate="+showDate,   showDate是当前日期
        url: "/data/process_get",
        dataType : "json",
        success:function(cmd){
            if(cmd.success=="false"){
                // $("#idPerformance").val("");隐藏域
                alert(cmd.message);
                return;
            } else if(cmd.success=="true"){
                var j = 0;
                $(".timee").html("");
                // $("#idPerformance").val("");隐藏域
                var _html="";
                $(cmd.performanceList).each(function(i,item){
                    if(item["startDate"] == showDate){
                        var _performanceId = item["performanceId"];
                        var _showDate = item["startTime"].substring(0, 10);
                        var _performanceName = item["startTime"].substring(11, 16);
                        var _style = "";
                        if (j++ == 0) {
                            _style = " class='timeSelected' ";
                            $("#idPerformance").val(_performanceId);
                            $("#showTime").val(item["startTime"]);
                            $("#selectDate").val(_showDate);
                        }
                        _html+="<cite "+_style+" data-showTime=\""+item["startTime"]+"\" onclick=\"setPerformanceId('"+_performanceId+"',this)\">"+_performanceName+"</cite>";
                    }
                });
                $(".timee").html(_html);
            } else{
                alert("网络繁忙.");
                return;
            }
        },
        error : function (a) {
            alert("页面初始化失败！");
            alert(a.readyState);
        }
    });
}
//场次查询
function setPerformanceId(perId,obj){
    if ($("#idPerformance").val() == perId){
        return;
    }
    $("#idPerformance").val(perId);//设置选中的场次
    $("#showTime").val($(obj).attr("data-showTime"));
    //演出时间按钮选择效果
    $(obj).addClass("timeSelected").siblings().removeClass("timeSelected");
}

//查询分区列表
function queryAreaList (obj,reservedAreaId) {
    if ($("#idPerformance").val() == "") {
        alert("请选择演出时间！");
        return;
    }
    $.session.set("showTime",$("#showTime").val());
    $.ajax({
        type  : "POST",
        // url   : basePath+"/order/choose/getSeatAmountArea", //获取分区列表
        url:"/data/areaListQuery",
        data:{
            "performanceId" : $("#idPerformance").val(), //演出场次
            // "showTime" : $("#showTime").val() //演出时间
        },
        dataType : "json",
        success : function(data){
            if(data.status == 'success'){
                $.session.set("areaData",JSON.stringify(data));
                // $.session.set()
                window.location.href = data.address;
            }else{
                alert("区域数据查询失败！");
                return;
            }
        },
        error:function(){
            alert("网络繁忙.");
        }
    });
}