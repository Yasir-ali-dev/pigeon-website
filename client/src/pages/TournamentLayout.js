import { Breadcrumb } from "antd";
import React from "react";
import { Container } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

const TournamentLayout = () => {
  return (
    <div className="py-3">
      <Container>
        <Breadcrumb
          className="px-2 pb-2"
          items={[
            {
              title: (
                <NavLink
                  to={"/dashboard"}
                  style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "orange" : "black",
                      fontWeight: isActive ? "bold" : "normal",
                      viewTransitionName: isTransitioning ? "slide" : "",
                    };
                  }}
                >
                  Dashboard
                </NavLink>
              ),
            },
            {
              title: (
                <NavLink
                  style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "orange" : "black",
                      fontWeight: isActive ? "bold" : "normal",
                      viewTransitionName: isTransitioning ? "slide" : "",
                    };
                  }}
                  to={"/tournaments"}
                >
                  Tournaments
                </NavLink>
              ),
            },
            {
              title: (
                <NavLink
                  style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "orange" : "black",
                      fontWeight: isActive ? "bold" : "normal",
                      viewTransitionName: isTransitioning ? "slide" : "",
                    };
                  }}
                  to={"/tournaments/tournamentForm"}
                >
                  Create Tournament
                </NavLink>
              ),
            },
          ]}
        />
      </Container>
      <Outlet />
    </div>
  );
};

export default TournamentLayout;
