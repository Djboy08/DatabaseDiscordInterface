export function getBan(db: any, userId: string) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("Bans");
    console.log("Searching for ban with UserID:", userId);
    console.log(collection);
    let g = collection.find({
      UserID: userId,
    });
    console.log(g);
  });
}
