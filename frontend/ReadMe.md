<!DOCTYPE html>
<html>
<head>
    <title>Company Calendar</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        h1, h2 {
            text-align: center;
            margin: 20px 0;
        }

        label {
            display: inline-block;
            width: 150px;
            text-align: right;
            margin-right: 10px;
        }

        input[type="text"], input[type="date"], input[type="number"] {
            padding: 5px;
            width: 150px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: center;
        }

        th {
            background-color: #f2f2f2;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #ddd;
        }

        button {
            padding: 8px 20px;
            background-color: #3498db;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        button:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <h1>Welcome to Company Calendar</h1>
    
    <!-- Employee Information Section -->
    <div>
        <label for="employeeName">Employee Name:</label>
        <input type="text" id="employeeName" name="employeeName"><br><br>
        
        <label for="Month">Month:</label>
        <input type="text" id="currentMonth" name="currentMonth"><br><br>
    </div>
    
    <!-- Calendar Table Section -->
    <h2>Calendar Entries</h2>
    <table border="1">
        <tr>
            <th>Date</th>
            <th>Working Hours</th>
            <th>Leave Hours</th>
            <th>Holiday Hours</th>
        </tr>
        
        <tr>
            <td><input type="date" name="entryDate"></td>
            <td><input type="number" name="workingHours" step="0.5"></td>
            <td><input type="number" name="leaveHours" step="0.5"></td>
            <td><input type="number" name="holidayHours" step="0.5"></td>
        </tr>
        
        <!-- You can add more rows as needed -->
    </table>
    
    <br>
    <button onclick="addRow()">Add Row</button>
    
    <script>
        // Function to add a new row to the table
        function addRow() {
            var table = document.querySelector("table");
            var newRow = table.insertRow(table.rows.length - 1);
            
            var cellDate = newRow.insertCell(0);
            var cellWorkingHours = newRow.insertCell(1);
            var cellLeaveHours = newRow.insertCell(2);
            var cellHolidayHours = newRow.insertCell(3);
            
            cellDate.innerHTML = '<input type="date" name="entryDate">';
            cellWorkingHours.innerHTML = '<input type="number" name="workingHours" step="0.5">';
            cellLeaveHours.innerHTML = '<input type="number" name="leaveHours" step="0.5">';
            cellHolidayHours.innerHTML = '<input type="number" name="holidayHours" step="0.5">';
        }
    </script>
</body>
</html>
