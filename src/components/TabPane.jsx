import React, { useEffect, useRef } from 'react'
import '../styles/tabs.css'

export const TabPane = ({
    data,
    click
}) => {
    const handleClick = (evt) => {
        click();
        changeActive(evt);
    }
    const changeActive = (evt) => {
        let tablinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }  
        evt.currentTarget.className += " active";
  
    }
  return (
    <button key={data._id} onClick={handleClick} className="tablinks" >{data.name}</button>

  )
}
