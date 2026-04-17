import { useEffect, useState } from "react";
import "./EditCopies.css"
import Panel from "./Panel"
import Copies from "./Copies";
import { tr } from "date-fns/locale";

function EditCopies({setPanel, id_book}) {
    const [copies, setCopies] = useState([]);
    const [subPanel, setSubPanel] = useState(0);

    const [formData, setFormData] = useState({
        codigo_barras: '',
        ubicacion: ''
    })

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddCopy = async (event) => {
        event.preventDefault()

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
        } catch (error) {
            alert('Error adding copy: ' + error.message)
            console.error('Error adding copy:', error)
        }
        loadCopies();
        setSubPanel(0);

    }

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

    const handleEdit = (copy) => {
        setFormData({
            id_ejemplar: copy.id_ejemplar,
            codigo_barras: copy.codigo_barras,
            ubicacion: copy.ubicacion
        });
        setSubPanel(2);
    };

    const handleEditCopy = async (event) => {
        event.preventDefault();
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
            });
            const data = await res.json();
            console.log(data);
        } catch (error) {
            alert('Error editing copy: ' + error.message);
            console.error('Error editing copy:', error);
        }
        loadCopies();
        setSubPanel(0);
    };

    return (
        <>
            <Panel setPanel={setPanel} className="copies_panel" loose={true} background={false}>
                <div className="edit_copies_div">
                    <Copies loadCopies={loadCopies} handleDelete={handleDelete} handleEdit={handleEdit} copies={copies} />
                    <button className="add_copy_btn r_button" onClick={() => {setSubPanel(1); setFormData({codigo_barras: '', ubicacion: ''})}}>
                        Añadir ejemplar
                    </button>
                </div>
            </Panel>
            {(subPanel === 1 || subPanel === 2) &&
            <div className="copies_add_div">
                <Panel loose={true} className="copies_add_panel" background={false} setPanel={setSubPanel}>
                    <h2>{subPanel === 2 ? 'Editar ejemplar':'Añadir ejemplar'}</h2>
                    <form className='userreg_form' onSubmit={subPanel === 2 ? handleEditCopy : handleAddCopy}>
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
                        {subPanel === 2 ? 'Editar':'Añadir'}
                    </button>
                    </form>
                </Panel>
            </div>}
        </>
    )
}

export default EditCopies