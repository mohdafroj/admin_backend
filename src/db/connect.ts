
import mongoose from "mongoose"
import 'dotenv/config'
const adminDbMongoUri: any = process.env.MONGODB_URI_ADMIN
const primaryDbMongoUri: any = process.env.MONGODB_URI
const mdmDbMongoUri: any = process.env.MONGODB_URI_MDM
const primaryDB = mongoose.createConnection(primaryDbMongoUri)

const adminDB = mongoose.createConnection(adminDbMongoUri)

const mdmDB = mongoose.createConnection(mdmDbMongoUri)

// Event listeners for primaryDB
primaryDB.on("connected", () => {
  console.log("primaryDB connected successfully")
})

primaryDB.on("error", (err) => {
  console.error("Error connecting to primaryDB:", err)
})

primaryDB.on("disconnected", () => {
  console.log("primaryDB disconnected")
})

// Event listeners for adminDB
adminDB.on("connected", () => {
  console.log("adminDB connected successfully")
})

adminDB.on("error", (err) => {
  console.error("Error connecting to adminDB:", err)
})

adminDB.on("disconnected", () => {
  console.log("adminDB disconnected")
})

// Event listeners for mdmDB
mdmDB.on("connected", () => {
  console.log("MDM DB connected successfully")
})

mdmDB.on("error", (err) => {
  console.error("Error connecting to MDM DB:", err)
})

mdmDB.on("disconnected", () => {
  console.log("MDM DB disconnected")
})
export { primaryDB, adminDB, mdmDB }
