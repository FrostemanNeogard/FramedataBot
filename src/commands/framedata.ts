import {
  CacheType,
  CommandInteraction,
  ReactionCollectorOptions,
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
      if (e instanceof MoveNotFoundError) {
        this.handleSimilarMoves(e, interaction);
      } else {
        console.log("An unknown error ocurred:", e);
      }
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
        this.handleSimilarMoves(e, interaction);
      } else {
        console.log("An unknown error ocurred:", e);
      }
    }
  }

  private async handleSimilarMoves(
    e: MoveNotFoundError,
    interaction: CommandInteraction<CacheType>
  ) {
    console.log("All data available", e.getSimilarMoves()[0]);

    const similarMovesEmbed = e.getEmbed();
    const similarMoves = e.getSimilarMoves();

    interaction.editReply({ embeds: [similarMovesEmbed] });
    const message = await interaction.fetchReply();

    const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
    for (let i = 0; i < similarMoves.length; i++) {
      message.react(reactions[i]);
    }

    const filter: ReactionCollectorOptions = {
      filter: (reaction: any) => {
        return false;
        // return (
        //   reactions.includes(reaction.emoji.name) &&
        //   user.id === interaction.user.id
        // );
      },
    };

    const collector = message.createReactionCollector(filter);

    setTimeout(async () => {
      const attackData = e.getSimilarMoves()[0];
      console.log("Attackdata", attackData);

      const thumbnailImage = await this.framedataService.getCharacterThumbnail(
        e.getCharacterCode(),
        e.getGameCode()
      );
      const responseEmbed = this.framedataService.createFramedataEmbed(
        attackData,
        e.getCharacterCode(),
        thumbnailImage
      );

      const postSelectionEmbed = similarMovesEmbed;
      postSelectionEmbed.setFooter({
        text: "A selection has already been made.",
      });
      interaction.editReply({ embeds: [postSelectionEmbed] });

      if (!thumbnailImage) {
        interaction.followUp({
          embeds: [responseEmbed],
        });
        return;
      }

      interaction.followUp({
        embeds: [responseEmbed],
        files: [thumbnailImage],
      });
      return;
    }, 2000);
  }
}
