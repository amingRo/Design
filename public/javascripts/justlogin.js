/**
 *
 * Created by amingRo on 2017/5/7.
 */
$(function () {
    $("#login").click(function () {
        $("#verifyCode").val() == "1111"?window.location.href = "http://localhost:3000/users/"+$("#conect").val():false;
    })
})
