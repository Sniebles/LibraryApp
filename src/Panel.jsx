import './Panel.css'

function Panel({children, setPanel}) {
  return (
    <div className='panel'>
        {children}
        <div className='panel_exit_div'>
            <button className='panel_exit_b non-selectable' onClick={() => setPanel(0)}>×</button>
        </div>
    </div>
  )
}

export default Panel
