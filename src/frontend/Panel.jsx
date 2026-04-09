import './Panel.css'

function Panel({children, setPanel, className, type=1, background=true}) {
  return (
    <div className={`${background? 'panel_ovelay':''}`}>
      <div className={`${type==1? 'panel':''} ${className ? ` ${className}` : ''}`}>
          {children}
          <div className='panel_exit_div'>
              <button className='panel_exit_b non-selectable' onClick={() => setPanel(0)}>×</button>
          </div>
      </div>
    </div>
  )
}

export default Panel
