import { ArgsOf, Discord, On } from "discordx";
import "dotenv/config";
import { FramedataService } from "../service/framedataService";
const { CLIENT_ID } = process.env;

@Discord()
export class EventListener {
  private readonly framedataService: FramedataService;

  constructor() {
    this.framedataService = new FramedataService();
  }

  @On({
    event: "messageCreate",
  })
  onMessage([message]: ArgsOf<"messageCreate">) {
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
      }" \n\b at: ${new Date().toLocaleDateString()}\n`
    );
    this.framedataService
      .getFramedataEmbed(character, inputs, "tekken8")
      .then((response) => message.reply(response));
  }
}
