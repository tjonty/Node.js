const express = require("express");
const app = express();
const excelToJson = require("convert-excel-to-json");
const readXlsxFile = require("read-excel-file/node");
// const csvtojsonV2 = require("csvtojson");
var csvFilePath = "diabetes.csv";
const csv = require("csvtojson");

app.get("/", (req, res) => {          
  // File path.
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {

      for (var i = 0; i < jsonObj.length; i++) {
        // res.write("array index: " + i + "\n");
        var obj = jsonObj[i];
        var zsm = jsonObj[0].zsm;
        // console.log("ZSM : " + zsm);
        for (var key in obj) {
          var value = obj[key];
          if(value == zsm){
            // res.write("kv : " + key + " : " + obj["rm"] + "\n");
          }
          // res.write("kv : " + key + " : " + value + "\n");
        }
      }
      res.send(jsonObj);
    });

});

app.listen("3000", function () {
  console.log("Server is started at 3000");
});
