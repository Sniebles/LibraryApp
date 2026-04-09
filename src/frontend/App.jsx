import { useState } from 'react'
import './App.css'
import Section from './Section'
import Books from './Books'
import UserReg from './UserReg'

function App() {
  const [panel, setPanel] = useState(0)
  return (
    <>
      <div className='options'>
        <Section onClick={() => setPanel(1)} text="Books" img="https://letraslibres.com/wp-content/uploads/2016/05/libros-viejos-230813.jpg" />
        <Section onClick={() => setPanel(2)} text="Borrowed" img="https://www.comunidadbaratz.com/wp-content/uploads/Hay-muchisimos-libros-en-las-bibliotecas-pero-solamente-unos-pocos-comparten-el-privilegio-de-ser-los-mas-prestados-1.jpg" />
      </div>
      {
        panel == 1 ? <Books setPanel={setPanel} /> :
        panel === 2 ? <UserReg setPanel={setPanel} /> : null
      }
    </>
  )
}

export default App
