import { use, useEffect, useState } from 'react'
import './App.css'
import Section from './Section'
import Books from './Books'
import UserReg from './UserReg'
import UserLog from './UserLog'
import Borrowed from './Borrowed'
import Panel from './Panel'
import Admin from './Admin'

function App() {
  const [formData, setFormData] = useState({
    correo: ''
  })
  const [panel, setPanel] = useState(0)
  const [dataFromAdmin, setDataFromAdmin] = useState(null)
  
  useEffect(() => {
    const login_token = localStorage.getItem("mail");
    if (login_token && login_token !== '' && formData.correo === '') {
      setFormData({ ...formData, correo: login_token });
    }
  }, [formData.correo]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!formData.correo) {
        return
      }
      try {
        const res = await fetch(
          `http://localhost:3001/user/mail/${formData.correo}`
        )

        const data = await res.json()
        
        if (data.length === 0) {
          return
        }

        setFormData(data[0])

        localStorage.setItem("mail", formData.correo);
      } catch (err) {
        alert("Error conectando con el servidor " + err.message)
      }
    }
    fetchUserData()
  }, [formData.correo]);

  const handleLogout = () => {
    localStorage.removeItem("mail");
    setFormData({correo: ''}); setPanel(0);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      fetch(`http://localhost:3001/users/delete/${formData.id_usuario}`, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(data => {
        handleLogout();
      })
      .catch(err => {
        alert("Error deleting account:" + err.message);
      });
    }
  };

  const handleShowToApprove = (userData) => {
    setPanel(4);
    setDataFromAdmin(userData);
  }

  return (
    <>
      <div className='user_buttons'>
        {formData.correo ?
        <>
          <div><p>Bienvenido, {formData.nombres}</p></div>
          <button onClick={() => panel === 5 ? setPanel(0) : setPanel(5)} className='log_in'>Cuenta</button>
        </>
        :
        <>
          <button onClick={() => setPanel(3)} className='log_in'>Iniciar Seccion</button>
          <button onClick={() => setPanel(2)} className='sign_in'>Registrarte</button>
        </>}
      </div>
      <div className='options'>
        <Section onClick={() => setPanel(1)} text="Libros" img="https://letraslibres.com/wp-content/uploads/2016/05/libros-viejos-230813.jpg" />
        <Section onClick={() => setPanel(4)} text="Prestamos" img="https://www.comunidadbaratz.com/wp-content/uploads/Hay-muchisimos-libros-en-las-bibliotecas-pero-solamente-unos-pocos-comparten-el-privilegio-de-ser-los-mas-prestados-1.jpg" />
        {formData.rol === "bibliotecario"? <Section onClick={() => setPanel(7)} text="Administracion" img="https://api.supercluster.mx/admin/content/image_news/569/files/14ae055ecb_ATURA_20210909212117613ac11dc6abf.jpg" /> : null}
      </div>
      {
        panel == 1 ? <Books user={formData} setPanel={setPanel} /> :
        panel === 2 ? <UserReg setUserData={setFormData} setPanel={setPanel} /> :
        panel === 3 ? <UserLog formData2={formData} setFormData2={setFormData} setPanel={setPanel} /> :
        panel === 4 ? <Borrowed dataFromAdmin={dataFromAdmin} setDataFromAdmin={setDataFromAdmin} user={formData} setPanel={setPanel} /> :
        panel === 5 ?
        <div className='account_content'>
          <Panel setPanel={setPanel} background={false} className='account_panel'>
            <h2>Cuenta de {formData.correo}</h2>
            <button onClick={() => setPanel(6)} className='r_button account_buttons'>
              Editar Cuenta
            </button>
            <button onClick={handleLogout} className='r_button account_buttons'>
              Cerrar Seccion
            </button>
            <button onClick={handleDeleteAccount} className='r_button account_buttons delete_account_btn'>
              Borrar Cuenta
            </button>
          </Panel>
        </div> :
        panel === 6 ? <UserReg setUserData={setFormData} userData={formData} setPanel={setPanel} /> :
        panel === 7 ? <Admin handleShowToApprove={handleShowToApprove} setPanel={setPanel} /> : null
      }
    </>
  )
}

export default App
