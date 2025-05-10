var ischange = 0;
$(document).ready(function () {

    var urlParams = new URLSearchParams(window.location.search);
    var employeeId = urlParams.get('id');
    if (employeeId) {
        GetEditData(employeeId);
    }
    $('#JoiningDate').datepicker({
        dateFormat: 'dd-mm-yy',
    });
    $('#JoiningDate').datepicker('setDate', new Date());
    $('#WorkingTime').timepicker({
        'timeFormat': 'H:i', 
    });
    $('#WorkingTime').timepicker('setTime', '09:00');



    getAllData();
    bindHtmlDropDown();
});

function getAllData() {
    $('#Employee_Table').DataTable({
        ajax: {
            url: '/Employees/List',
            dataSrc: 'data'
        },
        columns: [
            { data: 'EmployeeName' },
            { data: 'workingtime' },
            { data: 'ManagerName' },
            {
                data: 'joinDate',
                render: function (data) {
                    if (data) {
                        var date = new Date(data);
                        return date.toLocaleDateString();
                    }
                    return '';
                }
            },
            {
                data: null,  // This column will not have direct data binding; it will be populated with buttons.
                render: function (data, type, row) {
                    // Adding inline onclick functions and adding margin to buttons
                    return '<button class="edit-btn" style="margin-right: 10px;" onclick="editEmployee(' + row.EmployeeID + ')">Edit</button>' +
                        '<button class="delete-btn" style="margin-left: 10px;" onclick="deleteEmployee(' + row.EmployeeID + ')">Delete</button>';
                }
            }
        ]
    });


}

function deleteEmployee(id) {
    $.ajax({
        url: "../Employees/DeleteEmployee", // Replace with your server endpoint
        type: "POST",
        data: { id: parseInt(id) },
        success: function (response) {
            // Handle success
            var Data = JSON.parse(response);
            if (Data.Message == "Error") {
                ShowHmtlError('error', "Employee", Data.data);
            }
            else {
                ShowHmtlError('info', "Employee", "Employee Deleted Successfully");
                getAllData();
            }
            console.log("Success:", response);
        },
        error: function (xhr, status, error) {
            // Handle error
            $("#responseMessage").text("An error occurred while saving the data.");
            console.error("Error:", error);
        },
    });
}

function editEmployee(id) {
    window.location.href = 'https://localhost:44394/Employees/MainView?id=' + parseInt(id);
};

function bindHtmlDropDown(selected) {
    $.ajax({
        url: "../Employees/BindDropDown", // Replace with your server endpoint
        type: "Get",
        success: function (response) {
            // Handle success
            var Data = JSON.parse(response);
            var rData = JSON.parse(Data.Data);
            var options = "";
            $('#ddlManager').html(""); 
            var options = '<option> </option>';
            $.each(rData, function (index, item) {
                if (selected !== undefined && item.id === selected) {
                    options += '<option value="' + item.id + '" selected>' + item.Name + '</option>';
                } else {
                    options += '<option value="' + item.id + '">' + item.Name + '</option>';
                }
            });
            $('#ddlManager').append(options);
        },
        error: function (xhr, status, error) {
            // Handle error
            $("#responseMessage").text("An error occurred while saving the data.");
            console.error("Error:", error);
        },
    });
}

function GetEditData(id) {
    $.ajax({
        url: "../Employees/GetEditData", // Replace with your server endpoint
        data: { id: parseInt(id) },
        type: "Get",
        success: function (response) {
            // Handle success
            var Data = JSON.parse(response);
            ischange = 1;
            $("#TxtName").val(Data[0].Name);
            $("#TxtEmail").val(Data[0].Email);
            $("#TxtPhoneNo").val(Data[0].PhoneNumber);
            $("#TxtSalary").val(Data[0].Salary);
            bindHtmlDropDown(Data[0].managerId);
            $('#JoiningDate').datepicker('setDate', new Date(Data[0].joindate));
            if (Data[0].gendar.trim() === 'Female') {
                $('#femalegender').prop('checked', true);  // Check the female radio button
            } else if (Data[0].gendartrim() === 'Male') {
                $('#malegender').prop('checked', true);  // Check the male radio button
            }

        },
        error: function (xhr, status, error) {
            // Handle error
            $("#responseMessage").text("An error occurred while saving the data.");
            console.error("Error:", error);
        },
    });
}

function AddEmployee() {

    var formData = {};
    $("#FrmEmployee").serializeArray().forEach(function (field) {
        formData[field.name] = field.value;
    });
    if (ischange == 1) {
        var urlParams = new URLSearchParams(window.location.search);
        formData.Code = urlParams.get('id');
    }
    else {
        formData.Code = 0;
    }
    formData.ManagerId = $("#ddlManager").find(":selected").val();
    formData.JoiningDate = $("#JoiningDate").val();
    formData.WorkingTime = $("#ApoitmentTime").val();
    formData.Gender = $('input[name="Gender"]:checked').val();


    var jsonString = JSON.stringify(formData);
    $.ajax({
        url: "../Employees/SaveEmployee", // Replace with your server endpoint
        type: "POST",
        data: { jsonString: jsonString },
        success: function (response) {
            // Handle success
            var Data = JSON.parse(response);
            if (Data.Message == "Error") {
                ShowHmtlError('error', "Employee", Data.data);
            }
            else {
                ShowHmtlError('info', "Employee", "Employee Added Successfully");
                window.location.href = 'https://localhost:44394/Employees/index';
                getAllData();
            }
            console.log("Success:", response);
        },
        error: function (xhr, status, error) {
            // Handle error
            $("#responseMessage").text("An error occurred while saving the data.");
            console.error("Error:", error);
        },
    });
}

function ShowHmtlError(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        confirmButtonText: 'Okay',  // Custom text for the confirmation button
        background: '#f8d7da',  // Custom background color (light red)
        confirmButtonColor: '#d33' // Custom button color (red)
    });
}