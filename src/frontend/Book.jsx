import { useState, useEffect, use } from 'react'
import './Book.css'
import Barcode from "react-barcode";
import Box from './Box';
import Copies from './Copies';
import Reservations from './Reservations';
import Form from './components/Form';

function Book({setBook, user, title, isbn, editorial, year, description, id_book, autores, categorias, disponibilidad, dias_prestamo, loadBooks, addPopup}) {
  const [copies, setCopies] = useState([]);

  useEffect(() => {
    loadCopies();
  }, [id_book]);

  const loadCopies = () => {
    fetch(`http://localhost:3001/copies/${id_book}`)
      .then(res => res.json())
      .then(data => {
        setCopies(data);
      })
      .catch(err => addPopup('Error fetching copies:', err));
  }

  const commitBorrow = (copyId, duration) => {
    fetch(`http://localhost:3001/Borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_ejemplar: copyId,
        duracion: duration
      })
    })
    .then(res => res.json())
    .then(data => {
      loadBooks();
      loadCopies();
      addPopup(data.message)
    })
    .catch(err => console.error('Error borrowing copy:' + err.message));
  }

  const handleBorrow = (copyId) => {
    addPopup(<>
      <Form
        inputs={[
          {label:'Duracion', name:'duracion', type:'range', min:1, max:dias_prestamo, unit:'dias', singularUnit:'dia', required: true}
        ]}
        tile={'Realizar prestamo'}
        submitText={'Prestar'}
        getData={data => commitBorrow(copyId, data.duracion)}
      />
    </>)
  }

  const handleReserve = (copy) => {
    if (!user || user.estado !== 'activo') {
      addPopup('No puedes reservar este libro. Por favor, contacta con la biblioteca.');
      return;
    } else {
      addPopup(
        <Reservations dias_prestamo={dias_prestamo} addPopup={addPopup} userID={user.id_usuario} copyID={copy.id_ejemplar} />
        , '70%', 'auto')
    }
  }

  return (
    <div className='book_div'>
      <h1>{title}</h1>
      <p><span className='bold'>isbn: </span> {isbn}</p>
      <p><span className='bold'>editorial: </span>{editorial}</p>
      <p><span className='bold'>año: </span>{year}</p>
      <p><span className='bold'>description: </span>{description}</p>
      <p><span className='bold'>autores: </span>{autores}</p>
      <p><span className='bold'>categorias: </span>{categorias}</p>
      <p><span className='bold'>disponibilidad: </span>{disponibilidad}</p>
      <p><span className='bold'>dias de prestamo: </span>{dias_prestamo}</p>
      <h2>Ejemplares</h2>
      <Copies addPopup={addPopup} handleBorrow={handleBorrow} handleReserve={handleReserve} copies={copies} user={user} />
    </div>
  )
}

export default Book
