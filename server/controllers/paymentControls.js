const RazorPay = required("razorpay");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const razorPay = new RazorPay({
  key_id: process.env.RZR_PUB_KEY,
  key_secret: process.env.RZR_SEC_KEY,
});

exports.orderPlacing = async (req, res, next) => {
  try {
    let options = {
      amount: 500 * 100,
      currency: "INR",
    };
    razorPay.orders.create(options, (error, order) => {
      console.log(order);
      res.status(201).json(order);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.orderCheck = async (req, res, next) => {
  try {
    razorPay.payments.fetch(req.body.razorpay_payment_id).then((response) => {
      if (response.status === "captured") {
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
