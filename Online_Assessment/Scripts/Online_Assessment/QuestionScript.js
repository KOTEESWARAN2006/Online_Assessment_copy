$(document).ready(function () {
    $('input[type="checkbox"]').change(function () {
        $('input[type="checkbox"]').not(this).prop('checked', false).val(false);
        $(this).val(true);
    });
});

function Add_question() {
    var Questions = {
        Subject_Id: $("#Subject_Id").val(),
        Questions: $("#Question").val(),
        Difficulty_Id: $("#Difficulty_Id").val()
    }
    var Options = [];
    Options.push({
        Options: $("#Option1").val(),
        Answer: $("#checkbox1").val()
    });
    Options.push({
        Options: $("#Option2").val(),
        Answer: $("#checkbox2").val()
    });
    Options.push({
        Options: $("#Option3").val(),
        Answer: $("#checkbox3").val()
    });
    Options.push({
        Options: $("#Option4").val(),
        Answer: $("#checkbox4").val()
    });

    $.ajax({
        url: '/Project/Add_Question',
        type: 'POST',
        data: { Questions: JSON.stringify(Questions), Options: JSON.stringify(Options) },
        dataType: 'json',
        success: function () {
            alert("Question added successfully");
            $("#Question").val('');
            $("#Option1").val('');
            $("#Option2").val('');
            $("#Option3").val('');
            $("#Option4").val('');
            $('input[type="checkbox"]').prop('checked', false);
            $("#Question").focus();
        },
        error: function () {
            alert("fail");
        }
    })
};

