$(document).ready(function () {
    
    var mappedQuestionIds = [];
    var Subject_Id = $("#Subject_Id").val();
    var Difficulty_Id = $("#Difficulty_Id").val();
    var Test_Id = $('#Test_Id').val();


    $.ajax({
        url: '/Project/Get_questions',
        data: { Subject_Id: Subject_Id, Difficulty_Id: Difficulty_Id },
        dataType: 'json',
        type: 'POST',
        success: function (data) {
            $("#Question_table").DataTable().clear().destroy();
            $("#Question_table").DataTable({
                data: data,
                columns: [
                    {
                        data: '',
                        render: function (data, type, row) {
                            return "<input type='checkbox' value='" + row.Question_Id + "'>";
                        }
                    },
                    { data: "Question_Id" },
                    { data: "Questions" },
                    { data: "Subject_name" },
                    { data: "Difficulty_level" }
                ],
                drawCallback: function () {
                    mappedQuestionIds.forEach(function (Id) {
                        $('input[type="checkbox"][value="' + Id + '"]').prop('checked', true);
                    });
                },
            });
            $.ajax({
                url: '/Project/Get_mapped_questionIds',
                data: { Test_Id: Test_Id },
                dataType: 'json',
                type: 'POST',
                success: function (mappedIds) {
                    mappedQuestionIds = mappedIds;
                    data.forEach(function (Id) {
                        $('#Question_table input[type="checkbox"][value="' + Id + '"]').prop('checked', true);
                    });
                },
                error: function () {
                    alert("Failed to fetch mapped question ids");
                }
            });
        },
        error: function () {
            alert("fail");
        }
    });

    $("#searchbox").on('keyup', function () {
        $("#Question_table").DataTable().column(3).search(this.value).draw();
    });
});


function Map_questions() {
    var Collection_question = Getselectedquestion_Ids();

    $.ajax({
        url: '/Project/Map_questions_totest',
        data: { Test_Id: $('#Test_Id').val(), Question_Id: JSON.stringify(Collection_question) },
        type: 'POST',
        dataType: 'json',
        success: function () {            
            $('input[type="checkbox"]').prop('checked', false);
            alert("Question map process success");
            window.location.href = '/Project/Test_page';
        },
        error: function () {
            alert("test create fail");
        }
    });
};

function Getselectedquestion_Ids() {
    var Collection_question = [];
    $('input[type="checkbox"]:checked').each(function () {
        Collection_question.push($(this).val());
    });
    return Collection_question;
};

