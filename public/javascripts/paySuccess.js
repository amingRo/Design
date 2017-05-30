/**
 * Created by amingRo on 2016/8/24.
 */
// 倒计时
    var timeLimit = parseInt(15*60*1000);
    var endTime = parseInt(new Date().getTime()+timeLimit);
//支付页面
function orderPayes() {
    var areaSelected = JSON.parse($.session.get("areaSelect"));
    var performance = $.session.get("performanceId");
    var seatSelected = $.session.get("selectedSeatInfo");
    console.log(seatSelected);
    var ticketSelected = "",
        ticketNum = 0;
    $.each(JSON.parse($.session.get("selectedTicketInfo")),function (index, ele) {
        if(index > 0){
            ticketSelected += "、"+ele.ticketName;
        }else {
            ticketSelected = ele.ticketName;
        }
        ticketNum += parseInt(ele.ticketNum);
    });
    var showTime = $.session.get("showTime");
    var userInfo = JSON.parse($.session.get("userInfo"));
    var totalMoney = $.session.get("cTotal");
    $.ajax({
        type:"POST",
        url:"/data/creatMenu",
        data:{
            "performance":performance,
            "ticketName":ticketSelected,
            "showTime":showTime,
            "totalMoney":totalMoney,
            "ticketNum":ticketNum,
            "areaSelectNum":areaSelected.areaid,
            "areaSelectName":areaSelected.areaName,
            "userName":userInfo.userName,
            "personId":userInfo.personId,
            "personContact":userInfo.personContact,
            "seatSelected":seatSelected
        },
        dataType:"json",
        success:function (data) {
            $("#submitBtn").text("已支付成功").css("background","#a09696");
            alert("您已购买成功，订单详情可登陆我的订单查看！");
        },
        error:function (err) {
            alert(err);
            return
        }
    })

}



$(function () {
    //登陆跳转
    $(".myOrder").click(function () {
        window.location.href = "http://localhost:3000/login"
    })
    //倒计时开始
    var timeBegin = setInterval(function () {
         $(".countdown").html((new Date(endTime - new Date().getTime()).toLocaleTimeString()).substr(-5))
    },1000)
    var MillisecondToDate = setTimeout(function () {
        clearInterval(timeBegin)
    },timeLimit)
    //生成门票订单详情列表
    $(function () {
        (function (selectedTicketInfo,showTime,areaSelect,seatSelect) {
            var oFragment = document.createDocumentFragment();
            var seatInit = seatSelect;
            $.each(selectedTicketInfo,function (index, ele) {
                var seat = seatInit.splice(0,parseInt(ele.ticketNum));
                var str = "";
                var length = seat.length;
                for(var i = 0;i<length;i++){
                    str += seat[i].replace("-","排") + "座，";
                }
                str = str.substring(0,str.length-1)
                oFragment.appendChild($("<tr><td>" + showTime +"</td><td>" + ele.ticketName + "</td><td>" + ele.ticketNum + "</td><td class='singlePrice'>" + ele.univalence + "</td><td class='totalPrice'>" + ele.littleTotal + "</td><td>" + areaSelect + "  <span class='seatID'>" + str + "</span></td></tr>")[0])
            })
            $(".packageInfo thead").after($(oFragment));
        })(JSON.parse($.session.get("selectedTicketInfo")),$.session.get("showTime"),JSON.parse($.session.get("areaSelect")).areaName,JSON.parse($.session.get("selectedSeatInfo")))

    })
    //应付金额
    $(".payMoney span").html("￥"+$.session.get("cTotal"));
    $(".amount span").html("￥"+$.session.get("cTotal"));
    //页面打开时滚动特效
    $("html,body").animate({scrollTop:$(".transactionAlerts").offset().top},1000);
    //支付方式选择特效
    $(".method li").click(function (){
        $(this).addClass("methodSelected").siblings().removeClass("methodSelected")
    });
    //银行卡展开
    $(".fastPay").toggle(function () {
        $(this).find(".jianTou").attr("src","images/button_bottom.png").parent().next().show();
        $("html,body").animate({scrollTop:$(".bankList").offset().top},3000);
        $(".method li").click(function (){
            $(this).addClass("methodSelected").siblings().removeClass("methodSelected");
            $(".bankList li").removeClass("methodSelected");
        });
        $(".bankList li").click(function(){
            $(this).addClass("methodSelected").siblings().removeClass("methodSelected");
            $(".method li").removeClass("methodSelected");
        });
    },function () {
        $(this).find(".jianTou").attr("src","images/button_top.png").parent().next().hide();
    });
    $(".method li").click(function (){
        $(this).addClass("methodSelected").siblings().removeClass("methodSelected");
    });
})