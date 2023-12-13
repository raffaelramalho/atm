// @ts-expect-error TS6133
import React from 'react'

export default function Error() {
  return (
    <div className='flex flex-row h-screen w-full'>
        <div className='flex flex-col w-full py-48 items-center'>
        <h1 className='font-bold'>ERRO 404</h1>
        <p>Não encontramos essa página essa página D:</p>
        <img src="../ghost.gif" alt="runner" className='h-20 w-20' />
        </div>
    </div>
  )
}
