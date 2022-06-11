const express = require("express");
const cors = require("cors");
const app = express();
const sql = require("../BackEnd/Connection.js");

const InwardInsertSheet = require('../BackEnd/InwardSheet/Inward_Insert_Sheet.js');
const InwardViewData = require('../BackEnd/InwardSheet/InwardSheetView.js');
const InwardDeleteData = require('../BackEnd/InwardSheet/InwardDelete.js');
const InwardUpdateSheet = require('../BackEnd/InwardSheet/InwardUpdate.js');

const OutWardInsertSheet= require('../BackEnd/OutwardSheet/OutwardInsert.js');
const OutwardViewData = require('../BackEnd/OutwardSheet/OutWarddisplayData.js');
const OutwardDeleteData = require('../BackEnd/OutwardSheet/OutwardDelete.js');
const OutwardUpdateSheet = require('../BackEnd/OutwardSheet/OutwardUpdate.js');

const LoginCredentional = require('../BackEnd/LoginDB/Logindb.js');
const Depot_details = require('../BackEnd/Depot_Data/DepotList.js');
const ExcelTodb = require('../BackEnd/Excel_to_Db/Excel_to_db.js');
const Dealer_Details = require('../BackEnd/Depot_Data/DealerDetails.js');
const Dealer_DetailsALL = require('../BackEnd/Depot_Data/ALL_DEALER_DETAILS.js');
const StockSheetViewData = require('../BackEnd/Sheet/StockSheet/StockSheetData.js');
const NewStockSheetViewData = require('../BackEnd/Sheet/NewStockSheet/newstock.js');
const NewStockSheetViewData2 = require('../BackEnd/Sheet/NewStockSheet/newstock2.js');
const CORRECTION_REPORT_DATA = require('../BackEnd/Sheet/Correction_Report/Correction_report.js');
const DSR_REPORT_DATA = require('../BackEnd/Sheet/DSR_Report/dsr_report.js');
const DSR_REPORT_DATA_2 = require('../BackEnd/Sheet/DSR_Report/drs_report_2.js');
const DSR_REPORT_DATA_3 = require('../BackEnd/Sheet/DSR_Report/dsr_report_3.js');

var STATUS_CHECK = null;

var corsOptions = {
  origin:'http://3.108.178.157'
};

app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

var d = [];
sql.query(`Select Grade_Name from Grade_Con`, [1], (e, r) =>
{
  r.forEach(element => {
    d.push(element.Grade_Name);
  });
});

InwardInsertSheet(app, sql);
InwardViewData(app, sql);
InwardUpdateSheet(app, sql);
InwardDeleteData(app, sql);

OutwardViewData(app, sql);
OutWardInsertSheet(app, sql);
OutwardUpdateSheet(app, sql);
OutwardDeleteData(app, sql);

StockSheetViewData(app, sql,d);
NewStockSheetViewData(app, sql);

app.post("/NewStockSheet2/getData",(req, res) =>
{
  NewStockSheetViewData2(app, sql, d,req).then((e) =>
  {
    res.json(e);
  });  
});

LoginCredentional(app, sql, STATUS_CHECK);
Depot_details(app, sql, STATUS_CHECK);
Dealer_Details(app, sql, STATUS_CHECK);
Dealer_DetailsALL(app, sql, STATUS_CHECK).then((e) =>
{
  app.get("/Dealer/data", (req, res) =>
  {
    res.json({e})
  });  
});

app.get('Status', (req,res) =>
{
  res.json(STATUS_CHECK);
});

app.get('/Grade', (req, res) =>
{
  res.json({ Status: true, Grade_List: d });
});
app.post("/Correction_Report/data",  (req, res) =>
{
  CORRECTION_REPORT_DATA(app, sql,req).then((e) =>
  {
    res.json(e);
  });  
});

app.post("/Dsr_Report/data",  (req, res) =>
{
  DSR_REPORT_DATA(app, sql,req).then((e) =>
  {
    res.json(e);
  });  
});
app.post("/Dsr_Report/data2",  (req, res) =>
{
  DSR_REPORT_DATA_2(app, sql,req).then((e) =>
  {
    res.json(e);
  });  
});
app.post("/Dsr_Report/data3",  (req, res) =>
{
  DSR_REPORT_DATA_3(app, sql,req).then((e) =>
  {
    res.json(e);
  });  
});
const PORT = process.env.PORT || 3000;
var server=app.listen(PORT, () => {
  console.log(`Server is running on port ${ PORT }.`);
});
server.setTimeout(30*10000);
ExcelTodb(app, sql, server, STATUS_CHECK);