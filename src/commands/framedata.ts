import {
  ApplicationCommandOptionType,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import {
  Discord,
  SimpleCommand,
  SimpleCommandMessage,
  Slash,
  SlashOption,
} from "discordx";
import "dotenv/config";
const { CLIENT_ID } = process.env;

@Discord()
export class Framedata {
  @Slash({
    description: `Get framedata for t7`,
  })
  fd7(
    @SlashOption({
      name: `character`,
      description: `Character`,
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    character: string,
    @SlashOption({
      name: `move`,
      description: `Attack`,
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    input: string,
    interaction: CommandInteraction
  ): void {
    const responseEmbed = this.framedata(character, input);
    interaction.reply({ embeds: [responseEmbed] });
    return;
  }

  @Slash({
    description: `Get framedata for t8`,
  })
  fd8(
    @SlashOption({
      name: `character`,
      description: `Character`,
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    character: string,
    @SlashOption({
      name: `move`,
      description: `Attack`,
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    input: string,
    interaction: CommandInteraction
  ): void {
    const responseEmbed = this.framedata(character, input);
    interaction.reply({ embeds: [responseEmbed] });
    return;
  }

  @SimpleCommand({
    aliases: ["fd", "fd8", `<@${CLIENT_ID}>`],
  })
  simpleFramedata(command: SimpleCommandMessage) {
    const args = command.argString.split(" ");
    if (args.length < 2) {
      command.message.reply("oh no");
      return;
    }
    const inputs: string[] = args;
    inputs.shift();
    if (inputs.length < 1) {
      return;
    }
    const responseEmbed = this.framedata(args[0], inputs.join());
    command.message.reply({ embeds: [responseEmbed] });
    return;
  }

  framedata(character: string, inputs: string): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle("Framedata")
      .addFields(
        { name: "Character", value: character },
        { name: "Inputs", value: inputs }
      );
  }
}
