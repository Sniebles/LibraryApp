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

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Registro de usuario:', formData)
    setPanel(0)
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
