$(document).ready(function () {
    Get_test_lists();
});

function Get_test_lists() {
    $.ajax({
        url: '/Project/Get_test_lists',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#test_table").DataTable().clear().destroy();
            $("#test_table").DataTable({
                data: data,
                columns: [
                    {
                        data: '',
                        className: 'Dt-control',
                        render: function (data, type, row) {
                            return '<button type="button" class="arrow-btn" onclick="results_for_admin(' + row.Test_Id + ')"><i class="fa fa-arrow-right"></i></button>'
                        }
                    },
                    { data: "Test_Id" },
                    { data: "Test_name" },
                    {
                        data: '',
                        render: function (data, type, row) {
                            return sqldatetojsdate(row.Created_date);
                        }
                    },
                    {
                        data: '',
                        render: function (data, type, row) {
                            return sqldatetojsdate(row.Start_date);
                        }
                    },
                    {
                        data: '',
                        render: function (data, type, row) {
                            return sqldatetojsdate(row.End_date);
                        }
                    },
                    {

                        data: '',
                        render: function (data, type, row) {
                            return sqltimetojstime(row.Duration);
                        }
                    },
                    {
                        data: '',
                        render: function (data, type, row) {
                            return '<button onclick="Invite_users(' + row.Test_Id + ')" class="btn btn-success">Invite Users</button>' + ' ' +
                                '<button onclick="Add_edit_question(' + row.Test_Id + ')" class="btn btn-primary">Add/Edit Questions</button>';
                        }
                    }
                ],
                order: [[0, 'asc']],
                processing: true,
                serverSide: false
            });
        },
        error: function () {
            alert("Get test list fail");
        }
    });
};


function create_test() {
    var test_details = {
        Test_name: $("#test_name").val(),
        Start_date: decodeURIComponent($("#startdate").val()),
        End_date: decodeURIComponent($("#enddate").val()),
        Duration: decodeURIComponent($("#duration").val()) + ':00'
    };
    $.ajax({
        url: '/Project/Create_test',
        type: 'POST',
        data: { test: JSON.stringify(test_details) },
        dataType: 'json',
        success: function () {
            alert("Succes");
        },
        error: function () {
            alert("fail");
        }
    });
};



function sqldatetojsdate(sqldate) {

    var timestamp = parseInt(sqldate.replace(/\/Date\((\d+)\)\//, '$1'), 10);

    var date = new Date(timestamp);

    var optionsDate = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    var optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    var jsdate = date.toLocaleString(undefined, optionsDate);
    var jstime = date.toLocaleString(undefined, optionsTime);
    return jsdate + ' ' + jstime;
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

function Add_edit_question(Test_Id) {
    window.location.href = "/Project/Question_map_page/" + Test_Id;
};

function Invite_users(Test_Id) {
    window.location.href = "/Project/Invitation_page/" + Test_Id;
};

//function View_results(Test_Id) {
//    window.location.href = "/Project/Result_admin/" + Test_Id;
//}

function results_for_admin(Test_id) {

    var child_table = $('<table id="child_table"><thead><tr><th>User Id</th><th>User name</th><th>Email</th><th>Result/Marks</th></tr></thead><tbody></tbody></table>');
    var tr = $('button[onclick="results_for_admin(' + Test_id + ')"]').closest('tr');
    var row = $("#test_table").DataTable().row(tr);

    if (row.child.isShown()) {
        row.child.hide();

    }

    else {
        $.ajax({
            url: "/Project/Get_result_for_admin",
            type: "POST",
            data: { test_id: Test_id },
            success: function (Result) {

                $('#child_table').DataTable().clear().destroy();
                child_table.DataTable({

                    data: Result,
                    columns: [
                        { data: "User_Id" },
                        { data: "User_name" },
                        { data: "Email" },
                        { data: "Result" }
                    ],
                    autoWidth: false,
                    order: [3, 'desc']
                });
                row.child(child_table).show();

            },
            error: function () {
                alert("Unable to fetch results");
            }
        })
    }
}

