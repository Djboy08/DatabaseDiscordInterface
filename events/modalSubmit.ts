import { type Interaction } from "discord.js";
const { updateBan, sendBanEmbed } = require("../database-helper");
const { Collection, Events, MessageFlags } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    try {
      //   console.log("Modal submitted:", interaction);
      let obj: any = {};
      obj.Banned =
        interaction.fields.getStringSelectValues("isBanned")[0] === "Banned";
      obj.UserID = interaction.fields.getTextInputValue("userInput").trim();
      obj.Reason = interaction.fields.getTextInputValue("reasonInput");
      obj.Proof = interaction.fields.getTextInputValue("proofInput");
      obj.AdminID = interaction.user.id;
      obj.AdminName = interaction.user.tag;
      obj.Length = 0;
      obj.UnbanDate = null;
      obj.TestUniverse = false;
      await updateBan(interaction.client.db, obj);
      console.log("Parsed modal data:", obj);
      await sendBanEmbed(interaction, obj);
      //   await interaction.reply({
      //     content: "Your submission was received successfully!",
      //   });
      //   await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
