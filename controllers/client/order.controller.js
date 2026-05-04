const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model")
const City = require('../../models/city.model')
const generateHelper = require('../../helpers/generate.helper')
const variableHelper = require('../../config/variable')
const moment = require('moment')
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
module.exports.createPost = async (req, res) => {

  try {
    req.body.orderCode = "OD" + generateHelper.generateRandomNumber(10)
    for (const item of req.body.items) {
      const infoTour = await Tour.findOne({
        _id: item.tourId,
        deleted: false,
        status: "active"
      })
      if (infoTour) {
        item.priceNewAdult = infoTour.priceNewAdult;
        item.priceNewChildren = infoTour.priceNewChildren;
        item.priceNewBaby = infoTour.priceNewBaby;
        item.departureDate = infoTour.departureDate;
        item.avatar = infoTour.avatar;
        item.name = infoTour.name;
        await Tour.updateOne({
          _id: item.tourId
        }, {
          stockAdult: infoTour.stockAdult - item.quantityAdult,
          stockChildren: infoTour.stockChildren - item.quantityChildren,
          stockBaby: infoTour.stockBaby - item.quantityBaby

        })
      }
    }
    req.body.paymentStatus = "unpaid";
    req.body.status = "initial";
    req.body.subTotal = req.body.items.reduce((sum, item) => {
      return sum + (item.priceNewAdult * item.quantityAdult) + (item.priceNewChildren * item.quantityChildren) + (item.priceNewBaby * item.quantityBaby)
    }, 0)
    req.body.discount = 0;
    req.body.total = req.body.subTotal - req.body.discount;
    const newRecord = new Order(req.body)
    await newRecord.save()
    res.json({
      code: "success",
      message: "Đặt hàng thành công!",
      orderId: newRecord.id
    })
  } catch (error) {
    console.log("Có lỗi tại controller order", error)
    res.json({
      code: "error",
      message: "Đặt hàng không thành công!"
    })
  }
}
module.exports.success = async (req, res) => {
  const { orderId, phone } = req.query;
  try {
    const orderDetail = await Order.findOne({
      _id: orderId,
      phone: phone,
      deleted: false
    })
    if (!orderDetail) {
      res.redirect('/')
      return;
    }
    orderDetail.paymentMethodName = variableHelper.paymentMethod.find(item => item.value == orderDetail.paymentMethod).label;
    orderDetail.paymentStatusName = variableHelper.paymentStatus.find(item => item.value == orderDetail.paymentStatus).label;
    orderDetail.statusName = variableHelper.status.find(item => item.value == orderDetail.status).label;
    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("DD/MM/YYYY")
    for (const item of orderDetail.items) {
      const infoTour = await Tour.findOne({
        _id: item.tourId,
        deleted: false
      })

      if (infoTour) {
        item.slug = infoTour.slug;
      }
      const city = await City.findOne({
        _id: item.locationFrom
      })
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY")
      if (city) {
        item.locationFromName = city.name;

      }
    }
    res.render('client/pages/order-success', {
      pageTitle: "Trang đặt hàng thành công",
      orderDetail: orderDetail
    })
  } catch (error) {
    res.redirect('/')
  }
}
module.exports.paymentZalopay = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const orderDetail = await Order.findOne({
      _id: orderId,
      deleted: false,
      paymentStatus: "unpaid"
    })
    if (!orderDetail) {
      res.redirect('/')
      return;
    }
    // APP INFO
    const config = {
      app_id: process.env.ZALOPAY_APPID,
      key1: process.env.ZALOPAY_KEY1,
      key2: process.env.ZALOPAY_KEY2,
      endpoint: `${process.env.ZALOPAY_DOMAIN}/v2/create`
    };

    const embed_data = {
      redirecturl: `${process.env.DOMAIN_WEBSITE}/order/success?orderId=${orderDetail.id}&phone=${orderDetail.phone}`,
      orderId: orderDetail.id // Đính kèm luôn orderId để lát qua Callback lấy cho dễ
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: `${orderDetail.phone}-${orderDetail.id}`,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: orderDetail.total,
      description: `Thanh toán đơn hàng ${orderDetail.orderCode}`,
      bank_code: "",
      callback_url: `${process.env.DOMAIN_WEBSITE}/order/payment-zalopay-result`,
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order })
    // console.log(response.data);
    if (response.data.return_code == 1) {
      res.redirect(response.data.order_url)

    } else {
      console.log("Lỗi tạo đơn ZaloPay:", response.data);
      res.redirect('/')

    }
  } catch (error) {
    console.log("Có lỗi", error)
    res.redirect('/')
  }
}
module.exports.paymentZalopayResultPost = async (req, res) => {
  const config = {
    key2: process.env.ZALOPAY_KEY2
  };
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr);

      // 2. Lấy orderId từ embed_data mình đã truyền lúc tạo
      let embedData = JSON.parse(dataJson.embed_data);
      let orderId = embedData.orderId;

      // 3. Thực hiện Cập nhật DB thực tế
      if (orderId) {
        await Order.updateOne(
          { _id: orderId },
          { paymentStatus: "paid" }
        );
        // console.log(`Đã cập nhật trạng thái thanh toán cho đơn: ${orderId}`);
      }
      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
}