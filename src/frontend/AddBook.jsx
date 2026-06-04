import { useEffect, useState } from 'react'
import './AddBook.css'
import './UserReg.css'

function AddBook({ bookData=null, close, onDone}) {
  const [formData, setFormData] = useState({
    isbn: '',
    titulo: '',
    editorial: '',
    anio: '',
    descripcion: '',
    dias_prestamo: 8,
    autores: '',
    categorias: ''
  })

  useEffect(() => {
    if (bookData) {
      setFormData({
        ...bookData,
        dias_prestamo: bookData.dias_prestamo ?? 8
      })
    }
  }, [bookData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dias_prestamo' ? Number(value) : value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    try {
      const res = await fetch(`http://localhost:3001/books${bookData? '/update':'/add'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status + res.error}`)
        }
        return res.json()
      })
      .then(data => {
        alert('Libro añadido:' + JSON.stringify(data))
        if (typeof onDone === 'function') onDone()
        else if (typeof close === 'function') close()
      })
      .catch(err => {
        alert('Error añadiendo libro:' + err.message)
      })
    } catch (error) {
      alert('Error en la solicitud:' + error.message)
    }
  }

  return (
    <>
      <h2>{bookData? 'Editar libro':'Añadir libro'}</h2>
      <form className='userreg_form' onSubmit={handleSubmit}>
        <label>
          ISBN
          <input
            type='text'
            name='isbn'
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Titulo
          <input
            type='text'
            name='titulo'
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Editorial
          <input
            type='text'
            name='editorial'
            value={formData.editorial}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Año
          <input
            type='text'
            name='anio'
            value={formData.anio}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripcion
          <input
            type='text'
            name='descripcion'
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Días de préstamo
          <input
            type='number'
            name='dias_prestamo'
            min='1'
            value={formData.dias_prestamo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Autores (separados por coma)
          <input
            type='text'
            name='autores'
            value={formData.autores}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Categorias (separados por coma)
          <input
            type='text'
            name='categorias'
            value={formData.categorias}
            onChange={handleChange}
            required
          />
        </label>

        <button type='submit' className='userreg_submit'>
          {bookData? 'Editar':'Añadir'}
        </button>
      </form>
    </>
  )
}

export default AddBook