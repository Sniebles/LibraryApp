import './Section.css'
import Box from './Box'

function Section({img, text, onClick}) {
  return (
    <Box onClick={onClick} className="section_box" width="25em" height="30rem">
        <img className='section_img' src={img} />
        <div className='book_title_background' />
        <div className='book_title_div'>
            <h1 className='book_title'>{text}</h1>
        </div>
    </Box>
  )
}

export default Section
