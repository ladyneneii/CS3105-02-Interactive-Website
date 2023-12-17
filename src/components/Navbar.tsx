import { useEffect, useRef } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";

interface NavbarComponentProps {
  handleNavbarHeightChange?: (height: number) => void;
}

const Navbar = ({ handleNavbarHeightChange }: NavbarComponentProps) => {
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const navbarHeight = navbarRef.current ? navbarRef.current.clientHeight : 0;
    if (handleNavbarHeightChange){
      handleNavbarHeightChange(navbarHeight);
    }
  }, [handleNavbarHeightChange]);
  
  return (
    <nav ref={navbarRef} className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/MainPage">
          Padayon
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/MainPage"
                className="nav-link active"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/SignIn" className="nav-link">
                Log Out
                {/* TODO: erase user info from localstorage */}
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/PostsPage" className="nav-link">
                Safe Space
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/MessagesPage" className="nav-link">
                Messages
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/TheWorldPage" className="nav-link">
                The World
              </Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
