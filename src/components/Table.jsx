import React, { useEffect, useRef, useState } from 'react'
import '../styles/table.css'
import { Button } from './Button'
import { Spinner } from './Spinner'
import Next from '../assets/icons/next.svg'
import Prev from '../assets/icons/prev.svg'


export const Table = ({
    columns,
    data,
    showButton,
    header,
    textButton,
    iconButton,
    pagination,
    loading,
    clickButton
}) => {
    

    const container = useRef(null)

    useEffect(()=>{
        if(pagination?.limit && data.length !== pagination.limit){
            container.current.style.height = 'auto'
        }else {
            container.current.style.height = '738px'
        }
    },[pagination])

    const Header = () => (
        <div className="header-table">
            <input type="search"  placeholder='Search' />
            {
                showButton && (
                    <Button
                        onclick={clickButton}
                        icon={iconButton}
                        color="var(--white)" 
                        background="var(--primary)"
                    >
                        {textButton}
                    </Button>
                )
            }
        </div>
    )

    const Footer = () => (
        <div className="footer-tabla">
            <p>{pagination?.skip+1}-{pagination?.skip == 0 ? pagination?.limit : pagination?.skip + pagination?.limit >= pagination.totalRecords ? pagination.totalRecords : pagination?.skip + pagination?.limit} of {pagination?.totalRecords}</p>
            <div>
                {pagination.skip > 0 && (
                    <><img onClick={pagination.handlePrev} className='change-page' src={Prev} alt="previous_page" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>

                )}
                {
                    pagination.skip + pagination.limit < pagination.totalRecords && (
                        <img onClick={pagination.handleNext} className='change-page' src={Next} alt="next_page" />
                    )
                }
            </div>
        </div>
    )

    
    
  return (
    <div className='table-container'>
        {
            header && (
                <Header/>
            )
        }
        <div ref={container} className="table-body">
            <table>
                <thead>
                    <tr>
                    {
                        columns.map(column => (
                            <th key={column.name}>{column.name}</th>
                        ))
                    }
                    </tr>
                </thead>
                
                <tbody>
                    {
                        !loading > 0 ?( 
                            data.map((record,index)=>(
                                <tr style={{background:(index%2==0)?'#ffff':'#F4F7FC'}} key={index}>
                                    {
                                       columns.map(el => (
                                            <td key={el.name}>{typeof el.dataIndex == 'function' ? el.dataIndex(record) : record[el.dataIndex]}</td>
                                        ))
                                    }
                                </tr>
                            ))
                        ): (
                                <tr>
                                    <td  colSpan={6} >
                                         <Spinner />
                                    </td>
                                </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
        {
           pagination && (
                <Footer />
            ) 
        }
    </div>
  )
}
