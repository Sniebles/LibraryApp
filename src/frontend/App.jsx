import { use, useEffect, useState } from 'react'
import './App.css'
import Section from './Section'
import Books from './Books'
import UserReg from './UserReg'
import UserLog from './UserLog'
import Borrowed from './Borrowed'
import Admin from './Admin'
import AddBook from './AddBook'
import Button from './components/Button'
import Popup from './components/Popup'

function App() {
  //popups
  const [popups, setPopups] = useState([])
  const addPopup = (content, width='auto', height='auto', focusColor='var(--secondary-color)') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setPopups(prev => [...prev, { id, content, width, height, focusColor }])
  }
  const removePopup = (id) => {
    setPopups(prev => prev.filter(popup => popup.id !== id))
  }

  const [formData, setFormData] = useState({
    correo: ''
  })
  // panel navigation removed — use popups instead
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

  const getLoanDiffDays = (dateString) => {
    if (!dateString) return null
    const due = new Date(dateString)
    if (Number.isNaN(due.getTime())) return null
    const today = new Date()
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    const utcDue = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate())
    return Math.floor((utcDue - utcToday) / (1000 * 60 * 60 * 24))
  }

  const checkLoanAlerts = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3001/borrowed/${userId}`)
      const loans = await res.json()

      const alerts = loans.reduce((acc, loan) => {
        const diffDays = getLoanDiffDays(loan.fecha_vencimiento)
        if (diffDays === 1) {
          acc.push(`Te queda solo 1 día para devolver el libro ${loan.titulo}.`)
        } else if (diffDays != null && diffDays < 0) {
          acc.push(`Estás atrasado por ${Math.abs(diffDays)} días con el libro ${loan.titulo}.`)
        }
        return acc
      }, [])

      if (alerts.length > 0) {
        addPopup(
          <div>
            <h2>Atención</h2>
            {alerts.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>,
          '400px',
          'auto',
          alerts.some(msg => msg.includes('atrasado')) ?
            'var(--harmful-color)':'var(--warning-color)'
        )
      }
    } catch (err) {
      console.error('Error fetching loan alerts:', err)
    }
  }

  useEffect(() => {
    if (formData.id_usuario) {
      checkLoanAlerts(formData.id_usuario)
    }
  }, [formData.id_usuario])

  const handleLogout = () => {
    localStorage.removeItem("mail");
    setFormData({correo: ''}); setPopups([]);
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
    setDataFromAdmin(userData);
    addPopup(<Borrowed dataFromAdmin={userData} setDataFromAdmin={setDataFromAdmin} user={formData} setUser={setFormData} addPopup={addPopup} />, '80%', '80%')
  }

  return (
    <>
      <div className='user_buttons'>
        {formData.correo ?
        <>
          <div><p>Bienvenido, {formData.nombres}</p></div>
          <button onClick={() => addPopup(
            <div className='account_panel'>
              <h2>Cuenta de {formData.correo}</h2>
              <button onClick={() => addPopup(<UserReg setUserData={setFormData} userData={formData} />, '300px', '80%')} className='r_button account_buttons'>
                Editar Cuenta
              </button>
              <button onClick={handleLogout} className='r_button account_buttons'>
                Cerrar Seccion
              </button>
              <button onClick={handleDeleteAccount} className='r_button account_buttons delete_account_btn'>
                Borrar Cuenta
              </button>
            </div>
          , '300px', 'auto')} className='log_in'>Cuenta</button>
        </>
        :
        <>
          <button onClick={() => addPopup(<UserLog formData2={formData} setFormData2={setFormData} />, '300px', 'auto')} className='log_in'>Iniciar Seccion</button>
          <button onClick={() => addPopup(<UserReg setUserData={setFormData} />, '300px', '80%')} className='sign_in'>Registrarte</button>
        </>}
      </div>
      <div className='options'>
        <Section onClick={() => addPopup(<Books user={formData} addPopup={addPopup} />, '80%', '80%')} text="Libros" img="https://letraslibres.com/wp-content/uploads/2016/05/libros-viejos-230813.jpg" />
        <Section onClick={() => addPopup(<Borrowed dataFromAdmin={null} setDataFromAdmin={setDataFromAdmin} user={formData} setUser={setFormData} addPopup={addPopup} />, '80%', '80%')} text="Prestamos" img="https://www.comunidadbaratz.com/wp-content/uploads/Hay-muchisimos-libros-en-las-bibliotecas-pero-solamente-unos-pocos-comparten-el-privilegio-de-ser-los-mas-prestados-1.jpg" />
        {formData.rol === "bibliotecario"? <Section onClick={() => addPopup(<Admin handleShowToApprove={handleShowToApprove} addPopup={addPopup} />, '80%', '80%')} text="Administracion" img="https://api.supercluster.mx/admin/content/image_news/569/files/14ae055ecb_ATURA_20210909212117613ac11dc6abf.jpg" /> : null}
      </div>
      {popups.length > 0 &&
        popups.map((popup, index) => (
          <Popup
            focus={index === popups.length - 1}
            width={popup.width || 'auto'}
            height={popup.height || 'auto'}
            key={popup.id}
            id={popup.id}
            removePopup={removePopup}
            focusColor={popup.focusColor || 'var(--secondary-color)'}
          >
            {popup.content}
          </Popup>
        ))
      }
    </>
  )
}

export default App
