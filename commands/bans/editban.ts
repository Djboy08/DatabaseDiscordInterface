const { getBan } = require("../../database-helper");

const {
  SlashCommandBuilder,
  LabelBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
} = require("discord.js");

module.exports = {
  roleNeeded: "418694554674266113",
  data: new SlashCommandBuilder()
    .setName("editban")
    .setDescription("Opens up a modal to edit a ban for a user.")
    .addStringOption((option: any) =>
      option.setName("user").setDescription("Username or Userid"),
    ),
  async execute(interaction: any) {
    const userid =
      interaction.options.getString("user") ?? "No userID Provided";
    console.log(userid);
    let ban = await getBan(interaction.client.db, userid);
    console.log("Ban found:", ban);
    const modal = new ModalBuilder()
      .setCustomId("editBanModal")
      .setTitle("Ban Edit Form");
    const userInput = new TextInputBuilder()
      .setCustomId("userInput")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("User ID/Username")
      .setRequired(true);
    const userLabel = new LabelBuilder()
      .setLabel("User ID/Username")
      .setDescription("User to ban")
      .setTextInputComponent(userInput);
    const unbanDateInput = new TextInputBuilder()
      .setCustomId("unbanDateInput")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("5D, 12H, 1Y, etc. Leave blank for permanent ban.")
      .setRequired(false);
    const unbanLabel = new LabelBuilder()
      .setLabel("When should the ban be lifted?")
      .setDescription("Unban Date")
      .setTextInputComponent(unbanDateInput);
    const reasonInput = new TextInputBuilder()
      .setCustomId("reasonInput")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("exploiting, abusing, etc.");

    const reasonLabel = new LabelBuilder()
      .setLabel("What is the reason for the ban?")
      .setDescription("Ban reason")
      .setTextInputComponent(reasonInput);

    const proofInput = new TextInputBuilder()
      .setCustomId("proofInput")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Links, etc.");

    const proofLabel = new LabelBuilder()
      .setLabel("What is the proof for the ban?")
      .setDescription("Proof")
      .setTextInputComponent(proofInput);

    modal.addLabelComponents(userLabel);
    modal.addLabelComponents(unbanLabel);
    modal.addLabelComponents(reasonLabel);
    modal.addLabelComponents(proofLabel);

    await interaction.showModal(modal);
  },
};
