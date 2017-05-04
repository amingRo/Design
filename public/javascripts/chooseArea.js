$(function () {
    $.each(JSON.parse($.session.get("areaData")).areaInfo,function(i,item){
        $(".area"+item.smallAreaId).attr({"performanceId":item.performanceId,"areaId":item.smallAreaId,"class":"area"+item.smallAreaId+" yes"+item.smallAreaId});
    });

    //区域动画特效
    $("ul.img li:not('.no')").hover(
        function(){
            $(this).animate({"margin-top":"-4px"}).addClass("hover").siblings().stop(true,true).removeClass("hover").animate({"margin-top":"0px"});
        },
        function(){
            $(this).stop(true,true).animate({"margin-top":"0px"}).removeClass("hover");
        }
    );
    //页面动画特效
    $("html,body").animate({scrollTop:$(".area").offset().top},1000);
    //右上角时间显示
    $(".time").text($.session.get("showTime"));
    //点击分区进行查票
    $("ul.img li:not('.no')").click(function(){
        $.session.set("areaSelect",JSON.stringify({areaid:$(this).attr("areaid"),areaName:$(this).attr("data-areaname")}));
        $.ajax({
            type: "post",
            url: "/ticketQuery",
            data: {
                performanceId: $(this).attr("performanceId"),
                areaId: $(this).attr("areaId"),
                areaName: $(this).attr("data-areaname")
            },
            dataType: "json",
            success: function (data) {
                if(data.status == "success"){
                    // window.sessionStorage.clear();
                    $.session.set("ticketInfo",JSON.stringify(data.ticketInfo));
                    window.location.href = data.address;
                }else {
                    alert("数据库查询座位信息出错！");
                    return;
                }
            },
            err:function () {
                alert("网络繁忙！")
            }
        })
    });

})


