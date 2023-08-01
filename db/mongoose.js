const mongoose = require('mongoose')
require('dotenv').config()
async function main() {
  await mongoose.connect(`mongodb+srv://evideovsl:${process.env.MONGO_PASSWORD}@e-video.z7jb8w9.mongodb.net/`)
  console.log('Conectou com Mongoose!')
}

main().catch((err) => console.log(err))

module.exports = mongoose
