import React, { useState } from 'react'
import { Fragment } from 'react'
import './Form.css'
import Button from './Button'

function Form({inputs, tile, submitText, getData}) {
    const [formData, setFormData] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        getData(formData)
    }

    return (
        <form className='form' onSubmit={handleSubmit}>
            <h2>{tile}</h2>
            {inputs.map((input, index) => (
                <Fragment key={index}>
                    {input.type === 'checkbox' ? (
                        <div className='checkbox-container'>
                            <input
                                id={index}
                                type={input.type}
                                required={input.required?'required':''}
                                name={input.name}
                                onChange={handleChange}/>
                            <label for={index}>{input.label}</label>
                        </div>
                    ) : (
                        <>
                            <label htmlFor={index}>{input.label}</label>
                            <input
                                id={index}
                                type={input.type}
                                required={input.required?'required':''}
                                placeholder={input.placeholder}
                                name={input.name}
                                onChange={handleChange}
                            />
                        </>
                    )}
                </Fragment>
            ))}
            <Button className="form-button" type="submit" text={submitText} />
        </form>
    )
}

export default Form