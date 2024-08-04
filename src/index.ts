import "dotenv/config";
import { Events, IntentsBitField, Interaction } from "discord.js";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";
import { time } from "console";

const { TOKEN, DEV, TEST_GUILD_ID } = process.env;

const client = new Client({
  botId: "test",
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
  botGuilds: DEV ? [TEST_GUILD_ID ?? ""] : undefined,
});

client.once(Events.ClientReady, async () => {
  await client.initApplicationCommands();
  console.log(`${client.user?.username} is now online!`);
});

client.on(Events.InteractionCreate, (interaction: Interaction) => {
  console.log(
    `\nCommand: "${interaction.toString()}"\n\bwas run by: "${
      interaction.user.globalName
    }" \n\bin channel: "${interaction.channelId}" \n\bin server: "${
      interaction.guild?.name
    }" \n\bat: ${new Date().toLocaleDateString()}\n`
  );
  client.executeInteraction(interaction);
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
