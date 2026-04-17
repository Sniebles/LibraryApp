import { useState, useEffect, use } from 'react'
import './Book.css'
import Panel from './Panel'
import Barcode from "react-barcode";
import Box from './Box';
import Copies from './Copies';

function Book({setBook, user, title, isbn, editorial, year, description, id_book, autores, categorias, disponibilidad, loadBooks}) {
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
      .catch(err => alert('Error fetching copies:', err));
  }

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
      loadBooks();
      loadCopies();
    })
    .catch(err => console.error('Error borrowing copy:' + err.message));
  }
  return (
    <div className='book_overlay'>
        <Panel background={false} setPanel={() => setBook(0)} className='book_panel'>
          <div className='book_div'>
            <h1>{title}</h1>
            <p><span className='bold'>isbn: </span> {isbn}</p>
            <p><span className='bold'>editorial: </span>{editorial}</p>
            <p><span className='bold'>año: </span>{year}</p>
            <p><span className='bold'>description: </span>{description}</p>
            <p><span className='bold'>autores: </span>{autores}</p>
            <p><span className='bold'>categorias: </span>{categorias}</p>
            <p><span className='bold'>disponibilidad: </span>{disponibilidad}</p>
            <h2>Ejemplares</h2>
            <Copies handleBorrow={handleBorrow} copies={copies} user={user} />
          </div>
        </Panel>
    </div>
  )
}

export default Book
