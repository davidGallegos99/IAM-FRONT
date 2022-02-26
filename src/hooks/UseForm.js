import React, { useState } from 'react'

export const UseForm = (initialState = {}) => {
    const [state, setstate] = useState(initialState);

    const handleInputChange = ({target}) => {
        setstate({
            ...state,
            [target.name]: target.value
        })
    }

    const reset = () => {
        setstate({});
    }
    return [state, handleInputChange , reset]
}
