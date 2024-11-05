import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
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
    const similarMovesEmbed = e.getEmbed();
    const similarMoves = e.getSimilarMoves();

    const row: any = new ActionRowBuilder();
    for (let i = 0; i < similarMoves.length; i++) {
      const buttonComponent = new ButtonBuilder()
        .setCustomId((i + 1).toString())
        .setLabel((i + 1).toString())
        .setStyle(ButtonStyle.Primary);
      row.addComponents(buttonComponent);
    }

    const response = await interaction.editReply({
      embeds: [similarMovesEmbed],
      components: [row],
    });

    const collectorFilter = (i: any) => i.user.id == interaction.user.id;

    try {
      const confirmation: any = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });
      const selectedValue = Number(confirmation.customId);

      if (selectedValue < 1 || selectedValue > similarMoves.length) {
        confirmation.update({ content: "Invalid selection.", components: [] });
        return;
      }

      const attackData = similarMoves[selectedValue - 1];
      const thumbnailImage = await this.framedataService.getCharacterThumbnail(
        e.getCharacterCode(),
        e.getGameCode()
      );
      const responseEmbed = this.framedataService.createFramedataEmbed(
        attackData,
        e.getCharacterCode(),
        thumbnailImage
      );

      await confirmation.update({
        embeds: [responseEmbed],
        files: [thumbnailImage],
        components: [],
      });
    } catch {
      const timeUpEmbed = similarMovesEmbed.setFooter({
        text: `No decision was made by the time this expired.`,
      });
      await interaction.editReply({ embeds: [timeUpEmbed], components: [] });
    }
  }
}
