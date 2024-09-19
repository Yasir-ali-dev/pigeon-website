import { Progress, Tag } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Image } from "react-bootstrap";
import "../index.css";
import TournamentContext from "./Contexts/TournamentContext";
import PigeonContext from "./Contexts/PigeonContext";
import BannerContext from "./Contexts/BannerContext";
import ClubsContext from "./Contexts/ClubsContext";
import { NavLink, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { tournaments } = useContext(TournamentContext);
  const { owners } = useContext(PigeonContext);
  const { banners } = useContext(BannerContext);
  const { clubs } = useContext(ClubsContext);
  return (
    <div className="d-flex ">
      {windowWidth > 700 && (
        <div>
          <Card style={{ width: "13rem", height: "90vh" }}>
            <Card.Body>
              <Image src="/clubs.png" alt="club_img" />
              <Card.Title className="color-orange text-capitalize">
                <h5>{user.name} Dashboard</h5>
              </Card.Title>
              <Card.Text>{user.email}</Card.Text>
              <hr />
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
      )}
      <div className="d-flex flex-wrap justify-content-center align-items-start gap-2 p-2">
        {owners &&
          ["tournaments", "pigeonOwners", "banners", "clubs"].map(
            (_, index) => {
              return (
                <>
                  <Card style={{ width: "20rem", height: "10rem" }}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <Card.Subtitle>
                        <NavLink
                          style={({ isActive, isTransitioning }) => {
                            return {
                              color: isActive ? "blue" : "black",
                            };
                          }}
                          to={`/${_}`}
                          className={"text-decoration-none text-capitalize"}
                        >
                          {_}
                        </NavLink>
                      </Card.Subtitle>
                      {index === 0 && (
                        <Image
                          src="/tournament.png"
                          alt="club_img"
                          width={"30px"}
                        />
                      )}
                      {index === 1 && (
                        <Image
                          src="/pigeon.png"
                          alt="pigeon_img"
                          width={"30px"}
                        />
                      )}
                      {index === 2 && (
                        <Image
                          src="/banner.png"
                          alt="banner_img"
                          width={"30px"}
                        />
                      )}
                      {index === 3 && (
                        <Image
                          src="/clubs.png"
                          alt="banner_img"
                          width={"30px"}
                        />
                      )}
                    </Card.Header>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <Card.Subtitle className="mb-2 display-3 text-secondary">
                        {(index === 0 && tournaments.length) ||
                          (index === 1 && owners.length) ||
                          (index === 2 && banners.length) ||
                          (index === 3 && clubs.length)}
                      </Card.Subtitle>
                      <Progress
                        type="circle"
                        percent={
                          (index === 0 && tournaments.length * 100) ||
                          (index === 1 && tournaments.length * 100) ||
                          (index === 2 && owners.length * 100) ||
                          (index === 3 && clubs.length * 100)
                        }
                        size={"small"}
                      />
                    </Card.Body>
                  </Card>
                </>
              );
            }
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;
