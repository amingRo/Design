/**
 *
 * Created by amingRo on 2017/5/7.
 */
$(function () {
    $("#conect").focus(function () {
        $(this).val("").siblings("span").css("display","none");
    })
    $("#login").click(function () {
        var contect = $("#conect").val();
        $.ajax({
            type:"POST",
            url:"/data/menuQuery",
            data:{
                "contect":contect
            },
            dataType:"json",
            success:function (data) {
                console.log(data);
                if(data[0].success == "success"){
                    $.session.set("menuInfo",JSON.stringify(data));
                    window.location.href = "http://localhost:3000/users/"+$("#conect");
                }else {
                    $("#conect+span").css("display","inline-block");
                }
            }
        })
    })

})
