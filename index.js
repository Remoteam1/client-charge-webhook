import express from "express";
import Whop from "@whop/sdk";

const app = express();
app.use(express.json());

const WHOP_API_KEY = process.env.WHOP_API_KEY;
const WHOP_COMPANY_ID = process.env.WHOP_COMPANY_ID;

const whop = new Whop({
  apiKey: WHOP_API_KEY
});

app.get("/", (req, res) => {
  res.send("Running");
});

app.post("/charge", async (req, res) => {
  try {
    console.log("Body received:", JSON.stringify(req.body));

    const { member_id, payment_method_id, amount } = req.body;

    if (!WHOP_API_KEY) {
      return res.status(500).json({
        error: "Missing WHOP_API_KEY in Render environment variables"
      });
    }

    if (!WHOP_COMPANY_ID) {
      return res.status(500).json({
        error: "Missing WHOP_COMPANY_ID in Render environment variables"
      });
    }

    if (!member_id || !payment_method_id || !amount) {
      return res.status(400).json({
        error: "Missing member_id, payment_method_id, or amount"
      });
    }

    const payment = await whop.payments.create({
      company_id: WHOP_COMPANY_ID,
      member_id: member_id,
      payment_method_id: payment_method_id,
      plan: {
        currency: "usd",
        initial_price: Number(amount),
        plan_type: "one_time"
      }
    });

    console.log("Whop SDK payment response:", JSON.stringify(payment));

    res.status(200).json({
      success: true,
      payment: payment
    });
  } catch (err) {
    console.error("Whop SDK error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
      details: err
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
