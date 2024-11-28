$(document).ready(function () {
    $.ajax({
        url: '/Project/Get_assigned_testlist',
        type: 'get',
        dataType: 'json',
        success: function (assigned_tests) {
            var assigned_tests_length = assigned_tests.length;
            var mapped_test_length = 0;

            assigned_tests.forEach(function (test) {
                $.ajax({
                    url: "/Project/Get_result_for_user",
                    type: "POST",
                    data: { test_id: test.Test_Id },
                    success: function (result) {
                        if (result > 0) {
                            test.Result = result + "%";
                        }
                        else {
                            test.Result = "0.0%";
                        }
                        mapped_test_length++;

                        if (assigned_tests_length === mapped_test_length) {
                            Initialize_datatable(assigned_tests);
                        }
                    },
                    error: function () {
                        test.result = "0.0%";
                        mapped_test_length++;

                        if (assigned_tests_length === mapped_test_length) {
                            Initialize_datatable(assigned_tests);
                        }
                    }
                });
            });
        },
        error: function () {
            alert("Unalbe to fetch assigned test list");
        }
    });
});

function Initialize_datatable(assigned_tests) {
    $("#test_table").DataTable().clear().destroy();
    $("#test_table").DataTable({
        data: assigned_tests,
        columns: [
            { data: "Test_name" },
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
                data: "",
                render: function (data, type, row) {
                    if (row.Status == 1) {
                        return "Taken";
                    }
                    else {
                        return "Not taken";
                    }
                }
            },
            {
                data: '',
                render: function (data, type, row) {
                    return '<button onclick="Go_test_start_page(' + row.Test_Id + ')" class="btn btn-success">Take Test</button>';
                }
            },
            { data: "Result" }
        ]
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

function Go_test_start_page(Test_Id) {
    window.location.href = "/Project/Test_start_page/" + Test_Id;
}