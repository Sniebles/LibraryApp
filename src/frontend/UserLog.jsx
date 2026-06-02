import { useState } from 'react'
import './UserLog.css'

function UserLog({ formData2, setFormData2, close, onDone }) {
  const [formData, setFormData] = useState({
    correo: ''
  })
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {

      const res = await fetch(
        `http://localhost:3001/user/mail/${formData.correo}`
      )

      console.log("status:", res.status)

      const data = await res.json()
      
      if (data.length === 0) {
        setError("No existe un usuario con ese correo")
        return
      }

      setFormData2(data[0])

      setError(null)
      if (typeof onDone === 'function') onDone()
      else if (typeof close === 'function') close()
      localStorage.setItem("mail", formData.correo);
    } catch (err) {
      setError("Error conectando con el servidor " + err.message)

    }
  }

  return (
    <>
        <h2>Iniciar sesión</h2>

        <form className='userlog_form' onSubmit={handleSubmit}>

          <label>
            Correo
            <input
              type='email'
              name='correo'
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </label>

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          <button type='submit' className='userlog_submit'>
            Iniciar sesión
          </button>

        </form>

    </>
  )
}

export default UserLog