import { useState, useEffect } from 'react'
import './Book.css'
import Panel from './Panel'

function Book({setBook, title, isbn, editorial, year, description, id_book, autores, categorias, disponibilidad}) {
  const [copies, setCopies] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/copies/${id_book}`)
      .then(res => res.json())
      .then(data => {
        setCopies(data);
      })
      .catch(err => alert('Error fetching copies:', err));
  }, [id_book]);
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
                <p>bar code: {copy.codigo_barras}</p>
                <p>location: {copy.ubicacion}</p>
                <p>state: {copy.estado}</p>
                {copy.estado === 'disponible' && (
                  <button className='book_borrow_btn'>Borrow</button>
                )}
              </div>
            ))}
        </Panel>
    </div>
  )
}

export default Book
