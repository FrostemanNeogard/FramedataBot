import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { COLORS, EMBED_FIELDS } from "../util/config";
import { DiscordEmbedResponse } from "../types/responses";
import { existsSync } from "fs";
import * as path from "path";
import { MoveNotFoundError } from "../exceptions/similarMoves";
import { TekkenAttackData } from "../types/framedata";
import { generateInputString } from "../util/helper";

export class FramedataService {
  private readonly zeroWidthSpace: string = "​";
  private readonly BASE_API_URL?: string = process.env.BASE_API_URL;

  async getFramedataEmbed(
    character: string,
    inputs: string,
    gameCode: string
  ): Promise<DiscordEmbedResponse> {
    const characterCodeResponse = await this.getCharacterCodeResponse(
      gameCode,
      character
    );

    if (characterCodeResponse == null) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription(
          "An error ocurred when attempting to fetch framedata. Please try again later."
        )
        .setColor(COLORS.danger);
      console.log(`Couldn't fetch API.`);
      return {
        embeds: [errorEmbed],
      };
    }

    const characterCodeData = await characterCodeResponse.json();

    if (characterCodeData.statusCode == 404) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription(
          `Couldn't find the character "${character}" for the given game.`
        )
        .setColor(COLORS.danger);
      return { embeds: [errorEmbed] };
    }

    const characterCode = characterCodeData.characterCode;

    const validInputCategory = this.checkForAttackCategory(inputs);
    console.log("Input category:", validInputCategory);
    if (validInputCategory != null) {
      const categoryAttacks = await this.getAttacksByCategory(
        gameCode,
        characterCode,
        validInputCategory
      );

      if (categoryAttacks == null) {
        const errorEmbed = new EmbedBuilder()
          .setTitle("ERROR")
          .setDescription(
            "An error ocurred when attempting to fetch framedata. Please try again later."
          )
          .setColor(COLORS.danger);
        console.log(`ERROR: Couldn't fetch move categories.`);
        return {
          embeds: [errorEmbed],
        };
      }

      const allAttacksOfCategoryEmbed = new EmbedBuilder()
        .setTitle(
          `${characterCode.toUpperCase()} ${validInputCategory.toUpperCase()} MOVES`
        )
        .setDescription(
          categoryAttacks
            .map((item, index) => `**${index + 1}.** ${item}`)
            .join("\n")
        )
        .setColor(COLORS.success);
      return { embeds: [allAttacksOfCategoryEmbed] };
    }

    const response = await this.getFramedataResponse(
      characterCode,
      gameCode,
      inputs
    );

    if (response == null) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription(
          "An error ocurred when attempting to fetch framedata. Please try again later."
        )
        .setColor(COLORS.danger);
      console.log(`Couldn't fetch data at all.`);
      return {
        embeds: [errorEmbed],
      };
    }

    const data = await response.json();

    if (response.status == 400) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription(data.message)
        .setColor(COLORS.danger);
      console.log(`An API error ocurred: ${data.message}`);
      return {
        embeds: [errorEmbed],
      };
    }

    if (response.status == 404) {
      const similarMoveNames =
        data.similar_moves
          .map(
            (move: { [key: string]: any }, index: number) =>
              `**${index + 1}:** ${move.input}`
          )
          .join("\n") ?? "None found";

      const warningEmbed = new EmbedBuilder()
        .setTitle(`Attack not found: ${inputs}`)
        .setFields({
          name: "Similar Moves:",
          value: similarMoveNames.length > 0 ? similarMoveNames : "None found.",
        })
        .setColor(COLORS.warning);
      console.log(`Sending "Similar Moves" embed for ${character}'s ${inputs}`);
      throw new MoveNotFoundError(
        gameCode,
        characterCode,
        warningEmbed,
        data.similar_moves
      );
    }

    const {
      name,
      input,
      hit_level,
      damage,
      startup,
      block,
      hit,
      counter,
      notes,
    } = data[0];

    const characterThumbnail = await this.getCharacterThumbnail(
      characterCode,
      gameCode
    );

    var responseEmbed = this.createFramedataEmbed(
      {
        input,
        name,
        hit_level,
        damage,
        startup,
        block,
        hit,
        counter,
        notes,
      },
      character,
      characterThumbnail
    );

    if (!characterThumbnail) {
      return { embeds: [responseEmbed] };
    }

    return { embeds: [responseEmbed], files: [characterThumbnail] };
  }

  private async getAttacksByCategory(
    gameCode: string,
    characterCode: string,
    validInputCategory: string
  ): Promise<string[] | null> {
    const response = await fetch(
      `${this.BASE_API_URL}framedata/${gameCode}/${characterCode}/categories/${validInputCategory}`
    );

    if (response == null || response.status != 200) {
      return null;
    }

    return response.json();
  }

  private checkForAttackCategory(input: string) {
    const attackCategories = {
      powercrush: ["powercrush", "pc", "power crush", "powercrushes", "armor"],
      homing: ["homing"],
      throw: ["throw", "throws"],
      parry: ["parry", "sabaki", "parries"],
    };

    for (const [key, values] of Object.entries(attackCategories)) {
      if (values.includes(input.toLowerCase())) {
        return key;
      }
    }

    return null;
  }

  public createFramedataEmbed(
    attackData: TekkenAttackData,
    characterName: string,
    thumbnailImage: AttachmentBuilder | null
  ) {
    const {
      name,
      input,
      hit_level,
      damage,
      startup,
      block,
      hit,
      counter,
      notes: unfilteredNotes,
    } = attackData;
    const notes = unfilteredNotes.filter((i) => i != "");
    const inputString = generateInputString(input, name);
    const responseEmbed = new EmbedBuilder()
      .setTitle(characterName.toUpperCase())
      .setDescription(inputString)
      .setColor(COLORS.success)
      .setFooter({ text: EMBED_FIELDS.footer })
      .setFields(
        {
          name: "Hit Level",
          value: this.validateEmbedFieldValue(hit_level),
          inline: true,
        },
        {
          name: "Damage",
          value: this.validateEmbedFieldValue(damage),
          inline: true,
        },
        {
          name: "Startup",
          value: this.validateEmbedFieldValue(startup),
          inline: true,
        },
        {
          name: "Block",
          value: this.validateEmbedFieldValue(block),
          inline: true,
        },
        { name: "Hit", value: this.validateEmbedFieldValue(hit), inline: true },
        {
          name: "Counter",
          value: this.validateEmbedFieldValue(counter),
          inline: true,
        }
      );

    if (!!thumbnailImage) {
      responseEmbed.setThumbnail(
        encodeURI(`attachment://${thumbnailImage.name}`)
      );
    }

    if (notes.length > 0) {
      console.log(`Adding ${notes.length} notes`);
      responseEmbed.addFields({
        name: "Notes",
        value: this.validateEmbedFieldValue(`- ${notes.join("\n- ")}`),
        inline: true,
      });
    }

    return responseEmbed;
  }

  public async getCharacterThumbnail(characterCode: string, gameCode: string) {
    const imageFilePath = path.join(
      __dirname,
      `../images/${gameCode}/${characterCode}.png`
    );
    const fileExists = existsSync(imageFilePath);
    if (fileExists) {
      console.log(`Found image for character ${characterCode}.`);
      return new AttachmentBuilder(imageFilePath, {
        name: `${characterCode}.png`,
      });
    }

    return null;
  }

  private async getCharacterCodeResponse(gameCode: string, character: string) {
    try {
      return await fetch(
        `${
          this.BASE_API_URL
        }charactercodes/${gameCode}/${character.toLowerCase()}`
      );
    } catch (err) {
      console.error(`An error ocurred when fetching character code: ${err}`);
      return null;
    }
  }

  private async getFramedataResponse(
    characterCode: any,
    gameCode: string,
    inputs: string
  ) {
    try {
      return await fetch(
        `${this.BASE_API_URL}framedata/${gameCode}/${characterCode}/moves/${inputs}`
      );
    } catch (err) {
      console.error(`An error ocurred when fetching framedata: ${err}`);
      return null;
    }
  }

  private validateEmbedFieldValue(input: string): string {
    if (!input || input.length <= 0) {
      return this.zeroWidthSpace;
    }
    return input;
  }
}
