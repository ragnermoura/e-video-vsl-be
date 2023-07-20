const mongoose = require('mongoose')
require('dotenv').config()
async function main() {
  await mongoose.connect(`mongodb+srv://vitormouracs:${process.env.MONGO_PASSWORD}@evideovsl.ykrcdod.mongodb.net/?retryWrites=true&w=majority`)
  console.log('Conectou com Mongoose!')
}

main().catch((err) => console.log(err))

module.exports = mongoose
