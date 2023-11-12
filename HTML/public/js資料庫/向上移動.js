// 當 DOM 完全載入後執行
document.addEventListener("DOMContentLoaded", function () {
  // 獲取返回頂部按鈕的元素
  var mybutton = document.getElementById("smart");

  // 當用戶滾動頁面時執行函數
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    // 如果頁面向下滾動超過 100px，顯示按鈕
    if (
      document.body.scrollTop > 30 ||
      document.documentElement.scrollTop > 30
    ) {
      mybutton.style.display = "block";
    } else {
      // 如果頁面滾動回頂部，隱藏按鈕
      mybutton.style.display = "none";
    }
  }
});
