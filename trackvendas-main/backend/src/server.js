import dotenv from "dotenv";
import app from "./app.js";
import { startSalesImportScheduler } from "./services/scheduler.js";

dotenv.config();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

startSalesImportScheduler();
