// migrateLikesField.js

const mongoose = require("mongoose")
require('dotenv').config({ path: './config/.env' })

const Entry = require("../models/Entry")

async function migrateLikesToArray() {
  try {
    if (!process.env.DB_STRING) {
      console.error("❌ DB_STRING is not defined in .env")
      process.exit(1)
    }

    await mongoose.connect(process.env.DB_STRING)

    console.log("Connected to MongoDB")

    // Find posts where likes is a number
    const entriesToUpdate = await Entry.find({ likes: { $type: "number" } })

    console.log(`Found ${entriesToUpdate.length} posts to update`)

    const problematic = await Entry.find({ likes: { $type: "string" } });
    console.log(problematic.length, 'entries have likes stored as strings');

    const result = await Entry.updateMany(
      { likes: { $type: 'number' } },
      { $set: { likes: [] } }
    );

    console.log(`✔ ${result.modifiedCount} entry(s) updated`); 

    console.log("Migration complete")
    await mongoose.disconnect()
  } catch (err) {
    console.error("Migration error:", err)
    process.exit(1)
  }
}

migrateLikesToArray()
