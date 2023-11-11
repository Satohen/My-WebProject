// 導入所需的模組
var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs"); // Node.js內建的檔案系統模組
var dataFileName = "./data.json";
var databook = "./bookinfo.json";
const uuid = require("uuid"); //uuid模組 製造唯一的序號用
const router = express.Router(); //路由模組

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

// 這邊重寫一個指令存放到指定的JSON
app.post("/order/create", function (req, res) {
  var data = fs.readFileSync("./bookinfo.json");
  var orderList = JSON.parse(data);

  if (!Array.isArray(orderList)) {
    orderList = []; // 如果不是陣列，初始化為空组
  }
  //  uuid 唯一的ticket
  const vicetid = uuid.v1();
  var order = {
    vicketId: vicetid,
    bookdate: Date(),
    orderId: new Date().getTime(), // 使用當前時間作訂單ID
    name: req.body.name,
    gender: req.body.gender,
    email: req.body.email,
    address: req.body.address,
    cardNumber: req.body.cardNumber,
    expirationDate: req.body.expirationDate,
    cvv: req.body.cvv,
    total_price: req.body.total_price,
    flightInfo: req.body.flightInfo,
    AD: req.body.AD,
    CH: req.body.CH,
    BA: req.body.BA,
    ticketype: req.body.ticketype,
    cabintype_1: req.body.cabintype_1,
    cabintype_2: req.body.cabintype_2,
    // 寫入需要資訊
  };

  orderList.push(order);

  // 将更新后的訂單列表重新写入到文件中
  fs.writeFileSync("./bookinfo.json", JSON.stringify(orderList, null, 2));
  // 回應給客戶端
  res.json({ message: "訂單創建成功", order: order });
});

// 取得訂票資訊
app.get("/order/book/:id", function (req, res) {
  var data = fs.readFileSync("./bookinfo.json"); // 讀取儲存航班資料的JSON文件
  var BOOKList = JSON.parse(data); // 解析JSON數據，將其轉換為JavaScript對象
  var bookId = req.params.id; // 取得從HTTP請求中傳遞的目的地代碼參數
  var selectedOrder = BOOKList.find(
    (order) => order.vicketId === bookId || order.orderId.toString() === bookId
  );

  if (selectedOrder) {
    res.json(selectedOrder);
  } else {
    res.status(404).send("No flights to the specified destination found.");
  }
});

// 給一個亂數卡號
const usedCardIDs = [];

function generateUniqueCardID() {
  // 生成一个6位数的随机卡号
  const cardID = Math.floor(Math.random() * 900000) + 100000;

  // 检查是否已经存在，如果存在重新生成
  if (usedCardIDs.includes(cardID)) {
    return generateUniqueCardID();
  }

  // 将新生成的卡号加入已使用列表
  usedCardIDs.push(cardID);

  return cardID.toString();
}

// 註冊的資料傳輸

app.post("/registe/post", function (req, res) {
  // 獲取 req前端 所取得的訊息
  var userData = {
    userfirstname: req.body.userfirstname,
    userlastname: req.body.userlastname,
    userchfname: req.body.userchfname,
    userchname: req.body.userchname,
    gender: req.body.gender,
    password: req.body.password,
    email: req.body.email,
    birth: req.body.birth,
    phone: req.body.phone,
    cardID: generateUniqueCardID(), // 使用生成的卡号
  };

  //儲存到json文件
  var data = fs.readFileSync("user.json");
  var users = JSON.parse(data);

  if (!Array.isArray(users)) {
    users = []; // 如果不是陣列，初始化為空陣列
  }
  users.push(userData);
  // 将更新后的用户信息保存回文件
  fs.writeFileSync("user.json", JSON.stringify(users, null, 2));

  // 返回注册成功或失败的响应
  res.json({ message: "註冊成功" }); // 或其他响应
});

// 登入
app.get("/login", function (req, res) {
  var data = fs.readFileSync("user.json");
  var users = JSON.parse(data);
  // 从前端请求中获取值
  var username = req.query.username;
  var password = req.query.password;

  // 在用户数组中查找匹配的用户
  var user = users.find((u) => u.email === username && u.password === password);

  if (user) {
    // 如果用户名和密码匹配，返回成功响应
    res.json({ success: true, user: user });
  } else {
    // 如果用户名和密码不匹配，返回失败响应
    res.json({ success: false, message: "不存在的帳號或密碼" });
  }
});

// 會員資料讀取
app.get("/membership", function (req, res) {
  var data = fs.readFileSync("./user.json");
  var users = JSON.parse(data);
  var username = req.query.username;
  // 在用户数组中查找匹配的用户
  var user = users.find((u) => u.email === username);
  if (user) {
    res.json({ success: true, user: user });
  } else {
    console.log("發生預期外的錯誤");
  }
});

// 自己寫的
app.put("/profileChange", function (req, res) {
  var data = fs.readFileSync("user.json");
  var users = JSON.parse(data);
  var username = req.body.email;

  var userfind = users.find((u) => u.email === username);
  if (userfind) {
    // 找到匹配的用户，替换整个用户对象为请求中的数据
    userfind.userfirstname = req.body.userfirstname || userfind.userfirstname;
    userfind.userlastname = req.body.userlastname || userfind.userlastname;
    userfind.userchfname = req.body.userchfname || userfind.userchfname;
    userfind.userchname = req.body.userchname || userfind.userchname;
    userfind.email = req.body.email || userfind.email;
    userfind.phone = req.body.phone || userfind.phone;
    userfind.password = req.body.password || userfind.password;

    fs.writeFileSync("user.json", JSON.stringify(users, null, "\t"));
    res.json({ success: true, message: "個人資料更新成功" });
  } else {
    // 用户名和密码不匹配，返回失败响应
    res.json({ success: false, message: "更新失敗" });
  }
});
