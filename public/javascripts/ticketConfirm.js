/**
 * Created by amingRo on 2017/4/1.
 */
$(function(){
    //登陆跳转
    $(".myOrder").click(function () {
        window.location.href = "http://localhost:3000/login"
    })

    $(".payMoney span").html("￥"+$.session.get("cTotal"));
    $("html,body").animate({scrollTop:$(".packageInfo").offset().top},1000);
});

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
//获取验证码时的身份信息校验
function sendValidatesMsg() {
    if($.trim($("#personName").val())==""){
        alert("取票人姓名不能为空！");
        return;
    }
    if($.trim($("#personId").val())!=""&&!IdCardValidate($("#personId").val())){
        alert("请输入合法的身份证号！");
        return;
    }
    var reEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var contant = $("#personContact").val();
    var flg = false;
    if(reEmail.test(contant)){
        flg = true;
    }
    if(myreg.test(contant)){
        flg = true;
    }
    if (!flg) {
        alert("请输入正确的联系方式！");
        return;
    }
    if($.trim($("#validCheckCode").val())==""){
        alert("请先输入图片校验码！");
        return;
    }
    // $("#ui_alert_aa").css("display","table");
    $.ajax({
        url: "/verify/getVerifyCode",
        // 数据发送方式
        type: "post",
        // 接受数据格式
        dataType : "json",
        data: {
            "contact":contant,
            "validCheckCode":$.trim($("#validCheckCode").val())
        },
        // 要传递的数据
        // 回调函数，接受服务器端返回给客户端的值，即result值
        success : validateMsg,
        error: showError
    });
}
function validateMsg(data) {
    if(data.status=="success"){
        var seconds = 60;
        auto=setInterval(function(){
            seconds--;
            $("#codeMsg").html("发送成功，"+seconds+"秒后可重发");
            $("#validCodeBtn").attr("disabled","disabled").css({"background":"gray"});
            if(seconds ==0){
                tempValidCode="";
                $("#codeMsg").html("");
                $("#validCodeBtn").removeAttr("disabled").css({"background":"#FCAF02"});
                clearInterval(auto);
            }
        },1000);

    } else {
        $("#checkValidCode").attr("src","/valid/getCaptcha.do?date="+new Date().getTime());
        alert(data.info);
        return;
    }

}

var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子
var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];            // 身份证验证位值.10代表X
function IdCardValidate(idCard) {
    idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格
    if (idCard.length == 15) {
        return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证
    } else if (idCard.length == 18) {
        var a_idCard = idCard.split("");                // 得到身份证数组
        if(isValidityBrithBy18IdCard(idCard)&&isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证
            return true;
        }else {
            return false;
        }
    } else {
        return false;
    }
}
function isTrueValidateCodeBy18IdCard(a_idCard) {
    var sum = 0;                             // 声明加权求和变量
    if (a_idCard[17].toLowerCase() == 'x') {
        a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作
    }
    for ( var i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i];            // 加权求和
    }
    var valCodePosition = sum % 11;                // 得到验证码所位置
    if (a_idCard[17] == ValideCode[valCodePosition]) {
        return true;
    } else {
        return false;
    }
}
function isValidityBrithBy18IdCard(idCard18){
    var year =  idCard18.substring(6,10);
    var month = idCard18.substring(10,12);
    var day = idCard18.substring(12,14);
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题
    if(temp_date.getFullYear()!=parseFloat(year)
        ||temp_date.getMonth()!=parseFloat(month)-1
        ||temp_date.getDate()!=parseFloat(day)){
        return false;
    }else{
        return true;
    }
}
function isValidityBrithBy15IdCard(idCard15){
    var year =  idCard15.substring(6,8);
    var month = idCard15.substring(8,10);
    var day = idCard15.substring(10,12);
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
    if(temp_date.getYear()!=parseFloat(year)
        ||temp_date.getMonth()!=parseFloat(month)-1
        ||temp_date.getDate()!=parseFloat(day)){
        return false;
    }else{
        return true;
    }
}
//去掉字符串头尾空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}


//验证码倒计时
var auto ;


function confirmToOrderCommit(obj) {
    if($.trim($("#personName").val())==""){
        alert("取票人姓名不能为空！");
        return;
    }
    if($.trim($("#personId").val())!=""&&!IdCardValidate($("#personId").val())){
        alert("请输入合法的身份证号！");
        return;
    }

    var reEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var contant = $("#personContact").val();
    var flg = false;
    if(reEmail.test(contant)){
        flg = true;
    }
    if(myreg.test(contant)){
        flg = true;
    }
    if (!flg) {
        alert("请输入正确的联系方式！");
        return;
    }

    if ($.trim($("#personCode").val())=="") {
        alert("请输入验证码！");
        return;
    }
    // $("#ui_alert_aa").css("display","table");
    // $("#totalPrice").val($('#totalMoney').html());
    $("#personId").val($.trim($("#personId").val()));
    window.location.href = "paySuccess.html";


    // clearOnClick(obj);
    $.ajax({
        type:"POST",
        url: "/data/ticket/order/createOrder",
        // 数据发送方式
        data: $("#orderForm").serialize(),
        // 接受数据格式
        dataType : "json",
        // 要传递的数据
        // 回调函数，接受服务器端返回给客户端的值，即result值
        success : function(data) {
            if(data.success=="true"){
                // window.location.href = data.address+"&isShow=1";
            } else {
                $("#codeMsg").html("");
                $("#validCodeBtn").removeAttr("disabled").css({"background":"#FCAF02"});
                clearInterval(auto);
                alert("data.message");
                if(data.code=="1"){
                    $('#popup_ok').click(function(){
                        if(data.code=="1"){
                            location.href=basePath+"/indexBanNa";
                        }
                    });
                }
            }
        },
        error: showError
    });
}

function showError () {
    // $("#ui_alert_aa").css("display","none");
    alert("网络繁忙");
}