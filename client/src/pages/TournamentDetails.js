import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { message, Popconfirm } from "antd";

const TournamentDetails = () => {
  const navigate = useNavigate();
  const { tournament } = useLocation().state;
  const [tournamentDetails, setTournamentDetails] = useState(tournament);
  const { id } = useParams();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTournamentDetails((prevTournament) => {
      return {
        ...prevTournament,
        [name]: value,
      };
    });
  };
  console.log(tournamentDetails);

  const token = localStorage.getItem("token");

  const handleDeleteTournament = async () => {
    console.log("delete tournament");
    let response;
    try {
      response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/tournaments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(`${response.data.message} deleted successfully!`);
        setTimeout(() => {
          navigate("/tournaments");
        }, [3000]);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    try {
      response = await axios.patch(
        `${process.env.REACT_APP_API}/api/v1/tournaments/${id}`,
        tournamentDetails
      );
      console.log(response.data);
      if (response.status === 200) {
        toast.success(`${response.data.message} edited successfully!`);
        setTimeout(() => {
          navigate("/tournaments");
        }, [3000]);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Form
        onSubmit={handleSubmit}
        className="d-flex gap-2 px-3 flex-column  align-items-center"
      >
        <Container
          className="d-flex gap-1 px-1 flex-column "
          style={{ width: "-webkit-fill-available" }}
        >
          <Form.Group className="w-100">
            <Form.Label className="label-size" htmlFor="disabledTextInput">
              Tournament Name
            </Form.Label>
            <Form.Control
              size="sm"
              required
              placeholder="tournament Name"
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
              // value={tournamentDetails.image }
              onChange={handleFormChange}
            />
          </Form.Group>

          <Form.Group className="w-100">
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
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="label-size" htmlFor="disabledTextInput">
              Start Time
            </Form.Label>
            <Form.Control
              size="sm"
              required
              type="time"
              placeholder="tournament Information"
              name="startTime"
              value={tournamentDetails.startTime}
              onChange={handleFormChange}
            />
          </Form.Group>

          <Form.Group className="w-100">
            <Form.Label className="label-size">Category</Form.Label>
            <Form.Control
              size="sm"
              placeholder="Category"
              name="category"
              type="text"
              value={tournamentDetails.category}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="label-size">Start Date</Form.Label>
            <Form.Control
              size="sm"
              placeholder="Start Date"
              name="startDate"
              type="date"
              required
              value={
                tournamentDetails.startDate &&
                tournamentDetails.startDate.slice(0, 10)
              }
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="label-size">Number Of Days</Form.Label>
            <Form.Control
              size="sm"
              placeholder="Start Date"
              name="numberOfDays"
              type="number"
              value={tournamentDetails.numberOfDays}
              required
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="label-size">Number Of Pigeons </Form.Label>
            <Form.Control
              size="sm"
              required
              placeholder="Enter pigeons"
              name="numberOfPigeons"
              type="number"
              value={tournamentDetails.numberOfPigeons}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="label-size">
              Note Time For Pigeons{" "}
            </Form.Label>
            <Form.Control
              size="sm"
              placeholder="Enter note time pigeons"
              name="noteTimeForPigeons"
              type="time"
              value={tournamentDetails.noteTimeForPigeons}
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
          <Form.Group className=" w-100">
            <Form.Label className="label-size">Continue Days </Form.Label>
            <Form.Control
              size="sm"
              placeholder="Enter Continue Days"
              name="continueDays"
              type="number"
              value={tournamentDetails.continueDays}
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
          <Form.Group className="w-100">
            <Form.Label className="label-size">Status_</Form.Label>
            <Form.Select
              name="status_"
              type="text"
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
          </Form.Group>

          <Form.Group className="w-100">
            <Form.Label className="label-size"> Type </Form.Label>
            <Form.Control
              size="sm"
              placeholder="Enter type"
              name="type"
              type="text"
              value={tournamentDetails.type}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="label-size"> Number Of Prizes </Form.Label>
            <Form.Control
              size="sm"
              placeholder="Enter Number Of Prizes"
              name="numberOfPrizes"
              type="text"
              value={tournamentDetails.numberOfPrizes}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="text-capitalize label-size">
              prize1
            </Form.Label>
            <Form.Control
              size="sm"
              placeholder={`Enter prize1`}
              name={"prize1"}
              type="number"
              value={tournamentDetails.prize1}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="text-capitalize label-size">
              prize2
            </Form.Label>
            <Form.Control
              size="sm"
              placeholder={`Enter prize2`}
              name={"prize2"}
              type="number"
              value={tournamentDetails.prize2}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="text-capitalize label-size">
              prize3
            </Form.Label>
            <Form.Control
              size="sm"
              placeholder={`Enter prize3`}
              name={"prize3"}
              type="number"
              value={tournamentDetails.prize3}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="text-capitalize label-size">
              prize4
            </Form.Label>
            <Form.Control
              size="sm"
              placeholder={`Enter prize4`}
              name={"prize4"}
              type="number"
              value={tournamentDetails.prize4}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="w-100">
            <Form.Label className="text-capitalize label-size">
              prize5
            </Form.Label>
            <Form.Control
              size="sm"
              placeholder={`Enter prize5`}
              name={"prize5"}
              type="number"
              value={tournamentDetails.prize5}
              onChange={handleFormChange}
            />
          </Form.Group>
        </Container>
        <div className="d-flex gap-2 py-2">
          <Button variant="outline-dark" type="submit">
            {" "}
            Update Tournament
          </Button>
          <Toaster />
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onCancel={() => message.info("Cancle delete")}
            onConfirm={(e) => handleDeleteTournament(e)}
          >
            <Button variant="danger" type="button">
              Delete Tournament
            </Button>
            <Toaster />
          </Popconfirm>
        </div>
      </Form>
    </div>
  );
};

export default TournamentDetails;
