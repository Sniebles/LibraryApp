import { useEffect, useState } from 'react';
import './Borrowed.css'
import './UserReg.css'
import Box from './Box'
import Panel from './Panel'
import Barcode from 'react-barcode';

function Borrowed({setPanel, user, setUser, dataFromAdmin = null, setDataFromAdmin}) {
    const userData = dataFromAdmin? dataFromAdmin : user;
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [formData, setFormData] = useState({
        observaciones: ''
    })
    
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
            body: JSON.stringify({ id_prestamo: id_prestamo, id_usuario: user.id_usuario, observaciones: formData.observaciones })
        })
        .then(res => res.json())
        .then(data => {
            loadBorrowed();
            setSelectedLoan(null);
            setFormData({ observaciones: '' }); // Reset form data
        })
        .catch(err => {
            alert("Error approving return:" + err.message);
        });
    };

    const handleBlockUser = () => {
        if (window.confirm("¿Estás seguro de que deseas bloquear a este usuario? Esta acción no se puede deshacer.")) {
            fetch(`http://localhost:3001/users/block/${dataFromAdmin.id_usuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                setDataFromAdmin({...dataFromAdmin, estado: 'bloqueado'});
                if (dataFromAdmin.id_usuario === user.id_usuario) {
                    setUser({...user, estado: 'bloqueado'});
                }
            })
            .catch(err => {
                alert("Error blocking user:" + err.message);
            });
        }
    };

    const handleUnblockUser = () => {
        if (window.confirm("¿Estás seguro de que deseas desbloquear a este usuario?")) {
            fetch(`http://localhost:3001/users/unblock/${dataFromAdmin.id_usuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                setDataFromAdmin({...dataFromAdmin, estado: 'activo'});
                if (dataFromAdmin.id_usuario === user.id_usuario) {
                    setUser({...user, estado: 'activo'});
                }
            })
            .catch(err => {
                alert("Error unblocking user:" + err.message);
            });
        }
    };

    return (
    <>
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
                                    <Barcode width={3} height={100} className='borrowed_barcode' value={item.codigo_barras} />
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
                                                    <button className='borrow_btn r_button borrow_cancel' onClick={() => setSelectedLoan(item.id_prestamo)}>
                                                        Aprobar devolucion
                                                    </button>
                                                </>
                                            :
                                                item.id_devolucion ?
                                                <div className='pending_approval'>
                                                    <h2>Devolucion pendiente</h2>
                                                    {item.multa !== null && item.multa > 0 && <p>Multa: {item.multa}</p>}
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
            {
                dataFromAdmin &&
                (dataFromAdmin.estado === 'activo' ?
                <button className='block_btn r_button' onClick={handleBlockUser}>
                    Bloquear usuario
                </button>
                :
                dataFromAdmin.estado === 'bloqueado' &&
                <button className='block_btn r_button' onClick={handleUnblockUser}>
                    Desbloquear usuario
                </button>)
            }
        </Panel>
        {
            selectedLoan &&
            <div className='borrowed_ops_div'>
                <Panel loose={true} className="borrowed_ops_panel" setPanel={() => setSelectedLoan(null)} background={true}>
                    <form className='userreg_form' onSubmit={(e) => { e.preventDefault(); handleAproveReturn(selectedLoan); }}>
                        <h2>Confirmar Devolución</h2>
                        <label>
                            Observaciones:
                            <textarea
                                className='observations_input'
                                value={formData.observaciones}
                                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                            />
                        </label>
                        <button type='submit' className='userreg_submit'>
                            Aprobar
                        </button>
                    </form>
                </Panel>
            </div>
        }
    </>
  )
}

export default Borrowed
