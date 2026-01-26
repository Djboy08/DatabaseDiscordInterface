export function getBan(db: any, userId: string) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("Bans");
    collection
      .find({
        UserID: userId,
      })
      .toArray((err: any, docs: any) => {
        resolve(docs);
      });
  });
}
