import { Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Image, Row, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const LandingClubs = () => {
  const [tournaments, setTournaments] = useState([]);
  const { id } = useLocation().state;

  const fetchClubTournaments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/tournaments/clubTournamentsWithPigeonOwners/:${id}`
      );
      console.log(response);

      if (response.data.success) {
        setTournaments(response.data.clubTournamentsPigeonOwners);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };
  useEffect(() => {
    fetchClubTournaments();
  }, []);

  return (
    <div>
      {tournaments.length > 0 ? (
        <div className="py-2 d-flex flex-column gap-3 px-3">
          {tournaments.map((tournament, index) => {
            return (
              <Row className="align-items-start" key={index}>
                <Col md={3} className="text-start">
                  <Image
                    src={`${process.env.REACT_APP_API}/uploads/${tournament.image}`}
                    alt={tournament.tournamentName}
                    fluid
                    className="shadow rounded"
                    style={{ maxHeight: "100%", objectFit: "cover" }}
                  />
                </Col>

                {/* Right Side - Tournament Details */}
                <Col md={9}>
                  <Card className="shadow-sm px-3">
                    <Card.Body>
                      <Card.Title className="display-6">
                        {tournament.tournamentName}
                      </Card.Title>
                      <Card.Subtitle className="text-muted px-1 mb-2">
                        {new Date(
                          tournament.startDate.slice(0, 10)
                        ).toLocaleDateString()}
                      </Card.Subtitle>
                      <>
                        <Table bordered striped hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Pigeon Owner</th>
                              <th>City & Phone</th>
                              <th>Total Time</th>
                              <th>1st Prize</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tournament?.pigeonOwners.map(
                              (pigeonOwner, index) => {
                                return (
                                  <tr>
                                    <td>{index}</td>
                                    <td>{pigeonOwner?.name}</td>
                                    <td>
                                      {pigeonOwner?.city}{" "}
                                      <Tag color="blue">
                                        {pigeonOwner?.contacts}
                                      </Tag>
                                    </td>
                                    <td>
                                      {pigeonOwner?.pigeonsResults?.total}{" "}
                                    </td>
                                    <td>{tournament.prize1}</td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </Table>
                      </>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            );
          })}
        </div>
      ) : (
        <div className="w-100 d-flex align-items-center flex-column justify-content-center py-2">
          <Image src="/empty.png" alt="not-found image" />
          <p className="fs-3">Records are Empty</p>
          <Link
            to={"/"}
            className="text-decoration-none bg-secondary px-2 rounded text-light fs-4"
          >
            back To Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default LandingClubs;
