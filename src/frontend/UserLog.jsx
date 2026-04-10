import { useState } from 'react'
import './UserLog.css'
import Panel from './Panel'

function UserLog({ setPanel, formData2, setFormData2 }) {
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

      /**/
      console.log("status:", res.status)

      const data = await res.json()
      
      if (data.length === 0) {
        setError("No existe un usuario con ese correo")
        return
      }

      // guardar usuario autenticado en estado global
      setFormData2(data[0])

      setError(null)
      setPanel(0)

    } catch (err) {
      setError("Error conectando con el servidor " + err.message)

    }
  }

  return (
    <Panel setPanel={setPanel} className='userlog_panel'>

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

    </Panel>
  )
}

export default UserLog