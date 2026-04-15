import { useEffect, useState } from 'react';
import './Borrowed.css'
import Box from './Box'
import Panel from './Panel'

function Borrowed({setPanel, user, dataFromAdmin = null, setDataFromAdmin}) {
    const userData = dataFromAdmin? dataFromAdmin : user;
    
    const [borrowed, setBorrowed] = useState([]);

        useEffect(() => {
            if (userData.id_usuario) {
                loadBorrowed();
            }
    }, [userData.id_usuario]);

    const loadBorrowed = () => {
        const fetchBorrowed = async () => {
            try {
                const res = await fetch(`http://localhost:3001/borrowed/${userData.id_usuario}`);
                const data = await res.json();
                setBorrowed(data);
            } catch (err) {
                alert("Error fetching borrowed books:" + err.message);
            }
        };

        fetchBorrowed();
    }

    const handleReturn = (id_prestamo) => {
        fetch(`http://localhost:3001/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_prestamo: id_prestamo })
        })
        .then(res => res.json())
        .then(data => {
            loadBorrowed();
        })
        .catch(err => {
            alert("Error returning book:" + err.message);
        });
    };

    const handleCancel = (id_prestamo) => {
        fetch(`http://localhost:3001/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_prestamo: id_prestamo })
        })
        .then(res => res.json())
        .then(data => {
            loadBorrowed();
        })
        .catch(err => {
            console.error("Error canceling loan:" + err.message);
        });
    };

    const handleAprove = (id_prestamo) => {
        fetch(`http://localhost:3001/borrowed/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_prestamo: id_prestamo, id_usuario: user.id_usuario })
        })
        .then(res => res.json())
        .then(data => {
            loadBorrowed();
        })
        .catch(err => {
            alert("Error approving loan:" + err.message);
        });
    };

    const handleAproveReturn = (id_prestamo) => {
        fetch(`http://localhost:3001/return/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_prestamo: id_prestamo, id_usuario: user.id_usuario })
        })
        .then(res => res.json())
        .then(data => {
            loadBorrowed();
        })
        .catch(err => {
            alert("Error approving return:" + err.message);
        });
    };

    return (
    <Panel type={0} setPanel={() => {dataFromAdmin? dataFromAdmin.setPanel() : setPanel(0); setDataFromAdmin(null)}}>
        <div className='borrowed_content'>
            {
                borrowed.length > 0 ? (
                    borrowed.map((item, index) => (
                        <Box
                        className="borrowed_book"
                        key={item.codigo_barras}
                        borderColor={item.aprobado_por ?'var(--color-1)' : 'var(--color-6)'}
                        clickable={false}
                        >
                            <div>
                                <h1>{item.titulo}</h1>
                                <p>{item.codigo_barras}</p>
                                <p>{item.fecha_prestamo}</p>
                                <p>{item.fecha_vencimiento}</p>
                                {item.aprobado_por ?
                                    <>
                                        <p>Aprobado por: {item.aprobado_por}</p>
                                        {dataFromAdmin ?
                                            item.id_devolucion &&
                                            <>
                                                <div className='pending_approval'>
                                                    <h2>Devolucion pendiente</h2>
                                                </div>
                                                <button className='borrow_btn r_button borrow_cancel' onClick={() => handleAproveReturn(item.id_prestamo)}>
                                                    Aprobar devolucion
                                                </button>
                                            </>
                                        :
                                            item.id_devolucion ?
                                            <div className='pending_approval'>
                                                <h2>Devolucion pendiente</h2>
                                            </div>
                                            :
                                            <button className='borrow_btn r_button' onClick={() => handleReturn(item.id_prestamo)}>
                                                Devolver
                                            </button>
                                        }
                                    </>
                                :
                                    dataFromAdmin ?
                                    <button className='borrow_btn r_button borrow_cancel' onClick={() => handleAprove(item.id_prestamo)}>
                                        Aprobar
                                    </button>
                                    :
                                    <div className='pending_approval'>
                                        <h2>Prestamo pendiente</h2>
                                        <button className='borrow_btn r_button borrow_cancel' onClick={() => handleCancel(item.id_prestamo)}>
                                            Canselar
                                        </button>
                                    </div>
                                }
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
