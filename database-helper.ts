export function getBan(db: any, userId: string) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("Bans");
    console.log("Searching for ban with UserID:", userId);
    console.log(collection);
    collection
      .find({
        UserID: userId,
      })
      .toArray((err: any, docs: any) => {
        console.log(docs);
        resolve(docs);
      });
  });
}
