import { useEffect, useState } from "react";
import "./EditCopies.css"
import Copies from "./Copies";

function EditCopies({ onDone, id_book, addPopup }) {
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
            .catch(err => alert('Error fetching copies: ' + err));
    }

    const handleDelete = async (copyId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este ejemplar? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/copies/delete/${copyId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            console.log(data);
        } catch (error) {
            alert('Error deleting copy: ' + error.message);
            console.error('Error deleting copy:', error);
        }
        loadCopies();
    };

    const openAddCopyPopup = () => {
        addPopup(<CopyForm mode='add' />, '30rem', 'auto')
    }

    const openEditCopyPopup = (copy) => {
        addPopup(<CopyForm mode='edit' initialData={copy} />, '30rem', 'auto')
    }

    const addCopy = async (formData, close) => {
        try {
            const res = await fetch(`http://localhost:3001/copies/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_libro: id_book,
                    codigo_barras: formData.codigo_barras,
                    ubicacion: formData.ubicacion
                })
            })
            const data = await res.json()
            console.log(data)
            if (typeof close === 'function') close()
        } catch (error) {
            alert('Error adding copy: ' + error.message)
            console.error('Error adding copy:', error)
        }
        loadCopies();
        if (typeof onDone === 'function') onDone();
    }

    const editCopy = async (formData, close) => {
        try {
            const res = await fetch(`http://localhost:3001/copies/update/${formData.id_ejemplar}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codigo_barras: formData.codigo_barras,
                    ubicacion: formData.ubicacion,
                    id_libro: id_book
                })
            })
            const data = await res.json()
            console.log(data)
            if (typeof close === 'function') close()
        } catch (error) {
            alert('Error editing copy: ' + error.message)
            console.error('Error editing copy:', error)
        }
        loadCopies();
        if (typeof onDone === 'function') onDone();
    }

    const CopyForm = ({ mode, initialData = {}, close }) => {
        const [formData, setFormData] = useState({
            codigo_barras: initialData.codigo_barras || '',
            ubicacion: initialData.ubicacion || '',
            id_ejemplar: initialData.id_ejemplar || null
        })

        const handleChange = (event) => {
            const { name, value } = event.target
            setFormData(prev => ({ ...prev, [name]: value }))
        }

        const handleSubmit = async (event) => {
            event.preventDefault()
            if (mode === 'edit') {
                await editCopy(formData, close)
            } else {
                await addCopy(formData, close)
            }
        }

        return (
            <>
                <div className="copies_add_panel">
                    <h2>{mode === 'edit' ? 'Editar ejemplar' : 'Añadir ejemplar'}</h2>
                    <form className='userreg_form' onSubmit={handleSubmit}>
                        <label>
                            Codigo barras
                            <input
                                type='text'
                                name='codigo_barras'
                                value={formData.codigo_barras}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Ubicacion
                            <input
                                type='text'
                                name='ubicacion'
                                value={formData.ubicacion}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <button type='submit' className='userreg_submit'>
                            {mode === 'edit' ? 'Editar' : 'Añadir'}
                        </button>
                    </form>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="copies_panel">
                <div className="edit_copies_div">
                    <Copies loadCopies={loadCopies} handleDelete={handleDelete} handleEdit={openEditCopyPopup} copies={copies} />
                    <button className="add_copy_btn r_button" onClick={openAddCopyPopup}>
                        Añadir ejemplar
                    </button>
                </div>
            </div>
        </>
    )
}

export default EditCopies