import { useState, useEffect, use } from 'react'
import './Book.css'
import Panel from './Panel'

function Book({setBook, user, title, isbn, editorial, year, description, id_book, autores, categorias, disponibilidad}) {
  const [copies, setCopies] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/copies/${id_book}`)
      .then(res => res.json())
      .then(data => {
        setCopies(data);
      })
      .catch(err => alert('Error fetching copies:', err));
  }, [id_book]);

  const handleBorrow = (copyId) => {
    fetch(`http://localhost:3001/Borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_usuario: user.id_usuario,
        id_ejemplar: copyId
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
    })
    .catch(err => alert('Error borrowing copy:' + err.message));
  }
  return (
    <div className='book_overlay'>
        <Panel background={false} setPanel={() => setBook(0)} className='book_panel'>
            <h1>{title}</h1>
            <p>{isbn}</p>
            <p>{editorial}</p>
            <p>{year}</p>
            <p>{description}</p>
            <p>{autores}</p>
            <p>{categorias}</p>
            <p>{disponibilidad}</p>
            <h2>Copies</h2>
            {copies.map((copy, index) => (
              <div key={index}>
                <p>----------------------</p>
                <p>codigo de barras: {copy.codigo_barras}</p>
                <p>ubicasion: {copy.ubicacion}</p>
                <p>estado: {copy.estado}</p>
                {copy.estado === 'disponible' && (
                  user.estado === 'activo' || !user.id_usuario ?
                  user.id_usuario ? (
                    <button onClick={() => handleBorrow(copy.id_ejemplar)} className='book_borrow_btn'>Borrow</button>
                  ) : (
                    <h3>Por favor, inicie sesión para prestar este libro.</h3>
                  ) : (
                    <h3>No puedes prestar este libro. Por favor, contacta con la biblioteca.</h3>
                  )
                )}
              </div>
            ))}
        </Panel>
    </div>
  )
}

export default Book
