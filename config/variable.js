module.exports.pathAdmin = "admin";
module.exports.paymentMethod = [
  {
    label: "Thanh toán tiền mặt",
    value: 'money'
  },
  {
    label: "Thanh toán qua ví momo",
    value: 'momo'
  }, {
    label: "Thanh toán chuyển khoản",
    value: 'bank'
  }
]
module.exports.paymentStatus = [
  {
    label: "Chưa thanh toán",
    value: 'unpaid'
  },
  {
    label: "Đã thanh toán ",
    value: 'paid'
  }
]
module.exports.status = [
  {
    label: "Khởi tạo",
    value: 'initial'
  },
  {
    label: "Hoàn thành ",
    value: 'done'
  }
  ,
  {
    label: "Hủy ",
    value: 'cancel'
  }
]