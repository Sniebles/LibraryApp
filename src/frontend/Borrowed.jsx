import { useEffect, useState } from 'react';
import './Borrowed.css'
import Box from './Box'
import Panel from './Panel'

function Borrowed({setPanel, user}) {
    const [borrowed, setBorrowed] = useState([]);

     useEffect(() => {
        const fetchBorrowed = async () => {
            try {
                const res = await fetch(`http://localhost:3001/borrowed/${user.id_usuario}`);
                const data = await res.json();
                setBorrowed(data);
            } catch (err) {
                alert("Error fetching borrowed books:" + err.message);
            }
        };

        fetchBorrowed();
    }, [user.correo]);

    const handleReturn = (id_prestamo) => {
        fetch(`http://localhost:3001/Return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_prestamo: id_prestamo })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            window.location.reload();
        })
        .catch(err => {
            alert("Error returning book:" + err.message);
        });
    };

    return (
    <Panel type={0} setPanel={setPanel}>
        <div className='borrowed_content'>
            {
                borrowed.length > 0 ? (
                    borrowed.map((item, index) => (
                        <Box className="borrowed_book" key={item.codigo_barras}>
                            <div>
                                <h1>{item.titulo}</h1>
                                <p>{item.codigo_barras}</p>
                                <p>{item.fecha_prestamo}</p>
                                <p>{item.fecha_vencimiento}</p>
                                <button onClick={() => handleReturn(item.id_prestamo)} className='book_borrow_btn'>Devolver</button>
                            </div>
                        </Box>
                    ))
                ) : (
                    <p>No hay libros prestados.</p>
                )
            }
        </div>
    </Panel>
  )
}

export default Borrowed
