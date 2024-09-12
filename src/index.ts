import "dotenv/config";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";

const { TOKEN, DEV, TEST_GUILD_ID } = process.env;

const client = new Client({
  botId: "test",
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
  botGuilds: DEV ? [TEST_GUILD_ID ?? ""] : undefined,
});

async function start() {
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!TOKEN) {
    throw Error("Could not find TOKEN in your environment");
  }

  console.log("Logging in...");
  await client.login(TOKEN);

  console.log("Logged in!");
}

void start();
