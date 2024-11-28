$(document).ready(function () {
    Get_invited_users_list();
});

function Get_invited_users_list() {
    $.ajax({
        url: '/Project/Get_invited_users_list',
        dataType: 'json',
        type: 'POST',
        data: { Id: $("#Test_id").val() },
        success: function (data) {
            $("#Invitaion_table").DataTable().clear().destroy();
            $("#Invitaion_table").DataTable({
                data: data,
                columns: [
                    { data: "Invitation_Id" },
                    { data: "Test_Id" },
                    { data: "User_email" },
                    {
                        data: '',
                        render: function (data, type, row) {
                            return sqldatetojsdate(row.Invited_date);
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
                    }
                ]
            });
        },
        error: function () {
            alert("fail");
        }
    });
};

function Invite_for_test() {
    var Invited_emails = $("#invited_email").val();
    var Test_id = $("#Test_id").val();
    var separated_emails = [];
    separate_emails();

    function separate_emails() {
        var emails = Invited_emails.split(',');
        emails.forEach(function (email) {
            separated_emails.push(email.trim());
        });
    };

    $.ajax({
        url: '/Project/Invite_for_test',
        type: 'POST',
        dataType: 'json',
        data: { Id: Test_id, Invited_emails: JSON.stringify(separated_emails) },
        success: function () {
            alert("Invited successfully!");
            $("#invited_email").val("");
            Get_invited_users_list();
        },
        error: function () {
            alert("Invitation fail");
        },
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