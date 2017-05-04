/**
 * Created by amingRo on 2016/8/15.
 */
$(function () {
    //首页左侧选项卡切换特效
    $(".left_mealMenu > ul > li").click(function () {
        var index = $(this).index();
        $(this).addClass("selected").siblings().removeClass("selected");
        $(".right_mealMenu").eq(index).css("display","block").siblings(".right_mealMenu").css("display","none");
    });
    //选择日期控件
    $("#selectDate").click(function () {
        $("#showCalander").toggle();
    });
});