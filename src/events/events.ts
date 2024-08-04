import { ArgsOf, Discord, On } from "discordx";
import "dotenv/config";
import { Framedata } from "../commands/framedata";
const { CLIENT_ID } = process.env;

@Discord()
export class EventListener {
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
      `\nShortcut: "/fd8 character:${character} move:${inputs} "\n\bwas run by: "${
        message.member?.displayName
      }" \n\bin channel: "${message.guildId}" \n\bin server: "${
        message.guild?.name
      }" \n\bat: ${new Date().toLocaleDateString()}\n`
    );
    Framedata.getFramedataEmbed(character, inputs, "tekken8").then((response) =>
      message.reply(response)
    );
  }
}
