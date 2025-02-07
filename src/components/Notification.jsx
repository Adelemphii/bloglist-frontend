const Notification = ({ message, status }) => {
  const notifStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if(message === null) {
    return null
  }

  return(
    <div style={notifStyle} className={status}>
      {message}
    </div>
  )
}

export default Notification