import { useState } from 'react'
import './Book.css'
import Panel from './Panel'

function Book({setBook}) {
  return (
    <div className='book_overlay'>
        <Panel background={false} setPanel={() => setBook(0)} className='book_panel'>
            <p>a</p>
        </Panel>
    </div>
  )
}

export default Book
