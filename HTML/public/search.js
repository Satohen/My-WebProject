// 練習js插入

// 載入直接讀資料
$(document).ready(function () {
  // 獲取url資訊來填入
  var urlParams = new URLSearchParams(window.location.search);
  var departure = urlParams.get("departure");
  var destination = urlParams.get("destination");
  var goto = urlParams.get("goto");
  var go_datetime = urlParams.get("go_datetime");

  $("#input_go").val(departure);
  $("#input_back").val(destination);
  $("#datePicker").val(go_datetime);

  $("#th_date").text($("#datePicker").val());
  $("#datePicker").trigger("change");
  $("#th_go").text($("#input_go").val());
  $("#th_back").text($("#input_back").val());

  // 日期等資訊 置入表格當title

  $("#datePicker").on("change", function () {
    $("#th_date").text($("#datePicker").val());
  });
  $("#input_go").on("change", function () {
    $("#th_go").text($("#input_go").val());
  });
  $("#input_back").on("change", function () {
    $("#th_back").text($("#input_back").val());
  });
});
