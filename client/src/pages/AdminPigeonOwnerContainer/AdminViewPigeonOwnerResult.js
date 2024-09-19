import { Breadcrumb, Tag } from "antd";
import React from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

const AdminViewPigeonOwnerResult = () => {
  const { owner } = useLocation().state;
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container>
      <Breadcrumb
        style={{ color: "#ffa76e" }}
        className="px-2 py-3"
        items={[
          {
            title: "Dashboard",
          },
          {
            title: (
              <NavLink
                style={({ isActive, isTransitioning }) => {
                  return {
                    color: isActive ? "black" : "#ffa76e",
                    fontWeight: isActive ? "normal" : "bold",
                    backgroundColor: isActive ? "#ffa76e" : "",
                    viewTransitionName: isTransitioning ? "slide" : "",
                  };
                }}
                className={"text-decoration-none"}
                to={`/pigeonOwners`}
              >
                Pigeon Owners
              </NavLink>
            ),
          },
          {
            title: (
              <p
                style={{
                  backgroundColor: "#ffa76e",
                  borderRadius: "5px",
                  padding: "0px 4px",
                }}
                className={"text-decoration-none"}
              >
                {owner.name}
              </p>
            ),
          },
        ]}
      />
      <Row className="align-items-center">
        {/* Left Side - Image */}
        <Col md={5} className="text-center">
          {owner.image ? (
            <Image
              src={`${process.env.REACT_APP_API}/uploads/${owner.image}`}
              alt={owner.name}
              fluid
              className="shadow-lg rounded"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          ) : (
            <Image
              className="rounded"
              src={`/person.png`}
              width="40"
              height="40"
            />
          )}
        </Col>

        <Col md={7}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title className="display-6">{owner.name}</Card.Title>
              <Card.Subtitle className="text-muted mb-3">
                {owner.city}
              </Card.Subtitle>
              <hr />
              {/* Pigeon Results */}
              <h5 className="mb-3">Pigeon Results</h5>
              <ul className="list-unstyled ">
                <li>
                  Total Pigeons:{" "}
                  <Tag color="red">
                    {owner?.pigeonsResults?.totalPigeons || "N/A"}
                  </Tag>
                </li>

                <li>
                  First Pigeon Return Time:{" "}
                  <Tag color="blue">
                    {owner?.pigeonsResults?.firstPigeonReturnTime || "N/A"}
                  </Tag>
                </li>
                <li>
                  Second Pigeon Return Time:{" "}
                  <Tag color="blue">
                    {owner?.pigeonsResults?.secondPigeonReturnTime || "N/A"}
                  </Tag>
                </li>
                <li>
                  Third Pigeon Return Time:{" "}
                  <Tag color="blue">
                    {owner?.pigeonsResults?.thirdPigeonReturnTime || "N/A"}
                  </Tag>
                </li>
                <li>
                  Fourth Pigeon Return Time:{" "}
                  <Tag color="blue">
                    {owner?.pigeonsResults?.fourthPigeonReturnTime || "N/A"}
                  </Tag>
                </li>
                <li>
                  Fifth Pigeon Return Time:{" "}
                  <Tag color="blue">
                    {owner?.pigeonsResults?.fifthPigeonReturnTime || "N/A"}
                  </Tag>
                </li>
                <li>
                  Sixth Pigeon Return Time:{" "}
                  <Tag color="blue">
                    {owner?.pigeonsResults?.sixthPigeonReturnTime || "N/A"}
                  </Tag>
                </li>
                <li>
                  Seventh Pigeon Return Time:{" "}
                  <Tag color="blue">
                    {owner?.pigeonsResults?.seventhPigeonReturnTime || "N/A"}
                  </Tag>
                </li>
                <li>
                  <strong>Total Time:</strong>{" "}
                  <Tag color="red">{owner?.pigeonsResults?.total || "N/A"}</Tag>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminViewPigeonOwnerResult;
