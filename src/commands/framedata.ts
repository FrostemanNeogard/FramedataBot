import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  User,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { FramedataService } from "../service/framedataService";
import { MoveNotFoundError } from "../exceptions/similarMoves";

const fd7Command = new SlashCommandBuilder()
  .setName("fd7")
  .setDescription("Look up framedata for a given TEKKEN 7 attack");

const fd8Command = new SlashCommandBuilder()
  .setName("fd8")
  .setDescription("Look up framedata for a given TEKKEN 8 attack");

const fdCommandCharacterOption = new SlashCommandStringOption()
  .setName("character")
  .setDescription("Character")
  .setRequired(true);

const fdCommandAttackOption = new SlashCommandStringOption()
  .setName("move")
  .setDescription("Attack")
  .setRequired(true);

@Discord()
export class Framedata {
  private readonly framedataService: FramedataService;

  constructor() {
    this.framedataService = new FramedataService();
  }

  @Slash(fd7Command)
  async fd7(
    @SlashOption(fdCommandCharacterOption)
    character: string,
    @SlashOption(fdCommandAttackOption)
    input: string,
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      await interaction.deferReply();
      const response = await this.framedataService.getFramedataEmbed(
        character,
        input,
        "tekken7"
      );
      interaction.editReply(response);
    } catch (e) {
      console.log("An error ocurred when attempting to execute t7 command:", e);
    }
  }

  @Slash(fd8Command)
  async fd8(
    @SlashOption(fdCommandCharacterOption)
    character: string,
    @SlashOption(fdCommandAttackOption)
    input: string,
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      await interaction.deferReply();
      const response = await this.framedataService.getFramedataEmbed(
        character,
        input,
        "tekken8"
      );
      interaction.editReply(response);
    } catch (e) {
      if (e instanceof MoveNotFoundError) {
        console.log("STart of thing here");
        const similarMovesEmbed = e.getEmbed();
        const similarMoves = e.getSimilarMoves();

        interaction.editReply({ embeds: [similarMovesEmbed] });
        const message = await interaction.fetchReply();

        const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
        for (let i = 0; i < similarMoves.length; i++) {
          message.react(reactions[i]);
        }

        const collectorFilter = (reaction: any, user: User) => {
          return (
            reactions.includes(reaction.emoji.name) &&
            user.id === interaction.user.id
          );
        };

        message
          .awaitReactions({
            filter: collectorFilter,
            max: 1,
            time: 120_000,
            errors: ["time"],
          })
          .then((collectedReactions) => {
            const reaction = collectedReactions.first();

            if (reaction?.emoji.name == "1️⃣") {
              console.log("One!!!!");
              interaction.editReply("Test");
            } else {
              console.log("Idk what happened", reaction?.emoji.name);
              interaction.editReply("Oh no");
            }
          })
          .catch((collectedReactions) => {
            interaction.reply("Something went wrong. Please try again.");
            console.log(
              `Something went wrong when reacting with a ${
                collectedReactions.first()?.emoji.name
              }`
            );
          });

        // switch (collectedReactions.first()?.emoji.name) {
        //   case reactions[0]:
        //     interaction.editReply("Test thing");
        //     break;
        //   default:
        //     message.reply("You reacted with an invalid emoji.");
        //     break;
        // }
      }
    }
  }
}
