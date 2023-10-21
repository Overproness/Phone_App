require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB. ')
    })
    .catch(error => {
        console.log('Error Connecting to MongoDB', error.message)
    })

const regex = /^(?:\d{2,3}-\d{6,})$/g

const validator = (number) => {
    return regex.test(number)
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        validate: validator
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


// if(process.argv.length<4){
//     Person.find({}).then(result => {
//         result.forEach(person => {
//             console.log(person);
//         })
//         mongoose.connection.close()
//     })
// }
// if(process.argv.length>4){
//     const person = new Person({
//         name: process.argv[3],
//         number: process.argv[4]
//     })
    
//     person.save().then(result => {
//         console.log('Saved!');
//         console.log(`Added ${person.name} number ${person.number} to the Phonebook`);
//         mongoose.connection.close()
//     })
// }


module.exports = mongoose.model('Person', personSchema)