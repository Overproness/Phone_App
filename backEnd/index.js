require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log(JSON.stringify(request.body))
  next()
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(morgan('tiny'))



app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
    Person.find({}).then(result => {
      const date = new Date()
      response.send(`<p>PhoneBook has info about ${result.length} people.</p><p>${date}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if(person){
          response.json(person)
        }
        else{
          response.status(404).end()
        }
      })
      .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        console.log(result)
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(
    request.params.id, 
    {name, number}, 
    {new: true, runValidators:true, context:'query'}
    )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(err => next(err))
})

const unkownEndpoint = (request, response) => {
  response.status(404).send({error: 'unkown Endpoint'})
}

app.use(unkownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    response.status(400).send({error: 'malformed id'})
  } else if(error.name === 'ValidationError'){
    response.status(400).send({error: 'Validation Rules are not followed. '})
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server Running on ', PORT)
})