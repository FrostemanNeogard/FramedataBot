import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { FramedataService } from "../service/framedataService";

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
  fd7(
    @SlashOption(fdCommandCharacterOption)
    character: string,
    @SlashOption(fdCommandAttackOption)
    input: string,
    interaction: CommandInteraction
  ): void {
    this.framedataService
      .getFramedataEmbed(character, input, "tekken7")
      .then((response) => interaction.reply(response));
  }

  @Slash(fd8Command)
  fd8(
    @SlashOption(fdCommandCharacterOption)
    character: string,
    @SlashOption(fdCommandAttackOption)
    input: string,
    interaction: CommandInteraction
  ): void {
    this.framedataService
      .getFramedataEmbed(character, input, "tekken8")
      .then((response) => interaction.reply(response));
  }
}
