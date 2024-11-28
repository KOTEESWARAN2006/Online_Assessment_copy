$(document).ready(function () {
    var timer = "10:01:10";

    var splitedtimer = timer.split(":");
    var hour = parseInt(splitedtimer[0], 10);
    var minute = parseInt(splitedtimer[1], 10);
    var second = parseInt(splitedtimer[2], 10);

    function update_timer() {
        var displayhour = hour;
        var displayminute = minute;
        var displaysecond = second;
        if (hour < 10) {
            displayhour = "0" + hour;
        }
        if (minute < 10) {
            displayminute = "0" + minute;
        }
        if (second < 10) {
            displaysecond = "0" + second;
        }
        $("#Timer").text(displayhour + ":" + displayminute + ":" + displaysecond);
    };

    update_timer();

    var Countdowntimer;

    $("#startbutton").click(function () {
        if (!Countdowntimer) {

            Countdowntimer = setInterval(function () {
                if (second > 0) {
                    second--;
                }
                else {
                    if (minute > 0) {
                        second = 59;
                        minute--;
                    }
                    else {
                        if (hour > 0) {
                            second = 59;
                            minute = 59;
                            hour--;
                        }
                        else {
                            clearInterval(Countdowntimer);
                        }
                    }
                } update_timer();
            }, 1000);
        };
    });
});