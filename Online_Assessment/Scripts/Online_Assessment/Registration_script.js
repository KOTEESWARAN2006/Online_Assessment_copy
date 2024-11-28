$(document).ready(function () {
    $("#user_register_form").submit(function (event) {
        event.preventDefault();
        var email = $("#Email").val();
        var form_data = {
            First_name: $("#First_name").val(),
            Last_name: $("#Last_name").val(),
            Email: $("#Email").val(),
            Password: $("#Password").val()
        }

        $.ajax({
            url: '/Project/Validate_email',
            type: 'POST',
            data: JSON.stringify({ email: email }),
            datatype: 'json',
            contentType: 'application/json',
            success: function (Result) {
                if (Result == 0) {
                    $.ajax({
                        url: '/Project/Register_user',
                        type: 'POST',
                        data: JSON.stringify({formdata: form_data}),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (response) {
                            $("#user_register_form").hide();
                            $("#message").show();
                        },
                        error: function (error) {
                            alert("process fail");
                        }
                    });
                }
                else {
                    alert("This email is taken. Try another.");
                }
            },
            error: function () {
                alert("Registration fail");
            }
        });
    });
});