import { Breadcrumb, Input, TimePicker } from "antd";
import axios from "axios";
import React, { useEffect } from "react";

import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration"; // Import the correct duration plugin

import { NavLink, useLocation, useNavigate } from "react-router-dom";
dayjs.extend(customParseFormat);
dayjs.extend(duration); // Extend the duration plugin
const AdminAddPigeonOwnerResult = () => {
  const { owner } = useLocation().state;
  const [resultsForm, setResultsForm] = useState({
    pigeonOwnerId: owner && owner._id,
    totalPigeons: Number,
    firstPigeonReturnTime: "",
    secondPigeonReturnTime: "",
    thirdPigeonReturnTime: "",
    fourthPigeonReturnTime: "",
    fifthPigeonReturnTime: "",
    sixthPigeonReturnTime: "",
    seventhPigeonReturnTime: "",
    total: "",
  });
  const [startTime, setStartTime] = useState("");
  const slug = JSON.parse(localStorage.getItem("user")).slug;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/api/v1/createResults/`,
        resultsForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.msg);
        setTimeout(() => {
          navigate(`/pigeonOwners`);
        }, 3000);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    }
  };

  const fetchStartTime = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1//pigeonOwners/getPigeonOwnerTournament/:${id}`
      );
      setStartTime(response.data.startTime);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  function calculateTimeDifference(startTime, returnTime) {
    if (!returnTime) return { hours: 0, minutes: 0, seconds: 0 }; // Skip if return time is not provided

    // Split the startTime and returnTime into [hours, minutes, seconds]
    const [startHrs, startMins, startSecs] = startTime.split(":").map(Number);
    const [endHrs, endMins, endSecs] = returnTime.split(":").map(Number);

    // Convert the start and end times into total seconds
    const startTotalSecs = startHrs * 3600 + startMins * 60 + startSecs;
    const endTotalSecs = endHrs * 3600 + endMins * 60 + endSecs;

    // Calculate the difference in seconds
    let diffSecs = endTotalSecs - startTotalSecs;

    // Convert the difference back into hours, minutes, and seconds
    const diffHrs = Math.floor(diffSecs / 3600); // Hours
    diffSecs %= 3600;
    const diffMins = Math.floor(diffSecs / 60); // Minutes
    const diffRemainingSecs = diffSecs % 60; // Seconds

    return { hours: diffHrs, minutes: diffMins, seconds: diffRemainingSecs };
  }

  function calculateTotalTime(startTime, returnTimes) {
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;

    returnTimes.forEach((returnTime) => {
      const { hours, minutes, seconds } = calculateTimeDifference(
        startTime,
        returnTime
      );
      totalHours += hours;
      totalMinutes += minutes;
      totalSeconds += seconds;
    });

    // Adjust total seconds to minutes if more than 60 seconds
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;

    // Adjust total minutes to hours if more than 60 minutes
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return `${totalHours}:${totalMinutes}:${totalSeconds}`;
  }

  useEffect(() => {
    fetchStartTime(owner._id);
  }, []);

  useEffect(() => {
    const total = calculateTotalTime(startTime, [
      resultsForm.firstPigeonReturnTime,
      resultsForm.secondPigeonReturnTime,
      resultsForm.thirdPigeonReturnTime,
      resultsForm.fourthPigeonReturnTime,
      resultsForm.fifthPigeonReturnTime,
      resultsForm.sixthPigeonReturnTime,
      resultsForm.seventhPigeonReturnTime,
    ]);
    setResultsForm((prev) => ({
      ...prev,
      total,
    }));
  }, [
    resultsForm.firstPigeonReturnTime,
    resultsForm.secondPigeonReturnTime,
    resultsForm.thirdPigeonReturnTime,
    resultsForm.fourthPigeonReturnTime,
    resultsForm.fifthPigeonReturnTime,
    resultsForm.sixthPigeonReturnTime,
    resultsForm.seventhPigeonReturnTime,
  ]); // Effect depends on startTime and returnTimes

  return (
    <>
      <Breadcrumb
        style={{ color: "#ffa76e" }}
        className="px-5 pb-2"
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
                style={{ color: "#ffa76e", fontWeight: "bolder" }}
                className={"text-decoration-none"}
              >
                Add Pigeon Result
              </p>
            ),
          },
        ]}
      />
      <div className="d-flex flex-column align-items-center justify-content-center">
        <h5 className="ps-3">Add Pigeon Results</h5>
        <Form
          className="p-3 d-flex gap-2 flex-column align-items-center"
          onSubmit={handleFormSubmit}
        >
          <Form.Group className="d-flex gap-2">
            <label className="label-size">Total Pigeons </label>
            <Form.Control
              size="sm"
              placeholder="total no Pigeons"
              name="totalPigeons"
              type="number"
              value={resultsForm.totalPigeons}
              onChange={(e) => {
                // const total = calculateTotalTime(startTime, returnTimes);
                setResultsForm((prev) => {
                  return {
                    ...prev,
                    totalPigeons: e.target.value,
                  };
                });
              }}
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <label>#1 Pigeon</label>
            <TimePicker
              name="firstPigeonReturnTime"
              placeholder="#1 Pigeon"
              className="px-5"
              onChange={(time, timeString) => {
                setResultsForm((prev) => {
                  return {
                    ...prev,
                    firstPigeonReturnTime: timeString,
                  };
                });
              }}
              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            />
          </div>
          <div className="d-flex gap-2 ">
            <label>#2 Pigeon</label>
            <TimePicker
              name="secondPigeonReturnTime"
              placeholder="#2 Pigeon"
              className="px-5"
              onChange={(time, timeString) => {
                setResultsForm((prev) => {
                  return {
                    ...prev,
                    secondPigeonReturnTime: timeString,
                  };
                });
              }}
              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            />
          </div>
          <div className="d-flex gap-2 ">
            <label>#3 Pigeon</label>
            <TimePicker
              name="thirdPigeonReturnTime"
              placeholder="#3 Pigeon"
              className="px-5"
              onChange={(time, timeString) => {
                setResultsForm((prev) => {
                  return {
                    ...prev,
                    thirdPigeonReturnTime: timeString,
                  };
                });
              }}
              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            />
          </div>
          <div className="d-flex gap-2">
            <label>#4 Pigeon</label>
            <TimePicker
              name="fourthPigeonReturnTime"
              placeholder="#4 Pigeon"
              className="px-5"
              onChange={(time, timeString) => {
                setResultsForm((prev) => {
                  return {
                    ...prev,
                    fourthPigeonReturnTime: timeString,
                  };
                });
              }}
              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            />
          </div>
          <div className="d-flex gap-2 ">
            <label>#5 Pigeon</label>
            <TimePicker
              name="fifthPigeonReturnTime"
              placeholder="#5 Pigeon"
              className="px-5"
              onChange={(time, timeString) => {
                setResultsForm((prev) => {
                  return {
                    ...prev,
                    fifthPigeonReturnTime: timeString,
                  };
                });
              }}
              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            />
          </div>
          <div className="d-flex gap-2 ">
            <label>#6 Pigeon</label>
            <TimePicker
              name="sixthPigeonReturnTime"
              placeholder="#6 Pigeon"
              className="px-5"
              onChange={(time, timeString) => {
                setResultsForm((prev) => {
                  return {
                    ...prev,
                    sixthPigeonReturnTime: timeString,
                  };
                });
              }}
              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            />
          </div>
          <div className="d-flex gap-2">
            <label>#7 Pigeon</label>
            <TimePicker
              name="seventhPigeonReturnTime"
              placeholder="#7 Pigeon"
              className="px-5"
              onChange={(time, timeString) => {
                setResultsForm((prev) => {
                  return {
                    ...prev,
                    seventhPigeonReturnTime: timeString,
                  };
                });
              }}
              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            />
          </div>
          <div className="d-flex gap-2 ">
            <label>Total Time</label>
            <Input
              type="text"
              name="total"
              size="small"
              // placeholder="Total Time"
              value={resultsForm.total}
              className="px-3"
              readOnly
            />
          </div>
          <Button
            className=" mt-3"
            variant="outline-primary"
            type="submit"
            size="sm"
            disabled={!resultsForm.pigeonOwnerId}
          >
            Submit
          </Button>
          <Toaster />
        </Form>
      </div>
    </>
  );
};

export default AdminAddPigeonOwnerResult;
