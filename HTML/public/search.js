// 練習js插入

// 日期等資訊 置入表格當title
$("#datePicker").on("change", function () {
    $("#th_date").text($("#datePicker").val())
  })
  $("#input_go").on("change", function () {
    $("#th_go").text($("#input_go").val())
  })
  $("#input_back").on("change", function () {
    $("#th_back").text($("#input_back").val())
  })





