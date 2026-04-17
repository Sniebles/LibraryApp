import Barcode from "react-barcode"
import Box from "./Box"
import "./Copies.css"

function Copies({copies, loadCopies, user, handleBorrow, handleEdit, handleDelete}) {

    const handleLost = async (copy) => {
        
        try {
            const response = await fetch(`http://localhost:3001/copies/toggle-lost/${copy.id_ejemplar}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error updating status");
            }

            loadCopies();
            
            console.log(data.message);

        } catch (error) {
            alert('Error marking copy as lost: ' + error.message);
            console.error('Error marking copy as lost:', error);
        }
    };


    return (
        <div className='book_copies'>
            {copies.map((copy, index) => (
            <Box clickable={false} className='book_copy' key={index}>
                <Barcode value={copy.codigo_barras} />
                <div className='book_copy_right'>
                <div className='book_copy_text'>
                    <p>ubicasion: {copy.ubicacion}</p>
                    <p>estado: {copy.estado}</p>
                </div>
                {!user ?
                <div className='book_borrow_btn book_copies_btns'>
                    <button onClick={() => handleEdit(copy)} className='r_button'>Editar</button>
                    <button onClick={() => handleLost(copy)} className='book_copies_lost_btn r_button'>perdido</button>
                    <button onClick={() => handleDelete(copy.id_ejemplar)} className='book_copies_delete_btn r_button'>Borrar</button>
                </div>:
                copy.estado === 'disponible' && (
                user.estado === 'activo' || !user.id_usuario ?
                user.id_usuario ? (
                    <button onClick={() => handleBorrow(copy.id_ejemplar)} className='book_borrow_btn r_button'>Prestar</button>
                ) : (
                    <h3>Por favor, inicie sesión para prestar este libro.</h3>
                ) : (
                    <h3>No puedes prestar este libro. Por favor, contacta con la biblioteca.</h3>
                )
                )}</div>
            </Box>
            ))}
        </div>
    )
}

export default Copies