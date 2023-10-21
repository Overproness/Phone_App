import {useEffect, useState} from 'react'
import FilteredPersons from './components/filtered_persons'
import SearchField from './components/search_field'
import AdditionForm from './components/addition_form'
import phoneService from './services/phone'
import NotificationMsg from './components/notificaionmsg'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNo, setNewNo] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)
  const checkerName = persons.map(person => person.name)
  const checkerNo = persons.map(person => person.phone)
  
  const hook = () => {
    phoneService
      .getAll()
      .then(reponse => setPersons(reponse))
  }

  useEffect(hook, [])


  const handleSubmit = (event) => {
    event.preventDefault()
    
    if(checkerName.includes(newName) || checkerNo.includes(newNo)){
      if(checkerName.includes(newName) && checkerNo.includes(newNo)){
        setError(`The Phonebook already includes both ${newName} and ${newNo}`)
        alert(error)
      }
      else if(checkerName.includes(newName)){
        window.confirm(`${newName} is already in the phonebook. Would you like to replace the old number with the new one?`)
        ?phoneService
          .update((persons.find(element => element.name === newName).id), {...persons.find(element => element.name === newName), number: newNo})
          .then(() => {
            setError('The Phone was updated successfully')
            setTimeout(() => {
              setError(null)
            },5000)
            setResponse(200)
          })
          .catch(error => {
            setError(`The Phone that you are trying to edit, no longer exists. `)
            setTimeout(() => {
              setError(null)
            },5000)
            setResponse(error.response.request.status)
          })
        :setNewNo('')
      }
      else{
        setError(`${newNo} is already in the phonebook. `)
        alert(error)
      }
    }
    else{
      const theObject = {
        name: newName,
        number: newNo,
        id: persons.length + 1
      }
      phoneService
        .add(theObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNo('')
          setError('The Phone was added successfully. ')
          setTimeout(() => {
            setError(null)
          },5000)
          setResponse(200)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setError(error.response.data.error)
          setTimeout(() => {
            setError(null)
          },5000)
        })
    }
  }
  console.log(response);
  
  const handleChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeNo = (event) => {
    setNewNo(event.target.value)
  }

  const handleChangeSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const handleDelClick = element => {
    window.confirm(`Delete ${element.name} ?`)
    ?phoneService.del(element.id)
    :setNewName('')
  }

  return (
    <>
      <div>
        <h2>Search</h2>
        <NotificationMsg msg={error} error={response}/>
        <SearchField newSearch={newSearch} handleChangeSearch={handleChangeSearch} />
        
        <h3>Add New</h3>
        <AdditionForm handleChangeName={handleChangeName} handleChangeNo={handleChangeNo} handleSubmit={handleSubmit} newName={newName} newNo={newNo} />

        <h2>Phonebook</h2>
        <FilteredPersons persons={persons} newSearch={newSearch} handleDelClick={handleDelClick} />
      </div>
    </>
  )
}

export default App