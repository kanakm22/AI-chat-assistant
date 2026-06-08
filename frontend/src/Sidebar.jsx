import "./Sidebar.css"

function Sidebar() {
  return ( 
    <section className="sidebar">
    {/* new chat button */}
    <button>
      <img src="src/assets/logo.png" alt="Forge" className="logo" />
      <span><i className="fa-solid fa-pen-to-square "></i></span>
    </button>

    {/* history */}
    <ul className="history">
      <li>history 1</li>
      <li>history 2</li>
      <li>history 3</li>
      <li>history 4</li>

    </ul>

    {/* sign */}
    <div className="sign">
      <p>By Forge &hearts;</p>
    </div>
    </section>
   );
}

export default Sidebar;