require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
import express from "express"
import cors from "cors"
import Routes from "./src/routes"
import { errorHandler } from "./src/utils/errorHandler"
import bodyParser from "body-parser"
import path from "path"


const app = express()
const PORT: number = Number(process.env.PORT) || 8000

app.use(express.json())

app.use(express.static(path.join(__dirname, "src/public")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const corsOptions = {
  origin: true, //process.env.WHITELISTED_ORIGIN?.split(","),
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Accept", "Content-Type", "Authorization"],
  credentials: true
}

// Apply CORS middleware to your Express app
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))

new Routes(app)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server is running on ${PORT} port`)
})
