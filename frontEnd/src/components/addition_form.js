const AdditionForm = (props) => (
    <>
        <form onSubmit={props.handleSubmit} >
          <div>name: <input value={props.newName} onChange={props.handleChangeName} /></div>
          <div>number: <input value={props.newNo} onChange={props.handleChangeNo} /></div>
          <div><button type="submit" >add</button></div>
        </form>
    </>
)

export default AdditionForm