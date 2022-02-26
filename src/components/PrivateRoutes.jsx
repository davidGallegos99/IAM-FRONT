import React, { Fragment } from 'react'


export const PrivateRoutes = ({
  isAuthenticated,
  isChecking,
  component: Component
}) => {
  const Loading = () => ( 
    <div>
      <h1>Cargando...</h1>
    </div>
  )
  return (
    <>
        {
          isChecking && (
            <Loading />
          )
        }

        {
          isAuthenticated && !isChecking && (
            <Component />
          )
        }
    </>
  )
}
