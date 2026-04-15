import { useEffect, useState } from "react"
import "./Admin.css"
import "./Books.css"
import Panel from "./Panel"
import Box from "./Box"

function Admin({setPanel, handleShowToApprove}) {
    const [subMenu, setSubMenu] = useState("users")
    
    const [data, setData] = useState([])

    useEffect(() => {
        if (subMenu === "users") {
            try {
                fetch(`http://localhost:3001/users/pending`)
                .then((res) => res.json())
                .then((data) => setData(data));
            } catch (err) {
                alert(err.message)
            }
        }
    }, [subMenu]);

    const handleSetPanel = () => {
        setPanel(7);
    };

    return (
        <Panel setPanel={setPanel}>
            <div className="books_topbar">
                <div className="search_options">
                    {[
                        {value: "users", label: "usuarios"},
                        {value: "inventory", label: "inventario"}
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
                )) : null
                }
            </div>
        </Panel>
    )
}

export default Admin