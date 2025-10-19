import express from "express";
import cors from "cors";
import { callLambda } from "./invokeLambda.js";

const app = express();
app.use(cors());
app.use(express.json());

// Example route for /checkTrial
app.post("/checkTrial", async (req, res) => {
  try {
    const result = await callLambda("CheckTrial", req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Lambda invocation failed" });
  }
});

// Example route for /checkInteractions
app.post("/checkInteractions", async (req, res) => {
  try {
    const result = await callLambda("CheckInteractions", req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Lambda invocation failed" });
  }
});

app.listen(5001, () => console.log("Backend running on port 5001"));
