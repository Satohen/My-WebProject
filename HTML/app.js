// 導入所需的模組
var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs"); // Node.js內建的檔案系統模組
var dataFileName = "./data.json";

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// 啟動Express伺服器
app.listen(3000);
console.log("Web伺服器就緒，開始接受用戶端連線.");
console.log("「Ctrl + C」可結束伺服器程式.");

app.get("/todo/list", function (req, res) {
  var data = fs.readFileSync(dataFileName);
  var todoList = JSON.parse(data);
  res.set("Content-type", "application/json");
  res.send(JSON.stringify(todoList));
});

app.get("/todo/item/:id", function (req, res) {
  var data = fs.readFileSync(dataFileName);
  var todoList = JSON.parse(data);

  var targetIndex = -1;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].todoTableId.toString() == req.params.id.toString()) {
      targetIndex = i;
      break;
    }
  }
  if (targetIndex < 0) {
    res.send("not found");
    return;
  }

  res.set("Content-Type", "application/json");
  res.send(JSON.stringify(todoList[targetIndex]));
});

app.post("/todo/create", function (req, res) {
  var data = fs.readFileSync(dataFileName);
  var todoList = JSON.parse(data);
  var item = {
    todoTableId: new Date().getTime(),
    title: req.body.title,
    isComplete: req.body.isComplete,
  };
  todoList.push(item);
  fs.writeFileSync("./data.json", JSON.stringify(todoList, null, "\t"));
  res.send("row inserted.");
});

app.put("/todo/item", function (req, res) {
  var data = fs.readFileSync(dataFileName);
  var todoList = JSON.parse(data);
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].todoTableId == req.body.todoTableId) {
      todoList[i].title = req.body.title;
      todoList[i].isComplete = req.body.isComplete;
      break;
    }
  }
  fs.writeFileSync("./data.json", JSON.stringify(todoList, null, "\t"));
  res.send("row updated.");
});

app.delete("/todo/delete/:id", function (req, res) {
  var data = fs.readFileSync(dataFileName);
  var todoList = JSON.parse(data);

  var deleteIndex = -1;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].todoTableId.toString() == req.params.id.toString()) {
      deleteIndex = i;
      break;
    }
  }
  if (deleteIndex < 0) {
    res.send("not found");
    return;
  }

  todoList.splice(deleteIndex, 1);
  fs.writeFileSync("./data.json", JSON.stringify(todoList, null, "\t"));
  res.send("row deleted.");
});

// 這邊開始自己魔改
// 定義路由處理程序，用於處理目的地程式碼參數的GET請求

app.get("/todo/item/destination/:code", function (req, res) {
  var data = fs.readFileSync(dataFileName); // 讀取儲存航班資料的JSON文件

  var todoList = JSON.parse(data); // 解析JSON數據，將其轉換為JavaScript對象

  var destinationCode = req.params.code; // 取得從HTTP請求中傳遞的目的地代碼參數

  var flightsToDestination = todoList[destinationCode]; // 尋找具有目的地代碼參數的航班數據
  // 如果找到匹配的航班數據，將其以JSON格式回應給客戶端
  // 如果沒有找到匹配的航班數據，返回404錯誤給客戶端

  if (flightsToDestination) {
    res.json(flightsToDestination);
  } else {
    res.status(404).send("No flights to the specified destination found.");
  }
});

// 這邊重寫一個指令存放其他東西
app.post("/order/create", function (req, res) {
  var data = fs.readFileSync("./bookinfo.json");
  var orderList = JSON.parse(data);

  if (!Array.isArray(orderList)) {
    orderList = []; // 如果不是数组，初始化为空数组
  }

  var order = {
    orderId: new Date().getTime(), // 使用当前时间作为订单ID
    name: req.body.name,
    gender: req.body.gender,
    email: req.body.email,
    address: req.body.address,
    cardNumber: req.body.cardNumber,
    expirationDate: req.body.expirationDate,
    cvv: req.body.cvv,
    flightInfo: req.body.flightInfo,
    // 寫入需要資訊
  };
  console.log(req.body.flightInfo);
  orderList.push(order);

  // 将更新后的订单列表重新写入到文件中
  fs.writeFileSync("./bookinfo.json", JSON.stringify(orderList, null, 2));

  // 返回响应给客户端
  res.json({ message: "訂單創建成功", order: order });
});

// 註冊的url

app.post("/user/register", function (req, res) {
  var userData = {
    userfirstname: req.body.userfirstname,
    userlastname: req.body.userlastname,
    gender: req.body.gender,
    password: req.body.password,
    email: req.body.email,
    birth: req.body.birth,
    phone: req.body.phone,
  };

  // 将用户信息保存到文件
  var data = fs.readFileSync("users.json");
  var users = JSON.parse(data);

  if (!Array.isArray(users)) {
    users = []; // 如果不是数组，初始化为空数组
  }

  users.push(userData);

  // 将更新后的用户信息保存回文件
  fs.writeFileSync("users.json", JSON.stringify(users));

  // 返回注册成功或失败的响应
  res.json({ message: "註冊成功" }); // 或其他响应
});
