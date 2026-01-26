export async function getBan(db: any, userId: string) {
  const collection = db.collection("Bans");
  let result = await collection.findOne({
    UserID: userId.toString(),
  });
  return result;
}
