import { useState } from 'react'
import './App.css'
import Section from './Section'

function App() {
  const [isbookSctON, setisbookSctON] = useState(true)
  return (
    <>
      <div className='options'>
        <Section text="Books" img="https://letraslibres.com/wp-content/uploads/2016/05/libros-viejos-230813.jpg" />
        <Section text="Borrowed" img="https://www.comunidadbaratz.com/wp-content/uploads/Hay-muchisimos-libros-en-las-bibliotecas-pero-solamente-unos-pocos-comparten-el-privilegio-de-ser-los-mas-prestados-1.jpg" />
      </div>
      {(isbookSctON) ?
        <div></div>
      : null}
    </>
  )
}

export default App
