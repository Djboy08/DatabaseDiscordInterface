const { getBan } = require("../../database-helper");

const {
  SlashCommandBuilder,
  LabelBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  TextDisplayBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  roleNeeded: "987036412027240518",
  //   data: new SlashCommandBuilder()
  //     .setName("editban")
  //     .setDescription("Opens up a modal to edit a ban for a user.")
  //     .addStringOption((option: any) =>
  //       option.setName("userid").setDescription("Roblox UserID"),
  //     ),
  async execute(interaction: any) {
    // Get UserID from the modal submitter
    const userid = interaction.user.id;
    // Check if they have the role needed
    if (!interaction.member.roles.cache.has(this.roleNeeded)) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        flags: 1 << 6, // Ephemeral
      });
      return;
    }
  },
};
function formatUnbanDate(UnbanDate: any): string {
  const durationRegex = /(\d+)([DHMYS])/;
  const match = UnbanDate.toString().match(durationRegex);
  if (!match) return "";

  const value = parseInt(match[1]);
  const unit = match[2];

  const now = new Date();
  let unbanDate = new Date(now);

  switch (unit) {
    case "D":
      unbanDate.setDate(now.getDate() + value);
      break;
    case "H":
      unbanDate.setHours(now.getHours() + value);
      break;
    case "M":
      unbanDate.setMinutes(now.getMinutes() + value);
      break;
    case "S":
      unbanDate.setSeconds(now.getSeconds() + value);
      break;
    case "Y":
      unbanDate.setFullYear(now.getFullYear() + value);
      break;
  }

  return unbanDate.toISOString();
  if (!UnbanDate) return "";
  const date = new Date(UnbanDate);
  return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
}
