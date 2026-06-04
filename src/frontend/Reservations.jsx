import React, { useState, useEffect, useRef } from "react";
import './Reservations.css'
import Button from './components/Button'
import Form from './components/Form'

function Reservations({ addPopup, userID, copyID, dias_prestamo }) {
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)

    const timelineRef = useRef(null);

    const DAYS = 30

    useEffect(() => {
        const container = timelineRef.current;
        
        if (!container) return;

        const handleWheel = (event) => {
            event.preventDefault();
            container.scrollLeft += event.deltaY;
        };

        container.addEventListener("wheel", handleWheel, {
            passive: false
        });
        
        return () => {
            container.removeEventListener("wheel", handleWheel);
        };
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true)

            if (!copyID) {
                setReservations([])
                return
            }

            const res = await fetch(`http://localhost:3001/reservations/${copyID}`)
            const data = await res.json()
            setReservations(data || [])
        } catch (err) {
            console.error(err)
            setReservations([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [copyID])

    const buildDays = () => {
        const days = []
        const start = new Date()
        start.setHours(0,0,0,0)
        for (let i = 0; i < DAYS; i++) {
            const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
            days.push(d)
        }
        return days
    }

    const days = buildDays()

    const parseLocalDate = (dateString) => {
        if (!dateString) return null
        const datePart = String(dateString).split('T')[0]
        const [year, month, day] = datePart.split('-').map(Number)
        if (!year || !month || !day) {
            const parsed = new Date(dateString)
            if (Number.isNaN(parsed.getTime())) return null
            parsed.setHours(0, 0, 0, 0)
            return parsed
        }
        return new Date(year, month - 1, day)
    }

    const reservationStatus = (day) => {
        const ownReservation = reservations.find(r => {
            if (!userID) return false
            const s = parseLocalDate(r.fecha_inicio)
            const e = parseLocalDate(r.fecha_fin)
            if (!s || !e) return false
            return day >= s && day <= e && Number(r.id_usuario) === Number(userID)
        })
        if (ownReservation) return 'owned'

        const otherReservation = reservations.find(r => {
            const s = parseLocalDate(r.fecha_inicio)
            const e = parseLocalDate(r.fecha_fin)
            if (!s || !e) return false
            return day >= s && day <= e
        })
        return otherReservation ? 'occupied' : ''
    }


    const openReservationForm = () => {
        const inputs = [
            { label: 'Fecha inicio', name: 'fecha_inicio', type: 'datepicker', required: true },
            { label: 'Fecha fin', name: 'fecha_fin', type: 'datepicker', required: true }
        ]

        const handleSubmit = async (data) => {
            const payload = {
                ...data,
                fecha_inicio: data.fecha_inicio ? data.fecha_inicio.toISOString().slice(0,10) : null,
                fecha_fin: data.fecha_fin ? data.fecha_fin.toISOString().slice(0,10) : null,
                id_usuario: userID,
                id_ejemplar: copyID
            }

            try {
                const res = await fetch('http://localhost:3001/reservations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                const result = await res.json()
                if (res.ok) {
                    fetchReservations()
                    return true
                } else {
                    addPopup(result.error || 'Error creando reserva')
                    return false
                }
            } catch (err) {
                console.error(err)
                addPopup('Error conectando con el servidor')
                return false
            }
        }

        addPopup(
            <div className='reservation-popup'>
                <Form
                    inputs={inputs}
                    tile={'Nueva Reserva'}
                    submitText={'Reservar'}
                    getData={async (formData) => {
                        const ok = await handleSubmit(formData)
                        if (ok) {
                            //esto lo hare luego <- que se cierre solo
                        }
                    }}
                />
            </div>
        , 'auto', 'auto')
    }

    return (
        <div className='reservations-content'>
            <h2>Reservas (próximos {DAYS} días.)</h2>
            <p>dias maximos de reserva: {dias_prestamo}</p>
            <div className='timeline-container' ref={timelineRef}>
                <div className='timeline'>
                    {days.map((d, idx) => {
                        const status = reservationStatus(d)
                        const label = d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
                        return (
                            <div key={idx} className={`day-block ${status}`} title={label}>
                                <div className='day-label'>{label}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className='reserve-action'>
                <Button className='reserve-button' onClick={openReservationForm} text={'Reservar'} />
            </div>
        </div>
    )
}

export default Reservations