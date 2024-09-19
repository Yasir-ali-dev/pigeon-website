import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Carousel, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Select, Tag } from "antd";
import toast from "react-hot-toast";
import TournamentContext from "./Contexts/TournamentContext";
import ClubsContext from "./Contexts/ClubsContext";
import Footer from "./components/Footer";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const { clubs } = useContext(ClubsContext);
  const [results, setResults] = useState([]);
  const { tournaments, fetchTournaments } = useContext(TournamentContext);
  const [tournament, setTournament] = useState({});
  const [images, setImages] = useState([]);
  const [ownerWithLatestTime, setOwnerWithLatestTime] = useState({});
  const navigate = useNavigate();

  const timeToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Function to calculate the last return time (latest) from all pigeon owners

  // Function to calculate the last return time (latest) from all pigeon owners
  const getLastReturnTime = (results) => {
    let latestTimeInSeconds = 0; // Store the latest time in seconds
    let ownerWithLatestTime = {}; // Object to store the owner details with the latest return time

    results.forEach((owner, index) => {
      const { pigeonsResults } = owner;

      // Extract return times for each pigeon
      const returnTimes = [
        pigeonsResults.firstPigeonReturnTime,
        pigeonsResults.secondPigeonReturnTime,
        pigeonsResults.thirdPigeonReturnTime,
        pigeonsResults.fourthPigeonReturnTime,
        pigeonsResults.fifthPigeonReturnTime,
        pigeonsResults.sixthPigeonReturnTime,
        pigeonsResults.seventhPigeonReturnTime,
      ];

      // Convert return times to seconds and filter out any undefined/null times
      const validReturnTimesInSeconds = returnTimes
        .filter((time) => time) // Remove any null/undefined times
        .map(timeToSeconds);

      // Find the latest return time for this owner
      const ownerLatestTime = Math.max(...validReturnTimesInSeconds);

      // Update the overall latest time if the owner's time is greater
      if (ownerLatestTime > latestTimeInSeconds) {
        latestTimeInSeconds = ownerLatestTime;
        ownerWithLatestTime = {
          name: owner.name, // Pigeon owner's name
          owner: owner,
        };
      }
    });

    // Convert the latest time back to hours, minutes, and seconds format
    const hours = Math.floor(latestTimeInSeconds / 3600);
    const minutes = Math.floor((latestTimeInSeconds % 3600) / 60);
    const seconds = latestTimeInSeconds % 60;

    // Return the owner details and the formatted latest time
    setOwnerWithLatestTime({
      latestTime: `${hours}:${minutes}:${seconds}`,
      ownerWithLatestTime,
    });
  };

  const fetchResults = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/pigeonOwners/:${id}`
      );
      getLastReturnTime(response.data.pigeonOwners);

      setResults(response.data.pigeonOwners);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const handleTournamentChange = async (tournament) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/tournaments/:${tournament}`
      );
      setTournament(response.data.tournament);

      fetchResults(tournament);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/images`
      );
      setImages(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchImages();
    fetchTournaments();
  }, []);
  console.log(ownerWithLatestTime);

  return (
    <>
      <div>
        <main className="main">
          <Carousel interval={2000} className="carousel-inner">
            {images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={`${process.env.REACT_APP_API}/uploads/${image.imageUrl}`}
                  className="d-block w-100"
                  alt="carousel"
                  style={{ width: "100vw", height: "50vh" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <div
            // style={{ backgroundColor: "#FF551D" }}
            className="d-flex gap-3 py-2 px-3 justify-content-center flex-wrap align-items-center"
          >
            <Link
              className="text-decoration-none bg-danger rounded px-2 py-1 text-light"
              to={`/`}
            >
              Home
            </Link>
            {clubs.map((club, index) => (
              <div className="rounded" key={index}>
                <Link
                  // style={{ backgroundColor: "#FF551D" }}

                  className="text-decoration-none bg-primary border rounded px-2 py-1 text-light"
                  to={`/cl`}
                  state={{ id: club._id }}
                >
                  {club.cname}
                </Link>
              </div>
            ))}
            <Link
              className="text-decoration-none bg-primary text-light rounded px-2 py-1 text-light"
              to={`/login`}
            >
              Contact Us
            </Link>

            <Link
              className="text-decoration-none bg-danger rounded px-2 py-1 text-light"
              to={`/login`}
            >
              Login
            </Link>
          </div>

          <div className="d-flex py-3 px-2 justify-content-center align-items-center flex-column">
            <div className="px-3">
              <div className=" me-3 d-flex align-items-center gap-3">
                <Select
                  className="w-100"
                  type="text"
                  name="tournament"
                  size="large"
                  placeholder="Select Tournament"
                  onChange={handleTournamentChange}
                >
                  <Select.Option></Select.Option>
                  {tournaments &&
                    tournaments.map((_, index) => {
                      return (
                        <Select.Option key={index} value={_._id}>
                          {_.tournamentName}
                        </Select.Option>
                      );
                    })}
                </Select>
              </div>
              <div className="d-flex pt-2 justify-content-center align-items-center">
                <h4 style={{ marginTop: "7px" }} className="start-time-title">
                  {tournament.tournamentName} Start Time
                  <span className="timer">{tournament.startTime} </span>{" "}
                </h4>
              </div>
              {/* ============================================ */}
              <Table className="results-table">
                <Thead>
                  <Tr className="text-center home-table-style">
                    <Th>Participating Lofts </Th>
                    <Th>Total Pigeons</Th>
                    <Th>Landed Pigeons </Th>
                    <Th>Remaining Pigeons</Th>
                    <Th>Is Live</Th>
                    <Th>Today's winner pigeon time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      <div className="total-count-number">
                        {tournament?.pigeonOwners?.length}{" "}
                      </div>
                    </Td>
                    <Td>
                      <div className="total-count-number">
                        {tournament.numberOfPigeons}
                      </div>{" "}
                    </Td>
                    <Td>
                      <div className="total-count-number">
                        {tournament.landedPigeons}
                      </div>{" "}
                    </Td>
                    <Td>
                      <div className="total-count-number">
                        {tournament.numberOfPigeons &&
                          tournament.numberOfPigeons - tournament.landedPigeons}
                      </div>
                    </Td>
                    <Td>
                      {" "}
                      <div className="total-count-number">
                        {tournament.status_}
                      </div>
                    </Td>
                    <Td>
                      <div className="total-count-number">
                        {ownerWithLatestTime &&
                          ownerWithLatestTime?.ownerWithLatestTime?.name}{" "}
                      </div>
                      <h4 className="d-inline">
                        <div className="badge bg-primary">
                          {ownerWithLatestTime &&
                            ownerWithLatestTime.latestTime}
                        </div>
                      </h4>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
            <Table className="results-table">
              <Thead>
                <Tr className="text-center">
                  <Th>Sr No.</Th>
                  <Th>Pigeon Owner</Th>
                  <Th>No of Pigeons</Th>
                  <Th>#1</Th>
                  <Th>#2</Th>
                  <Th>#3</Th>
                  <Th>#4</Th>
                  <Th>#5</Th>
                  <Th>#6</Th>
                  <Th>#7</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody className="text-center">
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td className="d-flex align-items-center justify-content-start gap-2">
                        {result.image ? (
                          <Image
                            className="rounded"
                            src={`${process.env.REACT_APP_API}/uploads/${result.image}`}
                            width="40"
                            height="40"
                          />
                        ) : (
                          <Image
                            className="rounded"
                            src={`/person.png`}
                            width="40"
                            height="40"
                          />
                        )}
                        {result.name}
                      </Td>

                      <Td>{result?.pigeonsResults?.totalPigeons}</Td>
                      <Td>{result?.pigeonsResults?.firstPigeonReturnTime}</Td>
                      <Td>{result?.pigeonsResults?.secondPigeonReturnTime}</Td>
                      <Td>{result?.pigeonsResults?.thirdPigeonReturnTime}</Td>
                      <Td>{result?.pigeonsResults?.fourthPigeonReturnTime}</Td>
                      <Td>{result?.pigeonsResults?.fifthPigeonReturnTime}</Td>
                      <Td>{result?.pigeonsResults?.sixthPigeonReturnTime}</Td>
                      <Td>{result?.pigeonsResults?.seventhPigeonReturnTime}</Td>
                      <Td>
                        <Tag color="orange">
                          {result?.pigeonsResults?.total}
                        </Tag>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={11}>
                      <Image src="/empty.png" alt="empty_img" />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
        </main>
      </div>
      {/* <div className="d-flex  justify-content-end align-items-center">
        {!token ? (
          <Button
            className="mx-2 px-3"
            variant="outline-dark"
            size="sm"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        ) : (
          <Button
            className="mx-2 px-3"
            variant="outline-dark"
            size="sm"
            onClick={() => {
              user.role === 1 && navigate("/dashboard");
              user.role === 0 && navigate(`/club/:${user.slug}/`);
            }}
          >
            Dashboard
          </Button>
        )}
      </div> */}
      <Footer />
    </>
  );
};

export default Dashboard;
