import { useEffect, useState } from "react"
import "./Admin.css"
import "./Books.css"
import Panel from "./Panel"
import Box from "./Box"
import AddBook from "./AddBook"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { set } from "date-fns"
import EditCopies from "./EditCopies"

function Admin({setPanel, handleShowToApprove, prevSubMenu=null}) {
    const [subMenu, setSubMenu] = useState("users")
    const [subPanel, setSubPanel] = useState(0)
    if (prevSubMenu && ["users", "inventory", "most borrowed", "borrowers"].includes(prevSubMenu)) {
        setubMenu(prevSubMenu);
    }
    
    const [data, setData] = useState([])
    const [selectedBook, setSelectedBook] = useState(null)

    const [dates, setDates] = useState({date1: new Date(), date2: new Date()});

    useEffect(() => {
        doQuery();
    }, [subMenu, dates.date1, dates.date2]);

    const doQuery = () => {
        switch (subMenu) {
             case "users":
                try {
                    fetch(`http://localhost:3001/users/pending`)
                    .then((res) => res.json())
                    .then((data) => setData(data));
                } catch (err) {
                    alert(err.message)
                }
                break;
            case "inventory":
                try {
                    fetch(`http://localhost:3001/books`)
                    .then((res) => res.json())
                    .then((data) => setData(data));
                } catch (err) {
                    alert(err.message)
                }
                break;
            case "most borrowed":
                try {
                    const fetchData = async () => {
                        fetch(`http://localhost:3001/books/most_borrowed?startDate=${
                                dates.date1.toISOString().split('T')[0]}&endDate=${
                                dates.date2.toISOString().split('T')[0]}`, {
                            method: "GET"
                        })
                        .then((res) => res.json())
                        .then((data) => setData(data))
                        .catch((err) => alert(err.message));
                    };
                    fetchData();

                } catch (err) {
                    alert(err.message)
                }
                break;
            case "borrowers":
                try {
                    fetch(`http://localhost:3001/users/top_borrowers`)
                    .then((res) => res.json())
                    .then((data) => setData(data))
                    .catch((err) => alert(err.message));
                } catch (err) {
                    alert(err.message)
                }
                break;
            default:
                break;
        }
    }

    const handleSetPanel = () => {
        setPanel(7);
    };

    const handleDelete = (book) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar el libro "${book.titulo}"? Esta acción no se puede deshacer.`)) {
            fetch(`http://localhost:3001/books/delete/${book.id_libro}`, {
                method: "DELETE"
            })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                doQuery();
            })
            .catch((err) => alert(err.message));
        }
    };


    return (
        <>
            <Panel setPanel={setPanel}>
                <div className="books_topbar">
                    <div className="search_options">
                        {[
                            {value: "users", label: "usuarios"},
                            {value: "inventory", label: "inventario"},
                            {value: "most borrowed", label: "mas prestados"},
                            {value: "borrowers", label: "usuarios con mas prestamos"}
                        ].map((option) => (
                            <label className="search_option" key={option.value}>
                                <input
                                    type="radio"
                                    name="searchField"
                                    value={option.value}
                                    checked={subMenu === option.value}
                                    onChange={() => setSubMenu(option.value)}
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {subMenu === "most borrowed" && <div className="books_topbar2">
                    <div className="search_options">
                        <DatePicker className="admin_date_picker"
                            selected={dates.date1}
                            onChange={(date) => setDates({...dates, date1:date})}
                            dateFormat="dd/MM/yyyy"
                        />
                        <DatePicker className="admin_date_picker"
                            selected={dates.date2}
                            onChange={(date) => setDates({...dates, date2:date})}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </div>}
                <div className='books_content'>
                    {subMenu === "users" && data? data.map((user, index) => (
                        <Box key={index} onClick={() => handleShowToApprove({...user, setPanel: handleSetPanel})} borderColor={user.pendiente === "si" ? "var(--color-6)" : "var(--color-1)"} className="book">
                            <div>
                                <h1>{user.nombres}</h1>
                                <p>{user.correo}</p>
                                <p>{user.identificacion}</p>
                                <p>{user.estado}</p>
                                <p>{user.codigo}</p>
                                {user.pendiente === "si" &&
                                <div className="to_be_approved">
                                    <div className="text"><h2>Por aprobar</h2></div>
                                </div>
                                }
                            </div>
                        </Box>
                    )) :
                    subMenu === "inventory" && data ?
                    <>
                        {data.map((book, index) => (
                            <Box key={index} clickable={false} borderColor={book.disponibilidad !== "disponible" ? "var(--color-5)" : "var(--color-1)"} className="book">
                                <div>
                                    <h1>{book.titulo}</h1>
                                    <p>{book.isbn}</p>
                                    <p>{book.descripcion}</p>
                                    <p>{book.autores}</p>
                                    <p>{book.categorias}</p>
                                    {book.disponibilidad !== "disponible" &&
                                    <div className="unavailable_note">
                                        <h2>No disponible</h2>
                                    </div>
                                    }
                                    <button className='admin_edit_btn r_button' onClick={() => {
                                        setSelectedBook(book);
                                        setSubPanel(2);
                                    }}>
                                        Editar
                                    </button>
                                    <button className='admin_delete_btn r_button' onClick={() => handleDelete(book)}>
                                        Borrar
                                    </button>
                                </div>
                            </Box>
                        ))}
                        <button className='admin_add_btn' onClick={() => setSubPanel(1)}>
                            Añadir
                        </button>
                    </> :
                    subMenu === "most borrowed" ?
                    data.map((book, index) => (
                        <Box key={index} clickable={false} className="book">
                            <div>
                                <h1>{book.titulo}</h1>
                                <p>{book.isbn}</p>
                                <p>{book.descripcion}</p>
                                <p>{book.autores}</p>
                                <p>{book.categorias}</p>
                                <h2>Prestado: {book.prestamos} veces</h2>
                            </div>
                        </Box>
                    ))
                    : subMenu === "borrowers" ?
                    data.map((user, index) => (
                        <Box key={index} onClick={() => handleShowToApprove({...user, setPanel: handleSetPanel})} borderColor={user.pendiente === "si" ? "var(--color-6)" : "var(--color-1)"} className="book">
                            <div>
                                <h1>{user.nombres}</h1>
                                <p>ha prestado: {user.total_prestamos} libros</p>
                                <p>{user.correo}</p>
                                <p>{user.identificacion}</p>
                                <p>{user.estado}</p>
                                <p>{user.codigo}</p>
                                {user.pendiente === "si" &&
                                <div className="to_be_approved">
                                    <div className="text"><h2>Por aprobar</h2></div>
                                </div>
                                }
                            </div>
                        </Box>
                    ))
                    : null}
                </div>
            </Panel>
            {
            subPanel === 1 ?
            <div className="admin_book_editing">
                <AddBook setPanel={() => {doQuery(); setSubPanel(0);}} />
            </div> :
            subPanel === 2 ?
            <div className="admin_book_editing">
                <AddBook bookData={selectedBook} />
                <EditCopies id_book={selectedBook.id_libro} setPanel={() => {doQuery(); setSubPanel(0);}} />
            </div> : null
            }
        </>
    )
}

export default Admin