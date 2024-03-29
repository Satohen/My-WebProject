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

  // 將更新後的訂單列表重新寫入到文件中
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
  // 生成6位數的随機卡號
  const cardID = Math.floor(Math.random() * 900000) + 100000;

  // 檢查是否已經存在，如果存在重新生成
  if (usedCardIDs.includes(cardID)) {
    return generateUniqueCardID();
  }
  // 新生成的卡號加入已使用列表
  usedCardIDs.push(cardID);
  return cardID.toString();
}

// 註冊的資料傳輸
var cardID = generateUniqueCardID() // 使用生成的卡號
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
    cardID: cardID,
    mileage: "",
    fligtcount: "",
    ticket: ""
  };

  //儲存到json文件
  var data = fs.readFileSync("user.json");
  var users = JSON.parse(data);

  if (!Array.isArray(users)) {
    users = []; // 如果不是陣列，初始化為空陣列
  }
  users.push(userData);
  // 將更新後的用户信息保存回文件
  fs.writeFileSync("user.json", JSON.stringify(users, null, 2));

  // 返回註冊成功或失敗的回應
  res.json({ message: "註冊成功" }); 
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
    // 如果用户名和密碼符合，返回成功回應
    res.json({ success: true, user: user });
  } else {
    // 如果用户名和密碼不符合，返回失敗回應
    res.json({ success: false, message: "不存在的帳號或密碼" });
  }
});

// 會員資料讀取
app.get("/membership", function (req, res) {
  var data = fs.readFileSync("./user.json");
  var users = JSON.parse(data);
  // query撈取url上ˋ的username
  var username = req.query.username;
  // 在用户中查找符合的用户
  var user = users.find((u) => u.email === username);
  if (user) {
    res.json({ success: true, user: user });
  } else {
    console.log("發生預期外的錯誤");
  }
});


app.put("/profileChange", function (req, res) {
  var data = fs.readFileSync("user.json");
  var users = JSON.parse(data);
  var username = req.body.email;
  var userfind = users.find((u) => u.email === username);
  // var total_mileage = parseInt(userfind.mileage) + parseInt(req.body.mileage);
  // var total_fligtcount = parseInt(userfind.fligtcount)+ parseInt(fligtcount);
  // console.log(total_mileage);

  if (userfind) {
    // 找到符合的用户，替換整用户對象為請求中的數據
    userfind.userfirstname = req.body.userfirstname || userfind.userfirstname;
    userfind.userlastname = req.body.userlastname || userfind.userlastname;
    userfind.userchfname = req.body.userchfname || userfind.userchfname;
    userfind.userchname = req.body.userchname || userfind.userchname;
    userfind.email = req.body.email || userfind.email;
    userfind.phone = req.body.phone || userfind.phone;
    userfind.password = req.body.password || userfind.password;
    // 這裡是買票的訊息 加入里程
    userfind.mileage = (parseInt(userfind.mileage) || 0) + (parseInt(req.body.mileage) || 0);
    userfind.fligtcount = (parseInt(userfind.fligtcount) || 0) + (parseInt(req.body.fligtcount) || 0);
    userfind.ticket = req.body.item || userfind.ticket;

    fs.writeFileSync("user.json", JSON.stringify(users, null, "\t"));
    res.json({ success: true, message: "個人資料更新成功" });
  } else {
    // 用户名和密码不匹配，返回失败响应
    res.json({ success: false, message: "更新失敗" });
  }
});



// 刪除訂單功能
app.delete("/bookinfo/delete", function (req, res) {
  var data = fs.readFileSync("bookinfo.json");
  var bookinfo = JSON.parse(data);
  var bookId = req.body.deleteOID; // 取得從HTTP請求中傳遞的目的地代碼參數
  var bookvid = req.body.deleteVID;

  var selectedOrder = bookinfo.findIndex(
    (order) => order.vicketId === bookvid || order.orderId.toString() === bookId
  );


  console.log(selectedOrder)

  if (selectedOrder !== -1) {
    // 找到了要刪除的訂單，獲取它的索引 
    // 從數組中刪除該訂單
    bookinfo.splice(selectedOrder, 1);


    // 將更新後的數據寫回文件
    fs.writeFileSync("bookinfo.json", JSON.stringify(bookinfo, null, "\t"));

    // 發送成功的回應
    res.send("訂單已刪除");
  } else {
    // 如果找不到要刪除的訂單，返回相應的錯誤信息
    res.status(404).send("找不到指定的訂單");
  }
});
