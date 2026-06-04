import React, { useState, useEffect, Fragment } from 'react'
import './Form.css'
import Button from './Button'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const getInitialFormData = (inputs) => {
    return inputs.reduce((acc, input) => {
        if (!input.name) return acc

        if (input.type === 'checkbox') {
            acc[input.name] = input.checked ?? false
        } else if (input.type === 'range') {
            acc[input.name] = input.value !== undefined ? Number(input.value) : Number(input.min ?? 0)
        } else if (input.type === 'datepicker') {
            acc[input.name] = input.value || null
        } else if (input.value !== undefined) {
            acc[input.name] = input.value
        }

        return acc
    }, {})
}

function Form({inputs, tile, submitText, getData, close}) {
    const [formData, setFormData] = useState(() => getInitialFormData(inputs))

    useEffect(() => {
        setFormData(getInitialFormData(inputs))
    }, [inputs])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const nextValue =
            type === 'checkbox'
                ? checked
                : type === 'range'
                ? Number(value)
                : value

        setFormData(prev => ({ ...prev, [name]: nextValue }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        getData(formData, close)
    }

    const formatRangeValue = (input) => {
        const value = formData[input.name]
        if (value === undefined || value === null) return ''

        const unit =
            value === 1 && input.singularUnit != null
                ? input.singularUnit
                : input.unit

        return `${value}${unit ? ` ${unit}` : ''}`
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
                                type='checkbox'
                                required={!!input.required}
                                name={input.name}
                                checked={!!formData[input.name]}
                                onChange={handleChange}
                            />
                            <label htmlFor={index}>{input.label}</label>
                        </div>
                    ) : input.type === 'datepicker' ? (
                        <>
                            <label htmlFor={index}>{input.label}</label>
                            <DatePicker
                                autoComplete='off'
                                id={index}
                                selected={formData[input.name] || null}
                                onChange={(date) => setFormData(prev => ({ ...prev, [input.name]: date }))}
                                placeholderText={input.placeholder || ''}
                                dateFormat={input.dateFormat || 'yyyy-MM-dd'}
                                className='form-datepicker'
                            />
                        </>
                    ) : input.type === 'range' ? (
                        <div className='form-range-container'>
                            <label htmlFor={index}>{input.label}</label>
                            <input
                                id={index}
                                type='range'
                                required={!!input.required}
                                name={input.name}
                                min={input.min}
                                max={input.max}
                                value={formData[input.name] ?? input.value ?? input.min ?? 0}
                                onChange={handleChange}
                                className='form-range'
                            />
                            <span className='range-value'>{formatRangeValue(input)}</span>
                        </div>
                    ) : (
                        <>
                            <label htmlFor={index}>{input.label}</label>
                            <input
                                id={index}
                                type={input.type}
                                required={!!input.required}
                                placeholder={input.placeholder}
                                name={input.name}
                                value={formData[input.name] ?? ''}
                                onChange={handleChange}
                            />
                        </>
                    )}
                </Fragment>
            ))}
            <Button className='form-button' type='submit' text={submitText} />
        </form>
    )
}

export default Form