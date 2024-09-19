import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

const ClubDashboardContainer = () => {
  const { slug } = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>Pigeon</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link>
                <NavLink to={""}></NavLink>
              </Nav.Link>
              <Nav.Link></Nav.Link>
              <NavDropdown title="Tournaments">
                <NavDropdown.Item>
                  <NavLink
                    to={`/club/:${slug}/tournaments`}
                    style={({ isActive, isTransitioning }) => {
                      return {
                        color: isActive ? "blue" : "black",
                      };
                    }}
                    className={"text-decoration-none"}
                  >
                    tournaments
                  </NavLink>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <NavLink
                    to={`/club/:${slug}/createTournaments`}
                    style={({ isActive, isTransitioning }) => {
                      return {
                        color: isActive ? "blue" : "black",
                      };
                    }}
                    className={"text-decoration-none"}
                  >
                    Create tournament
                  </NavLink>
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Participants">
                <NavDropdown.Item>
                  <NavLink
                    to={`/club/:${slug}/pigeonOwners`}
                    style={({ isActive, isTransitioning }) => {
                      return {
                        color: isActive ? "blue" : "black",
                      };
                    }}
                    className={"text-decoration-none"}
                  >
                    Participants
                  </NavLink>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <NavLink
                    to={`/club/:${slug}/pigeonOwnerForm`}
                    style={({ isActive, isTransitioning }) => {
                      return {
                        color: isActive ? "blue" : "black",
                      };
                    }}
                    className={"text-decoration-none"}
                  >
                    Create Particiapant
                  </NavLink>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="d-flex gap-1">
        <div className="w-100 pb-4">
          <h4 className="py-2 px-1 text-center">
            Welcome to{" "}
            <h4
              className="text-capitalize fw-bolder"
              style={{
                color: "#ffa76e",
                textShadow: "1px 1px 2px",
                display: "inline",
              }}
            >
              {slug}
            </h4>
          </h4>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubDashboardContainer;
