import './Sidebar.css';

export default function SidebarItem({ id, symbol, hoverText, handlePaneSelect }) {
  return (
    <div className="sidebarItem">
      <button type="button" id={id} onClick={handlePaneSelect}>
        <span className="sidebarSymbol material-symbols-outlined">
          {symbol}
        </span>
      </button>
    </div>
  )
}