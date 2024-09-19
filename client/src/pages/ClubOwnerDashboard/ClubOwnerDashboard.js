import { Progress, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Image } from "react-bootstrap";
import "../../index.css";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const ClubOwnerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [pigeonOwnersLength, setpigeonOwnersLength] = useState(0);

  const fetchClubTournaments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/tournaments/club/:${user.id}`
      );
      fetchTournamentsPigeonOwners(response.data.clubTournaments);
      setTournaments(response.data.clubTournaments);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const fetchTournamentsPigeonOwners = async (arrayOfTournaments) => {
    const total = [];
    try {
      arrayOfTournaments.map(async (tournament) => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/pigeonOwners/:${tournament._id}`
          );
          total.push(res.data.pigeonOwners.length); // Handle the pigeon owners data
          console.log(res);
        } catch (error) {
          console.error(
            `Error fetching pigeon owners for tournament ${tournament._id}:`,
            error
          );
        }
        setpigeonOwnersLength(
          total.reduce(
            (accumulator, currentValue) => accumulator + currentValue
          )
        );
      });

      // if (response.data.success) {
      //   setTournaments(response.data.clubTournaments);
      // }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  useEffect(() => {
    fetchClubTournaments();
  }, []);

  return (
    <div className="d-flex ">
      <div>
        <Card style={{ width: "13rem", height: "90vh" }}>
          <Card.Body>
            <Image src="/clubs.png" alt="club_img" />
            <Card.Title className="color-orange text-capitalize">
              {user.name} Dashboard
            </Card.Title>
            <Card.Text>{user.email}</Card.Text>
            <hr />
            <div className="d-flex gap-3 flex-column text-decoration-none">
              <Button variant="outline-dark">
                <NavLink
                  style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",
                    };
                  }}
                  to={`/club/:${user.slug}/tournaments`}
                  className={"text-decoration-none"}
                >
                  Tournaments
                </NavLink>
              </Button>
              <Button variant="outline-dark">
                <NavLink
                  style={({ isActive, isTransitioning }) => {
                    return {
                      color: isActive ? "blue" : "black",
                    };
                  }}
                  to={`/club/:${user.slug}/pigeonOwners`}
                  className={"text-decoration-none"}
                >
                  Pigeon Owners
                </NavLink>
              </Button>
            </div>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-center">
            <Button
              variant="outline-dark"
              className={
                "text-decoration-none border border-dark rounded px-5 py-1"
              }
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Log Out
            </Button>
          </Card.Footer>
        </Card>
      </div>
      <div className="d-flex gap-2 p-2">
        {["Tournaments", "Pigeon Owners"].map((_, index) => {
          return (
            <Card style={{ width: "18rem", height: "10rem" }}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Subtitle style={{ color: "black" }}>
                  {index === 0 ? (
                    <NavLink
                      style={({ isActive }) => {
                        return {
                          color: isActive ? "blue" : "black",
                        };
                      }}
                      className={"text-decoration-none"}
                      to={`/club/:${user.slug}/tournaments`}
                    >
                      {" "}
                      {_}
                    </NavLink>
                  ) : (
                    <NavLink
                      style={({ isActive }) => {
                        return {
                          color: isActive ? "blue" : "black",
                        };
                      }}
                      className={"text-decoration-none"}
                      to={`/club/:${user.slug}/pigeonOwners`}
                    >
                      {" "}
                      {_}
                    </NavLink>
                  )}
                </Card.Subtitle>
                {index === 0 ? (
                  <Image src="/tournament.png" alt="club_img" width={"30px"} />
                ) : (
                  <Image src="/pigeon.png" alt="club_img" width={"30px"} />
                )}
              </Card.Header>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <Card.Subtitle className="mb-2 display-3 text-secondary">
                  {index === 0 ? tournaments.length : pigeonOwnersLength}
                </Card.Subtitle>
                <Progress
                  type="circle"
                  percent={tournaments.length * 990}
                  size={"small"}
                />
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ClubOwnerDashboard;
