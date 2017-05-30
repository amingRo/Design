/**
 * Created by amingRo on 2017/5/21.
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

// //查询分区列表
// function queryAreaList (obj,reservedAreaId) {
//     if ($("#idPerformance").val() == "") {
//         alert("请选择演出时间！");
//         return;
//     }
//     $.session.set("showTime",$("#showTime").val());
//     $.ajax({
//         type  : "POST",
//         // url   : basePath+"/order/choose/getSeatAmountArea", //获取分区列表
//         url:"/data/areaListQuery",
//         data:{
//             "performanceId" : $("#idPerformance").val(), //演出场次
//             // "showTime" : $("#showTime").val() //演出时间
//         },
//         dataType : "json",
//         success : function(data){
//             if(data.status == 'success'){
//                 $.session.set("areaData",JSON.stringify(data));
//                 // $.session.set()
//                 window.location.href = data.address;
//             }else{
//                 alert("区域数据查询失败！");
//                 return;
//             }
//         },
//         error:function(){
//             alert("网络繁忙.");
//         }
//     });
// }
//查询座位逻辑
function chooseSeat () {
    $.ajax({
        type  : "POST",
        url   : "/data/seatQuery",
        data:{
            "performanceId" : $("#playDate").val(),
            "areaId" : $("#lookArea").val()
        },
        dataType : "json",
        success : function(data){
            if (data.status == 'success') {
                getShowSeatList(data.data);
            } else {
                alert("门票查询出错！");
                return;
            }
        },
        error:function(){
            alert("网络繁忙.");
            return;
        }
    });
}
function getShowSeatList (v) {
    $("#pingmu_bian_1").html("");
    $("#pingmu_bian").html("");
    var domm = $("#pingmu_bian_1");
    var dom = $("#pingmu_bian");
    $.each(v,function (index, entry) {
        index++;
        domm.append("<li>"+index+"</li>");
        var liDom=$("<li data-row='"+index+"' style='text-align:center;'></li>");
        $.each(entry["seats"],function(i,item){
            if (item["saled"] == 0) {
                var pDom =$("<p class='kexuan' data-chair='1' seatCode="+item["seatCode"]+" saled="+item["saled"]+"></p>");
            } else if (item["saled"] == 1) {
                var pDom =$("<p class='yishou' data-chair='3' seatCode="+item["seatCode"]+" saled="+item["saled"]+"></p>");
            }else if (item["saled"] == 2) {
                var pDom =$("<p class='yishou2' data-chair='3' seatCode="+item["seatCode"]+" saled="+item["saled"]+"></p>");
            }
            liDom.append(pDom);
        });
        dom.append(liDom);
    })
    $(".yishou2").click(function () {
        // console.log($(this).attr("seatcode"))
        $.ajax({
            url:"/data/productClick",
            type:"post",
            dataType:"json",
            data:{
                "performanceId" : $("#playDate").val(),
                "areaId" : $("#lookArea").val(),
                "seatCode": $(this).attr("seatcode")
            },
            success:function () {
                $(this).css("background","url(../images/kexuan.png) no-repeat;");
                alert("增加产品成功！")
            },
            error:function () {
                alert("增加产品失败！")
            }
        })
    })

}
function delMenu(ele) {
    $.ajax({
        url:"/data/userDelMenu",
        type:"post",
        data:{
            "onlyId":$(ele).attr("data-menuid")
        },
        dataType:"json",
        success:function (data) {
            console.log(data);
            $(ele).parent().parent("tr").remove();
        },
        error:function () {
            alert("网络繁忙，删除订单失败！");
        }
    })
}
//生成订单列表
function CreatMenu(menuInfo) {
    var oFragment = document.createDocumentFragment();
    // var seatInit = seatSelect;
    $.each(menuInfo,function (index, ele) {
        oFragment.appendChild($("<tr><td>" + ele.ticketName +"</td><td>" + ele.showTime + "</td><td>" + ele.totalMoney + "</td><td>" + ele.ticketNum + "</td><td>"+ele.personContact+"</td><td><button data-performance="+ ele.performance+" data-areaId="+ ele.areaSelectNum +" data-menuId="+ ele.onlyId +" onclick='delMenu(this)'>删除订单</button></td></tr>")[0])
    })
    $(".findSelf thead").after($(oFragment));
}
$(function () {
    //初始化查票
    // queryPerformanceDate($("#selectDate").val())
    //首页日期
    var date = new Date();
    var days;
    switch (date.getDay()){
        case 0:
            days = "星期日";
            break;
        case 1:
            days = "星期一";
            break;
        case 2:
            days = "星期二";
            break;
        case 3:
            days = "星期三";
            break;
        case 4:
            days = "星期四";
            break;
        case 5:
            days = "星期五";
            break;
        case 6:
            days = "星期六";
            break;
    }
    $("#nowDate").text(date.toLocaleDateString().replace("-","年").replace("-","月")+"日  "+days)
    //选项卡切换
    $(".menuList>li").click(function () {
        $(".content>div").eq($(this).index()).css("display","block").siblings().css("display","none");
    })

//首页登陆
    $("#loginIn").click(function () {
        $.ajax({
            url:"/data/manager",
            type:"POST",
            data:{
                "userName":$(".userName").val(),
                "passWord":$(".password").val()
            },
            dataType:"json",
            success:function (data) {
                if(data == null){
                    alert("无此用户或密码错误！")
                }else if(data.status == "success"){
                    window.location.href = "http://localhost:3000/manager/"+data.url+data.userName
                }
            },
            error:function () {
              alert("网络连接错误！")
            }
        })
    })
    //后台查询数据
    $("#lookArea").change(function () {
        $("#pingmu_bian_1").html("");
        $("#pingmu_bian").html("");
        chooseSeat ()

    })
    $("#chaDing").click(function () {
        $.ajax({
            url:"/data/allList",
            data:{},
            dataType:"json",
            type:"post",
            success:function (dataa) {
                console.log(dataa[0].success)
                if(dataa[0].success == "success"){
                    CreatMenu(dataa)
                }else {
                    alert("数据查询出错！")
                }
            },
            error:function () {
                alert("订单查询ajax出错！");
            }
        })
    })



})
