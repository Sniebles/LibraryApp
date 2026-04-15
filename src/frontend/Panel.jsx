import './Panel.css'

function Panel({children, setPanel, className, type=1, background=true, loose=false}) {
  const panel = 
  <div className={`panel ${className ? ` ${className}` : ''} ${loose ? 'panel_loose' : ''}`}>
    <div className='panel_content'>
      {children}
    </div>
    <div className='panel_exit_div'>
      <button className='panel_exit_b non-selectable' onClick={() => setPanel(0)}>×</button>
    </div>
  </div>;
  return (
    !background ? panel : <div className='panel_ovelay'>{panel}</div>
  )
}

export default Panel
