const SearchField = (props) => (
    <>
        <div>filter: <input value={props.newSearch} onChange={props.handleChangeSearch} /></div>
    </>
)

export default SearchField