import { useState } from 'react'
import './App.css'
import Section from './Section'
import Books from './Books'
import UserReg from './UserReg'
import UserLog from './UserLog'
import Borrowed from './Borrowed'

function App() {
  const [formData, setFormData] = useState({
    correo: ''
  })
  const [panel, setPanel] = useState(0)
  return (
    <>
      <div className='user_buttons'>
        <p>user: {formData.correo}</p>
        <div className='log_in_div'>
          <button onClick={() => setPanel(3)} className='log_in'>Iniciar Seccion</button>
        </div>
        <div className='sign_in_div'>
          <button onClick={() => setPanel(2)} className='sign_in'>Registrarte</button>
        </div>
      </div>
      <div className='options'>
        <Section onClick={() => setPanel(1)} text="Libros" img="https://letraslibres.com/wp-content/uploads/2016/05/libros-viejos-230813.jpg" />
        <Section onClick={() => setPanel(4)} text="Prestamos" img="https://www.comunidadbaratz.com/wp-content/uploads/Hay-muchisimos-libros-en-las-bibliotecas-pero-solamente-unos-pocos-comparten-el-privilegio-de-ser-los-mas-prestados-1.jpg" />
      </div>
      {
        panel == 1 ? <Books user={formData} setPanel={setPanel} /> :
        panel === 2 ? <UserReg setPanel={setPanel} /> :
        panel === 3 ? <UserLog formData2={formData} setFormData2={setFormData} setPanel={setPanel} /> :
        panel === 4 ? <Borrowed user={formData} setPanel={setPanel} /> : null
      }
    </>
  )
}

export default App
