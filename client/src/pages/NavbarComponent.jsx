import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useNavigate } from 'react-router-dom';

function NavbarComponent() {
  const navigate= useNavigate()
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
      <Navbar.Brand>Pigeon</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        
          <Nav className="ms-auto">
          <Nav.Link >
            <NavLink style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",

                    };
                  }} to={"/clubs"}></NavLink>
          </Nav.Link>
            <Nav.Link>
            </Nav.Link>
            <NavDropdown title="Clubs Detail">
              <NavDropdown.Item>
                <NavLink style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",

                    };
                  }} className={"text-decoration-none"} to={"/clubs"}>All Clubs</NavLink>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <NavLink style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",

                    };
                  }} className={"text-decoration-none"} to={"/clubs/create"}>Create Clubs</NavLink>
              </NavDropdown.Item> 
            </NavDropdown>
            <NavDropdown title="Tournaments">
              <NavDropdown.Item>
                <NavLink 
                  className={"text-decoration-none"} to={"/tournaments"}
                  style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",

                    };
                  }}
                  >Tournaments</NavLink>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <NavLink 
                style={({ isActive, isTransitioning }) => {
                  return {
                    color: isActive ? "blue" : "black",

                  };
                }}
                className={"text-decoration-none"} to={"/tournaments/tournamentForm"}>Create Tournament</NavLink>
              </NavDropdown.Item> 
            </NavDropdown>

            <NavDropdown title="Pigeon Owners">
              <NavDropdown.Item>
                <NavLink style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",

                    };
                  }} className={"text-decoration-none"} to={"/pigeonOwners"}>Pigeon Owners</NavLink>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <NavLink style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",
                    };
                  }} className={"text-decoration-none"} to={"/pigeonOwners/pigeonOwnerForm"}>Create Pigeon Owner</NavLink>
              </NavDropdown.Item> 
            </NavDropdown>


            <NavDropdown title="Banners">
              <NavDropdown.Item>
                <NavLink style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",

                    };
                  }} className={"text-decoration-none"} to={"/banners"}>Banners</NavLink>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <NavLink style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",
                    };
                  }} className={"text-decoration-none"} to={"/banners/bannerForm"}>Create Banner</NavLink>
              </NavDropdown.Item> 
            </NavDropdown>
            <NavDropdown title="Logout">
              <NavDropdown.Item>
                <Button
                  variant="outline-dark"
                  size='sm'
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  >
                  Log Out
                </Button>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>
        </Container>
        </Navbar>
  );
}

export default NavbarComponent;

