import { type Interaction } from "discord.js";
const { Collection, Events, MessageFlags } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    try {
      console.log("Modal submitted:", interaction);
      await interaction.reply({
        content: "Your submission was received successfully!",
      });
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
