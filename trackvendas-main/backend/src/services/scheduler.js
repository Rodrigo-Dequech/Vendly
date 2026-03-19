import cron from "node-cron";
import { runSalesImport } from "./salesImportService.js";

export function startSalesImportScheduler() {
  const url = process.env.SALES_IMPORT_URL;
  if (!url) {
    console.log("Sales import disabled (SALES_IMPORT_URL not set)");
    return;
  }

  const schedule = process.env.SALES_IMPORT_CRON || "*/15 * * * *";
  cron.schedule(schedule, async () => {
    try {
      const res = await runSalesImport();
      if (!res.skipped) console.log(`Sales import ok: ${res.count} records`);
    } catch (err) {
      console.error("Sales import failed", err);
    }
  });

  console.log(`Sales import scheduled: ${schedule}`);
}
