import { ArgsOf, Client, Discord, On, Once } from "discordx";
import "dotenv/config";
import { FramedataService } from "../service/framedataService";
import { Events } from "discord.js";
const { CLIENT_ID } = process.env;

@Discord()
export class EventListener {
  private readonly framedataService: FramedataService;

  constructor() {
    this.framedataService = new FramedataService();
  }

  @On({ event: Events.InteractionCreate })
  onInteractionCreate(
    [interaction]: ArgsOf<Events.InteractionCreate>,
    client: Client
  ) {
    console.log(
      `\nCommand: "${interaction.toString()}"\n\b was run by: "${
        interaction.user.globalName
      }" \n\b in channel: "${interaction.channelId}" \n\b in server: "${
        interaction.guild?.name
      }" \n\b at: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`
    );
    try {
      client.executeInteraction(interaction);
    } catch (e) {
      console.log(
        "An error ocurred when attempting to execute an interaction:",
        e
      );
    }
  }

  @Once({ event: Events.ClientReady })
  async onReady([_args]: ArgsOf<Events.ClientReady>, client: Client) {
    await client.initApplicationCommands();
    console.log(`Commands have been updated for ${client.user?.username}.`);
  }

  @On({
    event: Events.MessageCreate,
  })
  onMessage([message]: ArgsOf<"messageCreate">, client: Client) {
    if (!message.content.startsWith(`<@${CLIENT_ID}>`)) return;
    const args = message.content.split(" ");
    while (args.includes("")) {
      args.splice(args.indexOf(""), 1);
    }
    if (args.length <= 2) {
      message.reply(
        `Please provide a character and an attack notation separated by spaces.`
      );
      return;
    }
    const character = args[1];
    const inputs = args.slice(2, args.length).join(" ");

    console.log(
      `\nShortcut: "/fd8 character:${character} move:${inputs} "\n\b was run by: "${
        message.member?.displayName
      }" \n\b in channel: "${message.guildId}" \n\b in server: "${
        message.guild?.name
      }" \n\b at: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`
    );

    if (
      !client.guilds.cache
        .get(message.guildId ?? "")
        ?.members.me?.permissionsIn(message.channelId)
        .has("SendMessages")
    ) {
      console.log("Missing permissions to send message, aborting");
      return;
    }

    try {
      this.framedataService
        .getFramedataEmbed(character, inputs, "tekken8")
        .then((response) => message.reply(response));
    } catch (e) {
      console.log(
        "An error ocurred when attempting to execute 'fd8' shortcut:",
        e
      );
    }
  }
}
