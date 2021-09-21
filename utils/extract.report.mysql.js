var fs = require("fs");
var jp = require('jsonpath');
var mysql = require('mysql');

// Get content from file
var contents = fs.readFileSync("../mochawesome-report/mochawesome.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);

var testExecutionTime = jp.query(jsonContent, '$.stats.start').toString();
testExecutionTime = testExecutionTime.replace('T', ' ')
testExecutionTime = testExecutionTime.slice(0,-5)

// MySQL DataBase

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "db_cypress_api_monitor"
});

// Extract and Iterate
var resultsArray = jp.query(jsonContent, '$..results[0].suites[0].tests[*]');

for (let index = 0; index < resultsArray.length; index++) {

    var serviceNameValue = jp.query(jsonContent, '$.results[0].suites[0].tests['+index+'].title');
    var statusValue = jp.query(jsonContent, '$.results[0].suites[0].tests['+index+'].state');
    if(statusValue=="passed"){
      statusValue = 200
      errMessage = 'noErr'
    }
    else{
      //statusValue = 500
      //errMessage = jp.query(jsonContent, '$.results[0].suites[0].tests['+index+'].err.message')

      /* let keyStringStart = 'The response we got was:\n\n'
      let keyStringEnd = '\nHeaders: {'
      let message = jp.query(jsonContent, '$.results[0].suites[0].tests['+index+'].err.message')
      let errMessageTemp = keyStringStart + message.toString().split(keyStringStart)[1]
      errMessage = errMessageTemp.split(keyStringEnd)[0] */

      let keyStringStart = 'The response we received from your web server was:\n\n  > '
      let keyStringEnd = ': '
      let message = jp.query(jsonContent, '$.results[0].suites[0].tests['+index+'].err.message')
      let statusValueTemp = message.toString().split(keyStringStart)[1]
      statusValue = statusValueTemp.split(keyStringEnd)[0]
      console.log("statusValue ", statusValue);

    }

    

    var responseTimeValue = jp.query(jsonContent, '$.results[0].suites[0].tests['+index+'].duration');

    console.log("Service Names ", serviceNameValue);
    console.log("Status ", statusValue);
    console.log("Response Time", responseTimeValue);

  
    var sql = "INSERT INTO tbl_api_status_details (serviceName, status, responseTime, time_executed, errMessage) VALUES ('"+serviceNameValue+"','"+ statusValue+"','"+ responseTimeValue+"','"+testExecutionTime+"','"+errMessage+"')";
    con.query(sql, function (err, result) {
    if (err) throw err;
        // console.log("1 record inserted");
    });
}

con.end();