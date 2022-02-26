import { ArrowLeftOutlined } from '@ant-design/icons/lib/icons'
import React, { useState } from 'react'
import '../styles/tabs.css'
import { TabPane } from './TabPane'

export const Tabs = ({
    columns,
    children
}) => {
    const handleClick = (data) => {
        setstate(data)
    }
    const [state, setstate] = useState(null)
  return (
      <div className='tab-container'>
        <div className="tab">
        {
            columns.map(el => (
                <TabPane click={()=>handleClick(el)} key={el._id} data={el}>
                    
                </TabPane>
            ))
        }
        </div>
        {
            state && (
                <div className="tabcontent">
                    {React.cloneElement(children,{data:state})}
                </div>
            )
        }
      </div>
  )
}
