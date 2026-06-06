const express = require("express");
const app = express();

app.use(express.json());

const WHOP_API_KEY = process.env.WHOP_API_KEY;
const WHOP_COMPANY_ID = process.env.WHOP_COMPANY_ID;

app.get("/", (req, res) => res.send("Running"));

app.post("/charge", async (req, res) => {
  try {
    console.log("Body received:", JSON.stringify(req.body));

    const { member_id, payment_method_id, amount } = req.body;

    const response = await fetch("https://api.whop.com/api/v5/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHOP_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        company_id: WHOP_COMPANY_ID,
        member_id: member_id,
        payment_method_id: payment_method_id,
        plan: {
          currency: "usd",
          initial_price: Number(amount) || 1,
          plan_type: "one_time"
        }
      })
    });

    const text = await response.text();

console.log("Whop status:", response.status);
console.log("Whop raw response:", text);
    
res.status(response.status).send(text);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port " + PORT));
