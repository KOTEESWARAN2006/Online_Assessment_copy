var Question_ids = [];
var currentquestion_index = 0;

$(document).ready(function () {

    fetchQuestionIds();
    Get_question_answer();
    update_question_no();
    get_timer();
});

function fetchQuestionIds() {
    $.ajax({
        url: "/Project/Get_only_questionids",
        type: "POST",
        dataType: "json",
        data: { test_id: $("#test_id").val() },
        success: function (Result) {
            Result.forEach(function (question_id) {
                Question_ids.push(question_id);
            });
            Get_question_answer();
        },
        error: function () {
            alert("Question ID fetch failed");
        }
    });
};

function Get_question_answer() {

    if (Question_ids.length > 0 && currentquestion_index < Question_ids.length) {
        $.ajax({
            url: "/Project/Get_question_answer",
            type: "POST",
            dataType: "json",
            data: { Question_id: Question_ids[currentquestion_index] },
            success: function (Question_answer) {
                var source = $("#template").html();
                var template = Handlebars.compile(source);
                var html = template(Question_answer);
                $("#test_body").html(html);
                update_question_no();
                mark_selected_option(Question_ids[currentquestion_index]);

            },
            error: function () {
                alert("Unable to fetch question and answer");
            }
        });
    }
};


function update_question_no() {
    $("#Question_no").html((currentquestion_index + 1) + ".");
};

function mark_selected_option(Question_id) {
    $.ajax({
        url: "Get_select_optionid",
        type: "POST",
        data: { Question_id: Question_id },
        success: function (Question) {
            if (Question.Question_Id == Question_ids[currentquestion_index]) {
                $("input[name='options'][value='" + Question.Option_Id + "']").prop('checked', true);
            }
        },
        error: function () {
            alert("fail to mark selected option");
        }
    });
};

function get_timer() {
    $.ajax({
        url: "/Project/Get_data_for_livetest",
        type: "POST",
        data: { Test_id: $("#test_id").val() },
        dataType: "json",
        success: function (result) {
            var timer = sqltimetojstime(result);

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

            var Countdowntimer = setInterval(function () {
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
                            save_current_answers();
                        }
                    }
                }
                update_timer();
            }, 1000);

        },
        error: function () {
            alert("Unable to fetch timer");
        }
    });

};


function sqltimetojstime(sqltime) {
    if (!sqltime) {
        return "00:00:00";
    }

    var hour = sqltime.Hours;
    var minute = sqltime.Minutes;
    var second = sqltime.Seconds;

    var formattedHour = String(hour).padStart(2, '0');
    var formattedMinute = String(minute).padStart(2, '0');
    var formattedSecond = String(second).padStart(2, '0');

    return formattedHour + ':' + formattedMinute + ':' + formattedSecond;
};

function save_attended_answers(attended_question_id, attended_option_id) {
    $.ajax({
        url: "/Project/Attended_question_answer_ids",
        type: "POST",
        data: { Question_id: attended_question_id, Option_id: attended_option_id },
        success: function () {
            Get_question_answer();
        },
        error: function () {
            Get_question_answer();
        }
    });
};


function prevclick() {
    var attended_question_id = $("#test_body input[name='Question_id']").val();
    var attended_option_id = $("#test_body input[name='options']:checked").val();


    if (attended_option_id != undefined) {
        save_attended_answers(attended_question_id, attended_option_id);
        if (currentquestion_index != 0) {
            currentquestion_index--;
            Get_question_answer();
        }
        else {
            alert("This is first question");
        }
    }
    else { 

    if (currentquestion_index != 0) {
        currentquestion_index--;
        Get_question_answer();
    }
    else {
        alert("This is first question");
        }
    }
};


function nextclick() {
    var attended_question_id = $("#test_body input[name='Question_id']").val();
    var attended_option_id = $("#test_body input[name='options']:checked").val();
    

    if (attended_option_id != undefined) {
        save_attended_answers(attended_question_id, attended_option_id);
        if (currentquestion_index < Question_ids.length - 1) {
            currentquestion_index++;
            Get_question_answer();
        } else {
            alert('No more questions.');
        }
    }
    else { 

    if (currentquestion_index < Question_ids.length - 1) {
        currentquestion_index++;
        Get_question_answer();
    } else {
        alert('No more questions.');
        }
    }
};

function save_current_answers() {

    var attended_question_id = $("#test_body input[name='Question_id']").val();
    var attended_option_id = $("#test_body input[name='options']:checked").val();
    
    if (attended_option_id != undefined) {
        $.ajax({
            url: "/Project/Attended_question_answer_ids",
            type: "POST",
            data: { Question_id: attended_question_id, Option_id: attended_option_id },
            success: function () {
                save_final_answers();
            },
            error: function () {
                alert("unable to save");
            }
        });
    }
    else {
        save_final_answers();
    }
};

function save_final_answers() {
    $.ajax({
        url: "/Project/Save_user_answers",
        type: "GET",
        success: function (result) {
            if (result != 0 || result == 0) {
                $("#test_body").hide();
                $(".timer").hide();
                $("#result_body").show();
            }
        },
        error: function () {
            alert("Unable to submit test");
        }
    });
};



