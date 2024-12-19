// app.post("/addEntry", (req, res) => {
//   req.body.likes = 0
//   entriesCollection
//     .insertOne(req.body)
//     .then((result) => {
//       console.log(result)
//       res.redirect("/")
//     })
//     .catch((error) => console.error(error))
// })

// app.put("/addOneLike", (req, res) => {
//   entriesCollection
//     .updateOne(
//       {
//         commonName: req.body.commonNameS,
//         date: req.body.dateS,
//         likes: req.body.likesS,
//       },
//       {
//         $set: {
//           likes: req.body.likesS + 1,
//         },
//       },
//       {
//         sort: { _id: -1 },
//         upsert: false,
//       }
//     )
//     .then((result) => {
//       console.log("Added One Like")
//       res.json("Like Added")
//     })
//     .catch((error) => console.log(error))
// })

// app.delete("/deleteEntry", (req, res) => {
//   entriesCollection
//     .deleteOne({ commonName: req.body.commonNameS })
//     .then((result) => {
//       console.log("Entry Deleted")
//       res.json("Entry Deleted")
//     })
//     .catch((error) => console.error(error))
// })