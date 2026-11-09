import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anon || url.includes("YOUR_PROJECT")) {
  console.log("CONFIG missing");
  process.exit(2);
}

const client = createClient(url, anon);
const tables = [
  "evaluations",
  "product_events",
  "comparison_feedback",
  "research_sessions",
  "research_priorities",
  "app_admins",
];

for (const table of tables) {
  const { data, error } = await client.from(table).select("id").limit(3);
  if (error) {
    console.log(`${table} ERROR ${error.code} ${error.message}`);
  } else {
    console.log(`${table} VISIBLE_ROWS ${data.length}`);
  }
}
