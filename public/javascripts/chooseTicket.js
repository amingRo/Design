/**
 * Created by amingRo on 2017/3/2.
 */
//购买的最大票种票数
var allMaxValue = 9;
//右上门票详情逻辑
function fn_getTotal(){
    var cTotal=0,cCount=0,curDom= $("#ticketSelected");
    curDom.empty();
    $.each($(".showNumber"),function(index,entry){
        var curNum=$(entry).attr("value"),curPrice=$(entry).attr("data-price"),curName=$(entry).attr("data-name");
        if(curNum>0){
            cTotal+=(parseInt(curNum)*parseFloat(curPrice));
            cCount+=parseInt(curNum);
            curDom.append("<p class='detailed'><span class='sTicketName'>"+curName+"</span><span class='justFontStyle'> x "+curNum+"</span><span class='price'><span class='univalence'>￥"+curPrice+"</span> / 张</span> </p>");
        }
    });
    $("#allPrice").html("￥"+cTotal.toFixed(2));
    $(".payMoney span").html("￥"+cTotal.toFixed(2));
    $.session.set("cTotal",cTotal);
    return {count:cCount}
}
//查询座位逻辑
function chooseSeat () {
    $.ajax({
        type  : "POST",
        url   : "/data/seatQuery",
        data:{
            "performanceId" : JSON.parse($.session.get("areaData")).areaInfo[0].performanceId,
            "areaId" : JSON.parse($.session.get("areaSelect")).areaid
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
    $.each(v,function(index,entry){
        index++;
        domm.append("<li>"+index+"</li>");
        var liDom=$("<li data-row='"+index+"' style='text-align:center;'></li>");
        $.each(entry["seats"],function(i,item){
            if (item["saled"] == 0) {
                var pDom =$("<p class='kexuan' data-chair='1' seatCode="+item["seatCode"]+" saled="+item["saled"]+"></p>");
            } else if (item["saled"] == 1) {
                var pDom =$("<p class='yishou' data-chair='3' seatCode="+item["seatCode"]+" saled="+item["saled"]+"></p>");
            }else if (item["saled"] == 2) {
                var pDom =$("<p class='yishou' data-chair='3' seatCode="+item["seatCode"]+" saled="+item["saled"]+"></p>");
            }
            liDom.append(pDom);
        });
        dom.append(liDom);
    });
}

$(function () {
    //登陆跳转
    $(".myOrder").click(function () {
        window.location.href = "http://localhost:3000/login"
    })

    //刷新右上角信息
    $(".time:first").text($.session.get("showTime"));
    $(".time:last").text(JSON.parse($.session.get("areaSelect")).areaName);
    //生成门票
    (function (ticketInfo) {
        //创建文档碎片
        var oFragment = document.createDocumentFragment();
        // alert(ticketInfo.length);
        $.each(ticketInfo,function (index, ele) {
            var className = "",tp = "",gq = "";
            if(index%2 === 0){
                className = "even";
            }else {
                className = "odd";
            }
            if(ele.refundable){
                tp = "不可退票"
            }else {
                tp = "限时可退"
            }
            if(ele.changeDate){
                gq = "不可改期"
            }else {
                gq = "限时可改"
            }
            oFragment.appendChild($('<div class="selectTicket"><div class="ticketKind '+ className +'"><span>'+ ele.ticketName +'</span><span class="taoPiaoPrice">￥'+ ele.ticketPrice +'</span></div><div class="necessaryInfo"><p class="necessaryInfo1"><span class="info1">成人及1.1米以上儿童成人及1.1米以上儿童成人及1.1米以上儿童成人及1.1米以上儿童成人及1.1米以上儿童</span></p><p class="necessaryInfo2">指定日期一日单次入园有效</p></div><div class="bottomInfo"><span class="keTui">'+ tp +'</span><span class="gaiQi">'+ gq +'</span><span class="ticketNumber">购买张数</span><span class="del"></span><input class="showNumber" value="0" type="text" data-price="'+ ele.ticketPrice +'" data-name="'+ ele.ticketName +'" readonly><span class="add"></span></div></div>')[0])
        })
        $("#nextIsTicket").after($(oFragment));

    })(JSON.parse($.session.get("ticketInfo")))
    //页面加载特效
    $("html,body").animate({scrollTop: $(".justText").offset().top}, 1000);

    //每种门票增加
    $(".add").click(function () {
        //检测所有已选票数
        var buyTicket = 0;
        // //检测该种票的首次增加的增加基数
        // var base = parseInt($(this).prev().attr("minValue"));
        // 该票种的最大购买数
        // var everyMaxValue = parseInt($(this).prev().attr("maxValue"));
        var count = parseInt($(this).prev().val());
        for (var i = 0; i < $(".showNumber").length; i++) {
            buyTicket += parseInt($(".showNumber")[i].value);
        }

            if (buyTicket == allMaxValue) {
                alert("您最多可以购买9张票！");
                return;
            } else {
            //如果当前票数小于限制的最大票数
            $(this).prev().attr("value", ++count);
        }
        fn_getTotal();
    })
//每种门票减少
    ;  $(".del").click(function () {
        var count = parseInt($(this).next().val());
        if (count > 0) {
            $(this).next().attr("value", --count);
        } else {
            return
        }
        fn_getTotal()
    });

    // 右下角图片高亮逻辑
    $(".littleArea" + JSON.parse($.session.get("areaSelect")).areaid).removeClass("opacity");
    //右下侧选区图弹出特效相关逻辑
    $("#preView").click(function () {
        $(".area"+$.session.get("areaSelect")).removeClass("opacity");
        if($(".showArea").css("top") == "-1200px"){
            $(".showArea").animate({top:"-70px"});
        }else {
            $(".showArea").animate({top:"-1200px"});
        }
    })

    $(".showArea").click(function () {
        if($(".showArea").css("top") == "-1200px"){
            $(".showArea").animate({top:"-70px"});
        }else {
            $(".showArea").animate({top:"-1200px"});
        }
    })

//选座按钮等特效控制
    $("#selectSeat").toggle(function () {
        var num = fn_getTotal().count;
        if (num == 0) {
            alert("您还未选择门票");
            return
        }
        chooseSeat();
        $(this).text("重新选票");
        $("#chooseTicket").slideUp(500);
        $("#chooseSeat").slideDown(500);
        // $("#confirmSeat").show();
        $("#selectedNum").html(num);
    },function () {
        $("#pingmu_bian_1").html("");
        $("#pingmu_bian").html("");
        $(".selectedSeats .Seat").attr("class","noSeat").html("未选座位").attr({"tsversion":"","areaid":"","sceneseatid":"","title":""});
        $(this).text("去选座");
        $("#chooseTicket").slideDown(500);
        $("#chooseSeat").slideUp(500);
        $("#confirmSeat").hide();
    });

})
function setSelectedSeatsList(areaId,seatcode){
    $(".selectedSeats .noSeat").eq(0).removeClass("noSeat").addClass("Seat").html(seatcode.split("-")[0]+"排"+seatcode.split("-")[1]+"座").attr({"areaid":areaId,"seatcode":seatcode});
}
//选座逻辑
$(function(){
    var _singleSeatExp1 = /1_0_|_0_1|^_0_|_0_$/;//有1个选中座位
    //匹配1_0或者_0_1或者以_0_开头，或者以_0_结尾
    var _multiSeatExp1  = /^[^0]*0+(1*0+)+[^0]*$/;//有多个选中座位,只能挨着选
    //匹配匹配以非0开始，重复出现0此活多次0，或者重复出现一次或多次
    $(document).on("click.aa",".Seat,.kexuan,.yixuan",function(event){
        if ($(this).hasClass("kexuan") || $(this).hasClass("yixuan")) {
            var numB2C = $("#selectedNum").html();
            //实现效果与限制的开始
            var seatcode = $(this).attr("seatcode");
            var areaId = $.session.get("areaSelect");
            var nubel = $(".Seat").length; //已选座位数
            if(nubel == numB2C){//表示当前已选座位=应选座位
                if(!$(this).hasClass("yixuan")){//表示超额选座
                    var aa = "您选择购买"+numB2C+"张门票，因此只能选择"+numB2C+"个座位！";
                    alert(aa);
                    return;
                }
            }
            var isSelecting = true;//默认选中座位
            if($(this).hasClass("yixuan")){//表示当前座位是选中状态,  需要取消
                isSelecting = false;
            }
            if (nubel >= numB2C) {//如果已选座位数等于应选座位数
                if(isSelecting){
                    var aa = "您选择购买"+numB2C+"张门票，因此只能选择"+numB2C+"个座位！";
                    alert(aa);
                    return;
                }
            }
            var indexSelecting = $(this).parent().children().index($(this));//取出当前选择座位下标
            var _seatStr= "";//生成预选坐字符串
            $(this).parent().children().each(function(index){
                if(index == indexSelecting){//表示已循环到当前座位
                    if(isSelecting){
                        _seatStr+="0";//选中
                    }else{
                        _seatStr+="_";//取消
                    }
                }else{
                    if($(this).hasClass("yishou")){
                        _seatStr+="1";//已售
                    }else if($(this).hasClass("yixuan")){
                        _seatStr+="0";//本次选座选中
                    }else{
                        _seatStr+="_";//未选中的座位
                    }
                }
            });
            if(_seatStr.length>=3){  //本行有1 - 2个座位,不限制
                if(_seatStr.indexOf("0")!=-1){//本行本次有选择的座位
                    if(/^[^0]*0{1}[^0]*$/.test(_seatStr)){//本行有1个选中座位, 表示在操作前,本行没有选中座位,或者有2个选中座位
                        if(_singleSeatExp1.test(_seatStr)){
                            var msg = "请不要留下单个座位！";
                            alert(msg);
                            return;
                        }
                    }else{//本行有多个选中座位
                        if(!_multiSeatExp1.test(_seatStr)){
                            var msg = "同一排只能选择连续座位！";
                            alert(msg);
                            return;
                        }
                    }

                }else{//本行本次没有选择的座位,表示本次操作是取消掉本行最后一个选中座位,不处理
                }
            }
            if(isSelecting){//执行选座
                $(this).removeClass("kexuan").addClass("yixuan").attr("data-chair","2");
                setSelectedSeatsList(areaId,seatcode);
            }else{//执行取消
                $(this).removeClass("yixuan").addClass("kexuan").attr("data-chair","1");
                var ee = seatcode.split("-")[0] + "排" + seatcode.split("-")[1] + "座";
                $(".selectedSeats .Seat").each(function(index) {
                    if($(".selectedSeats .Seat").eq(index).html() == ee) {
                        $(".selectedSeats .Seat").eq(index).attr("class","noSeat").html("未选座位").attr({"areaid":"","seatcode":""});;
                    };
                });
            }
            $("#confirmSeat").show();
            var nubel = numB2C - $(".Seat").length;
            var neinu = "您还需选择"+nubel+"个座位";
            if (nubel == 0) {
                $("#confirmSeat").html("确认选座").addClass("ochox_b").removeClass("ochox_c").attr("disabled",false);
            } else{
                $("#confirmSeat").html(neinu).addClass("ochox_c").removeClass("ochox_b").attr("disabled",true);
            }
        }
        if ($(this).hasClass("Seat")){
            var _seatcode = $(this).attr("seatcode");
            var _thisSeat = $("#pingmu_bian p[seatcode='"+_seatcode+"']");
            var indexSelecting = _thisSeat.parent().children().index(_thisSeat);//取出当前选择座位下标
            var _seatStr= "";//生成预选坐字符串
            _thisSeat.parent().children().each(function(index){
                if(index == indexSelecting){//表示已循环到当前座位
                    _seatStr+="_";//取消
                }else{
                    if($(this).hasClass("yishou")){
                        _seatStr+="1";//早已选中
                    }else if($(this).hasClass("yixuan")){
                        _seatStr+="0";//本次选座选中
                    }else{
                        _seatStr+="_";//未选中的座位
                    }
                }
            });
            if(_seatStr.length>=3){  //本行有1 - 2个座位,不限制
                //console.log(_seatStr);
                if(_seatStr.indexOf("0")!=-1){//本行本次有选择的座位
                    if(/^[^0]*0{1}[^0]*$/.test(_seatStr)){//本行有1个选中座位, 表示在操作前,本行没有选中座位,或者有2个选中座位
                        if(_singleSeatExp1.test(_seatStr)){
                            var msg = "请不要留下单个座位！";
                            alert(msg)
                            return;
                        }
                    }else{//本行有多个选中座位
                        if(!_multiSeatExp1.test(_seatStr)){  // && /^0{2,}/.test(_seatStr) /^[^0]*0+(1*0+)+[^0]*$/;
                            console.log(_seatStr);
                            var msg = "请不要留下单个座位！";
                            alert(msg);
                            return;
                        }
                    }
                }else{//本行本次没有选择的座位,表示本次操作是取消掉本行最后一个选中座位,不处理
                }
            }
            $("#pingmu_bian p[seatcode='"+_seatcode+"']").addClass("kexuan").removeClass("yixuan");
            $(this).attr("class","noSeat").html("未选座位").attr({"areaid":"","seatcode":""});
            var nubel = $("#selectedNum").html() - $(".Seat").length;
            var neinu = "您还需选择"+nubel+"个座位";
            if (nubel == 0) {
                $("#confirmSeat").html("确认选座").addClass("ochox_b").removeClass("ochox_c").attr("disabled",false);
            } else{
                $("#confirmSeat").html(neinu).addClass("ochox_c").removeClass("ochox_b").attr("disabled",true);
            }
        }
    })
})

//确认选座按钮
function submit (obj) {
    var seats = []; //已选座位信息集合
    var seatList = []; //座位
    $(".detailed").each(function(){
        var ticketName = $(this).children(".sTicketName").text();
        var ticketNum = $(this).children(".justFontStyle").text().substr(3,1);
        var univalence = $(this).find(".univalence").text();
        var littleTotal = "￥" + parseInt(univalence.substring(1)) * parseInt(ticketNum);
        seats.push({"ticketName" : ticketName , "ticketNum" : ticketNum , "univalence" : univalence,"littleTotal":littleTotal });
    });
    $(".yixuan").each(function () {
        seatList.push($(this).attr("seatcode"))
    })
    $.session.set("selectedTicketInfo",JSON.stringify(seats));
    $.session.set("selectedSeatInfo",JSON.stringify(seatList));
    window.location.href = "confirmPackage";
    // $("#seats").val(encodeURI(JSON.stringify(seats)));
    // console.log($("#seats").val(encodeURI(JSON.stringify(seats))))
    // $.ajax({
    //     type: "post",
    //     url : "/ticketConfirm",
    //     data :$("#ticketForm").serialize(),
    //     dataType : "json",
    //     success:function(cmd){
    //         if(cmd.status=="fail"){
    //             alert("操作失败！");
    //         } else if(cmd.status=="success"){
    //             window.location.href = cmd.address;
    //         } else{
    //             alert("网络繁忙.");
    //             return;
    //         }
    //     },
    //     error : function (){
    //         alert("网络繁忙.");
    //         return;
    //     }
    // });
}