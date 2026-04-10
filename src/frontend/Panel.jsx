import './Panel.css'

function Panel({children, setPanel, className, type=1, background=true}) {
  return (
    <div className={`${background? 'panel_ovelay':''}`}>
      <div className={`panel ${className ? ` ${className}` : ''}`}>
          <div className='panel_content'>
              {children}
          </div>
          <div className='panel_exit_div'>
              <button className='panel_exit_b non-selectable' onClick={() => setPanel(0)}>×</button>
          </div>
      </div>
    </div>
  )
}

export default Panel
