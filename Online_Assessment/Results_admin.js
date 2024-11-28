$(document).ready(function () {
    Get_tests_results();
});

function Get_tests_results(test_id) {
    $.ajax({
        url: "/Project/Get_result_for_admin",
        type: "POST",
        data: { test_id: test_id },
        success: function (result) {
        },
        error: function () {

        }
    })
}