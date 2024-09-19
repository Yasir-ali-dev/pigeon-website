import { Breadcrumb, Select, TimePicker } from "antd";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import TournamentContext from "../Contexts/TournamentContext";

const TournamentForm = () => {
  const navigate = useNavigate();
  const { setTournaments } = useContext(TournamentContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [tournamentDetails, setTournamentDetails] = useState({
    owner_id: user.id,
    image: "",
    tournamentName: "",
    tournamentInformation: "",
    startDate: "",
    numberOfDays: "",
    startTime: "",
    numberOfPigeons: "",
    helperPigeons: "",
    status_: "in active",
    numberOfPrizes: "",
    landedPigeons: 0,
    prizes: [],
    dates: [""],
  });

  const handleFormChange = (e, index) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      // Handle the image file
      const file = files[0]; // Get the first selected file
      setTournamentDetails((prevTournament) => {
        return {
          ...prevTournament,
          [name]: file, // Store the file in the state
        };
      });
    } else {
      // Handle text/other input types
      setTournamentDetails((prevTournament) => {
        return {
          ...prevTournament,
          [name]: value,
        };
      });
    }
    // Prize field
    if (name === "prize") {
      const updatePrizes = [...tournamentDetails.prizes];
      updatePrizes[index] = value; // update the specific prize by index
      setTournamentDetails({ ...tournamentDetails, prizes: updatePrizes });
    } else {
      setTournamentDetails({ ...tournamentDetails, [name]: value });
    }
  };

  // Remove Prize
  const removePrizes = (index) => {
    const updatedPrizes = tournamentDetails.prizes.filter(
      (prize, prizeIndex) => prizeIndex !== index
    );
    setTournamentDetails({ ...tournamentDetails, prizes: updatedPrizes });
  };

  const addPrizes = () => {
    setTournamentDetails({
      ...tournamentDetails,
      prizes: [...tournamentDetails.prizes, ""], // Add tournament Prize
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    console.log(tournamentDetails);
    try {
      response = await axios.post(
        "http://localhost:8080/api/v1/tournaments/",
        tournamentDetails,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      if (response.status === 201) {
        setTournaments((prev) => {
          return [...prev, response.data.newTournament];
        });
        toast.success(response.data.message);
        if (user.role === 1) {
          setTimeout(() => {
            navigate("/tournaments");
          }, [3000]);
        } else {
          setTimeout(() => {
            navigate(`/club/${user.slug}/tournaments`);
          }, [3000]);
        }
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    }
  };
  const generateTournamentDates = (startDate, numberOfDays) => {
    const dates = [];
    // Parse the start date into a Date object
    let currentDate = new Date(startDate);
    // Generate all the dates by incrementing the currentDate
    for (let i = 0; i < numberOfDays; i++) {
      const day = String(currentDate.getDate()).padStart(2, "0"); // Get day with leading zero
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Get month with leading zero (Months are 0-based)
      const year = currentDate.getFullYear(); // Get full year
      // Format the date to "DD-MM-YYYY" format
      const formattedDate = `${day}-${month}-${year}`;
      dates.push(formattedDate); // Add the formatted date to the list
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
    return dates;
  };

  let options;
  if (tournamentDetails.startDate && tournamentDetails.numberOfDays) {
    const dates = generateTournamentDates(
      tournamentDetails.startDate,
      tournamentDetails.numberOfDays
    );
    options = dates.map((_, index) => {
      return {
        key: _,
        value: _,
      };
    });
  }
  const handleDateSelectChange = (value) => {
    setTournamentDetails((prevTournament) => {
      return {
        ...prevTournament,
        dates: [...value],
      };
    });
  };

  return (
    <>
      {user.role === 0 ? (
        <Breadcrumb
          style={{ color: "#ffa76e" }}
          className="px-2 pb-2"
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
                  to={`/club/:${user.slug}/tournaments`}
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
                      color: isActive ? "black" : "#ffa76e",
                      fontWeight: isActive ? "normal" : "bold",
                      backgroundColor: isActive ? "#ffa76e" : "",
                      viewTransitionName: isTransitioning ? "slide" : "",
                    };
                  }}
                  to={`/club/:${user.slug}/createTournaments`}
                  className={"text-decoration-none"}
                >
                  Create Tournament
                </NavLink>
              ),
            },
          ]}
        />
      ) : (
        ""
      )}
      <Form
        onSubmit={handleSubmit}
        className="d-flex gap-2 px-3 w-100 flex-column align-items-center"
      >
        <Form.Group className="w-100">
          <Form.Label className="label-size" htmlFor="disabledTextInput">
            <span className="star">
              <sup>*</sup>{" "}
            </span>
            Tournament Name
          </Form.Label>
          <Form.Control
            size="sm"
            required
            placeholder="Tournament Name"
            name="tournamentName"
            type="text"
            value={tournamentDetails.tournamentName}
            onChange={handleFormChange}
          />
        </Form.Group>
        <Form.Group className="w-100">
          <Form.Label className="label-size" htmlFor="disabledTextInput">
            Image
          </Form.Label>
          <Form.Control
            size="sm"
            name="image"
            type="file"
            // value={tournamentDetails.image}
            onChange={handleFormChange}
          />
        </Form.Group>

        {/* <Form.Group className="w-100">
          <Form.Label className="label-size" htmlFor="disabledTextInput">
            Tournament Information
          </Form.Label>
          <Form.Control
            size="sm"
            type="text"
            placeholder="tournament Information"
            name="tournamentInformation"
            value={tournamentDetails.tournamentInformation}
            onChange={handleFormChange}
          />
        </Form.Group> */}
        <Form.Group className="w-100 ml-3">
          <Form.Label className="label-size" htmlFor="disabledTextInput">
            <span className="star">
              <sup>*</sup>{" "}
            </span>{" "}
            Start Time
          </Form.Label>

          <TimePicker
            size="sm"
            type="time"
            required
            placeholder="Start Time"
            name="startTime"
            className="px-5 mx-3"
            onChange={(time, timeString) =>
              setTournamentDetails((prevTournament) => {
                return {
                  ...prevTournament,
                  startTime: timeString,
                };
              })
            }
          />
        </Form.Group>
        <Form.Group className="w-100">
          <Form.Label className="label-size">
            <span className="star">
              <sup>*</sup>{" "}
            </span>
            Start Date
          </Form.Label>
          <Form.Control
            size="sm"
            placeholder="Start Date"
            name="startDate"
            type="date"
            required
            value={tournamentDetails.startDate}
            onChange={handleFormChange}
          />
        </Form.Group>
        <Form.Group className="w-100">
          <Form.Label className="label-size">
            {" "}
            <span className="star">
              <sup>*</sup>{" "}
            </span>{" "}
            Tournament Days
          </Form.Label>
          <Form.Control
            size="sm"
            placeholder="Start Date"
            name="numberOfDays"
            type="number"
            required
            value={tournamentDetails.numberOfDays}
            onChange={handleFormChange}
          />
        </Form.Group>
        {/* <Form.Group className="w-100">
          <Form.Label className="label-size">
            {" "}
            <span className="star">
              <sup>*</sup>{" "}
            </span>{" "}
            Tournament Dates{" "}
          </Form.Label>
          <Select
            mode="multiple"
            size={"small"}
            required
            placeholder="Please select dates"
            onChange={handleDateSelectChange}
            style={{
              width: "100%",
            }}
            name="dates"
            options={options}
          />
        </Form.Group> */}
        <Form.Group className="w-100">
          <Form.Label className="label-size">Number Of Pigeons </Form.Label>
          <Form.Control
            size="sm"
            placeholder="Enter pigeons"
            name="numberOfPigeons"
            type="number"
            value={tournamentDetails.numberOfPigeons}
            onChange={handleFormChange}
          />
        </Form.Group>

        <Form.Group className="w-100">
          <Form.Label className="label-size">
            Number Of Helper Pigeons{" "}
          </Form.Label>
          <Form.Control
            size="sm"
            placeholder="Enter helper pigeons"
            name="helperPigeons"
            type="number"
            value={tournamentDetails.helperPigeons}
            onChange={handleFormChange}
          />
        </Form.Group>
        <Form.Group className="w-100">
          <Form.Label className="label-size">Landed Pigeons </Form.Label>
          <Form.Control
            size="sm"
            placeholder="Enter landed Pigeons"
            name="landedPigeons"
            type="number"
            value={tournamentDetails.landedPigeons}
            onChange={handleFormChange}
          />
        </Form.Group>

        {/* <Form.Group className="w-100">
          <Form.Label className="label-size">Status_</Form.Label>
          <Form.Select
            name="status_"
            type="text"
            size="sm"
            onChange={handleFormChange}
            value={tournamentDetails.status_}
          >
            {["", "active", "in active"].map((_, index) => {
              return (
                <option key={index} value={_}>
                  {_}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group> */}

        {/* <Form.Group className="w-100">
          <Form.Label className="label-size"> Type </Form.Label>
          <Form.Control
            size="sm"
            placeholder="Enter type"
            name="type"
            type="text"
            value={tournamentDetails.type}
            onChange={handleFormChange}
          />
        </Form.Group> */}
        <Form.Group className="w-100">
          <span className="star">
            <sup>*</sup>{" "}
          </span>
          <Form.Label className="label-size"> Number Of Prizes </Form.Label>
          <Form.Control
            size="sm"
            required
            placeholder="Enter Number Of Prizes"
            name="numberOfPrizes"
            type="text"
            value={tournamentDetails.numberOfPrizes}
            onChange={handleFormChange}
          />
        </Form.Group>

        {/* Prizes input field */}
        <Form.Group className="w-100">
          <Form.Label>
            <strong>Prizes:</strong>
          </Form.Label>
          <br />
          {tournamentDetails.prizes.map((prize, index) => (
            <React.Fragment key={index}>
              <Form.Label>Prize {index + 1}</Form.Label>
              <Form.Group className="d-flex align-items-center">
                <Form.Control
                  size="sm"
                  placeholder={`Prize ${index + 1}`}
                  name="prize"
                  type="number"
                  value={prize}
                  onChange={(e) => handleFormChange(e, index)} // Pass the index to handle specific prize input
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => removePrizes(index)}
                >
                  Remove
                </Button>
                {/* Button to add a new prize field */}
              </Form.Group>
            </React.Fragment>
          ))}
          <Button
            variant="primary "
            size="sm"
            onClick={addPrizes}
            style={{ marginLeft: "2px" }}
          >
            Add
          </Button>
        </Form.Group>
        <Button variant="outline-dark" className="px-5" type="submit">
          Submit
        </Button>
        <Toaster />
      </Form>
    </>
  );
};

export default TournamentForm;
