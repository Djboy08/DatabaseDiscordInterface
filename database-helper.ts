export function getBan(db: any, userId: string) {
  return new Promise(async (resolve, reject) => {
    const collection = db.collection("Bans");
    let g = await collection.findOne({
      UserID: userId,
    });
    console.log(g);
    resolve(g);
  });
}
