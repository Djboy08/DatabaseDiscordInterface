export async function getBan(db: any, userId: string) {
  const collection = db.collection("Bans");
  let result = await collection.findOne({
    UserID: userId.toString(),
  });
  return result;
}

export async function updateBan(db: any, banData: any) {
  let Length = banData.Length < 1 ? Math.round(banData.Length) : banData.Length;
  const collection = db.collection("Bans");
  let UnbanDate = new Date();
  UnbanDate.setMinutes(UnbanDate.getMinutes() + Length);
  let result = await collection.updateOne(
    {
      UserID: banData.UserID,
    },
    {
      $set: {
        UserID: banData.UserID,
        Banned: banData.Banned,
        Length: banData.Length,
        Reason: banData.Reason,
        UnbanDate: banData.UnbanDate,
        Date: new Date(),
        AdminID: banData.AdminID,
        Proof: banData.Proof,
        TestUniverse: banData.TestUniverse,
      },
    },
    {
      upsert: true,
    },
  );

  return result;
}
