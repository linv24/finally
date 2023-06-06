import SidebarItem from './SidebarItem';
import '../styles/Sidebar.css'

export default function Sidebar({ handlePaneSelect }) {
  return (
  <div className="sidebarContainer">
    <SidebarItem
      id="profile"
      symbol="account_circle"
      handlePaneSelect={handlePaneSelect} />
    <SidebarItem
      id="taskList"
      symbol="check_box"
      handlePaneSelect={handlePaneSelect} />
    <SidebarItem
      id="timeBox"
      symbol="calendar_view_day"
      handlePaneSelect={handlePaneSelect} />
  </div>
  );
}