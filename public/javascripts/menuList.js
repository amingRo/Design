/**
 * Created by xyG on 2017/5/25.
 */
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
$(function () {
    //生成订单列表
    (function (menuInfo) {
        var oFragment = document.createDocumentFragment();
        // var seatInit = seatSelect;
        $.each(menuInfo,function (index, ele) {
            oFragment.appendChild($("<tr><td>" + ele.ticketName +"</td><td>" + ele.showTime + "</td><td>" + ele.totalMoney + "</td><td>" + ele.ticketNum + "</td><td><button data-performance="+ ele.performance+" data-areaId="+ ele.areaSelectNum +" data-menuId="+ ele.onlyId +" onclick='delMenu(this)'>删除订单</button></td></tr>")[0])
        })
        $(".dataContainer thead").after($(oFragment));
    })(JSON.parse($.session.get("menuInfo")))
})