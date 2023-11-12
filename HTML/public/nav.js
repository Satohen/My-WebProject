$(document).ready(function () {
  //檢查是否登入 並給予名字(其他頁面需要)
  var currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    // 用户已登录，显示用户名
    console.log("用戶已登入:", currentUser.userchfname);
    var genderTtitle = currentUser.gender === "男" ? "先生" : "女士";
    var userLoginName = currentUser.userchfname + genderTtitle;
    $("#toLogin").css("visibility", "hidden");
    $("#loginop").css("visibility", "visible");
    $("#username").text(userLoginName);
  } else {
    // 用户未登录
    console.log("未登入狀態");
    $("#toLogin").css("visibility", "visible"); // 显示登录按钮
    $("#loginop").css("visibility", "hidden");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // 获取页面元素
  var userInfo = document.getElementById("user-info");
  var dropdownContent = document.getElementById("dropdown-content");
  var profileLink = document.getElementById("profile-link");
  var logoutLink = document.getElementById("logout-link");

  // 假设用户已登录，设置用户名
  var username = localStorage.getItem("username");

  if (username) {
    document.getElementById("username").innerText = username;
  }

  // 用户信息点击事件，显示/隐藏下拉菜单
  userInfo.addEventListener("click", function () {
    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
  });

  // 会员页面链接点击事件
  profileLink.addEventListener("click", function () {
    // 如果用户已登录，重定向到会员页面

    window.location.href = "./membership.html";
  });

  // 登出链接点击事件
  logoutLink.addEventListener("click", function () {
    // 清除登录状态和用户名
    localStorage.removeItem("currentUser");

    // 重定向到登录页面
    window.location.href = "./login.html";
  });
});
