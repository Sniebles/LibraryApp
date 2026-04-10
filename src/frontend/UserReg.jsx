import { useState } from 'react'
import './UserReg.css'
import Panel from './Panel'

function UserReg({ setPanel }) {
  const [formData, setFormData] = useState({
    identificacion: '',
    nombres: '',
    correo: '',
    rol: 'estudiante',
    carrera: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        alert('Usuario registrado:' + JSON.stringify(data))
        setPanel(0)
      })
      .catch(err => {
        alert('Error registrando usuario:' + err.message)
      })
    } catch (error) {
      alert('Error en la solicitud:' + error.message)
    }
  }

  return (
    <Panel setPanel={setPanel} className='userreg_panel'>
        <h2>Registro de usuario</h2>
        <form className='userreg_form' onSubmit={handleSubmit}>
          <label>
            Identificación
            <input
              type='text'
              name='identificacion'
              value={formData.identificacion}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Nombres
            <input
              type='text'
              name='nombres'
              value={formData.nombres}
              onChange={handleChange}
              required
            />
          </label>

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

          <label>
            Rol
            <select name='rol' value={formData.rol} onChange={handleChange}>
              <option value='estudiante'>Estudiante</option>
              <option value='docente'>Docente</option>
              <option value='bibliotecario'>Bibliotecario</option>
            </select>
          </label>

          <label>
            Carrera (opcional)
            <input
              type='text'
              name='carrera'
              value={formData.carrera}
              onChange={handleChange}
            />
          </label>

          <button type='submit' className='userreg_submit'>
            Registrarse
          </button>
        </form>
    </Panel>
  )
}

export default UserReg
