$(document).ready(function () {
    $("#startbutton").click(function () {
        var test_id = $("#test_id").val();
        var user_id = $("#user_id").val();
        window.location.href = "/Project/Live_test_page?test_id=" + test_id + "&user_id=" + user_id;
    });
});