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
  ["evaluations", "id"],
  ["product_events", "id"],
  ["comparison_feedback", "id"],
  ["research_sessions", "id"],
  ["research_priorities", "id"],
  ["app_admins", "user_id"],
];

for (const [table, column] of tables) {
  const { data, error } = await client.from(table).select(column).limit(3);
  if (error) {
    console.log(`${table} ERROR ${error.code} ${error.message}`);
  } else {
    console.log(`${table} VISIBLE_ROWS ${data.length}`);
  }
}
