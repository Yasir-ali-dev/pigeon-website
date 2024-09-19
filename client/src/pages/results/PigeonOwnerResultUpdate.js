import React, { useEffect } from "react";

import { Breadcrumb, Input, TimePicker } from "antd";
import axios from "axios";

import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
dayjs.extend(customParseFormat);

const PigeonOwnerResultUpdate = () => {
  const { owner } = useLocation().state;
  const [updateOwner, setUpdateOwner] = useState(owner);
  const slug = JSON.parse(localStorage.getItem("user")).slug;
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState("");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateOwner((prevState) => {
      return {
        ...prevState,
        pigeonsResults: {
          ...prevState.pigeonsResults,
          [name]: value,
        },
      };
    });
  };

  const fetchStartTime = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/pigeonOwners/getPigeonOwnerTournament/:${id}`
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
    // Only calculate total time when startTime or return times change
    if (!startTime) return;

    const returnTimes = [
      updateOwner.pigeonsResults.firstPigeonReturnTime,
      updateOwner.pigeonsResults.secondPigeonReturnTime,
      updateOwner.pigeonsResults.thirdPigeonReturnTime,
      updateOwner.pigeonsResults.fourthPigeonReturnTime,
      updateOwner.pigeonsResults.fifthPigeonReturnTime,
      updateOwner.pigeonsResults.sixthPigeonReturnTime,
      updateOwner.pigeonsResults.seventhPigeonReturnTime,
    ];

    const newTotal = calculateTotalTime(startTime, returnTimes);

    // Only update state if total time actually changes
    if (updateOwner.pigeonsResults.total !== newTotal) {
      setUpdateOwner((prevState) => ({
        ...prevState,
        pigeonsResults: {
          ...prevState.pigeonsResults,
          total: newTotal,
        },
      }));
    }
  }, [
    updateOwner.pigeonsResults.firstPigeonReturnTime,
    updateOwner.pigeonsResults.secondPigeonReturnTime,
    updateOwner.pigeonsResults.thirdPigeonReturnTime,
    updateOwner.pigeonsResults.fourthPigeonReturnTime,
    updateOwner.pigeonsResults.fifthPigeonReturnTime,
    updateOwner.pigeonsResults.sixthPigeonReturnTime,
    updateOwner.pigeonsResults.seventhPigeonReturnTime,
  ]);
  const token = localStorage.getItem("token");
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const {
      totalPigeons,
      firstPigeonReturnTime,
      secondPigeonReturnTime,
      thirdPigeonReturnTime,
      fourthPigeonReturnTime,
      fifthPigeonReturnTime,
      sixthPigeonReturnTime,
      seventhPigeonReturnTime,
      total,
    } = updateOwner.pigeonsResults;
    const update = {
      pigeonOwnerId: updateOwner._id,
      totalPigeons,
      firstPigeonReturnTime,
      secondPigeonReturnTime,
      thirdPigeonReturnTime,
      fourthPigeonReturnTime,
      fifthPigeonReturnTime,
      sixthPigeonReturnTime,
      seventhPigeonReturnTime,
      total,
    };
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/api/v1/createResults/`,
        update,
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
          navigate(`/club/${slug}/pigeonOwners`);
        }, 3000);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Breadcrumb
        style={{ color: "#ffa76e" }}
        className="px-4 py-2"
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
                to={`/club/:${slug}/pigeonOwners`}
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
                Pigeon Owner Update
              </p>
            ),
          },
        ]}
      />

      <div className="d-flex justify-content-center align-items-center flex-column">
        <h5 className="ps-3">Update Pigeon Results</h5>
        <Form
          className="px-3 pb-3 d-flex gap-2 flex-column align-items-center"
          onSubmit={handleFormSubmit}
        >
          <Form.Group className="d-flex gap-2">
            <label className="label-size">Total Pigeons </label>
            <Form.Control
              size="sm"
              placeholder="total no Pigeons"
              // className="px-5"
              name="totalPigeons"
              type="number"
              value={updateOwner.pigeonsResults.totalPigeons}
              onChange={handleFormChange}
            />
          </Form.Group>
          <div className="d-flex gap-2 ">
            <label>#1 Pigeon</label>
            <TimePicker
              name="firstPigeonReturnTime"
              placeholder="#1 Pigeon"
              // className="w-25"
              className="px-5"
              format="HH:mm:ss"
              value={
                updateOwner.pigeonsResults.firstPigeonReturnTime
                  ? dayjs(
                      updateOwner.pigeonsResults.firstPigeonReturnTime,
                      "HH:mm:ss"
                    )
                  : null
              }
              onChange={(time, timeString) => {
                setUpdateOwner((prev) => {
                  return {
                    ...prev,
                    pigeonsResults: {
                      ...prev.pigeonsResults,
                      firstPigeonReturnTime: timeString,
                    },
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
              // className="w-25"
              className="px-5"
              value={
                updateOwner.pigeonsResults.secondPigeonReturnTime
                  ? dayjs(
                      updateOwner.pigeonsResults.secondPigeonReturnTime,
                      "HH:mm:ss"
                    )
                  : null
              }
              onChange={(time, timeString) => {
                setUpdateOwner((prev) => {
                  return {
                    ...prev,
                    pigeonsResults: {
                      ...prev.pigeonsResults,
                      secondPigeonReturnTime: timeString,
                    },
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
              // className="w-25"
              className="px-5"
              value={
                updateOwner.pigeonsResults.thirdPigeonReturnTime
                  ? dayjs(
                      updateOwner.pigeonsResults.thirdPigeonReturnTime,
                      "HH:mm:ss"
                    )
                  : null
              }
              onChange={(time, timeString) => {
                setUpdateOwner((prev) => {
                  return {
                    ...prev,
                    pigeonsResults: {
                      ...prev.pigeonsResults,
                      thirdPigeonReturnTime: timeString,
                    },
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
              // className="w-25"

              className="px-5"
              value={
                updateOwner.pigeonsResults.fourthPigeonReturnTime
                  ? dayjs(
                      updateOwner.pigeonsResults.fourthPigeonReturnTime,
                      "HH:mm:ss"
                    )
                  : null
              }
              onChange={(time, timeString) => {
                setUpdateOwner((prev) => {
                  return {
                    ...prev,
                    pigeonsResults: {
                      ...prev.pigeonsResults,
                      fourthPigeonReturnTime: timeString,
                    },
                  };
                });
              }}
              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            />
          </div>
          <div className="d-flex gap-2">
            <label>#5 Pigeon</label>
            <TimePicker
              name="fifthPigeonReturnTime"
              placeholder="#5 Pigeon"
              // className="w-25"
              className="px-5"
              value={
                updateOwner.pigeonsResults.fifthPigeonReturnTime
                  ? dayjs(
                      updateOwner.pigeonsResults.fifthPigeonReturnTime,
                      "HH:mm:ss"
                    )
                  : null
              }
              onChange={(time, timeString) => {
                setUpdateOwner((prev) => {
                  return {
                    ...prev,
                    pigeonsResults: {
                      ...prev.pigeonsResults,
                      fifthPigeonReturnTime: timeString,
                    },
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
              // className="w-25"
              className="px-5"
              value={
                updateOwner.pigeonsResults.sixthPigeonReturnTime
                  ? dayjs(
                      updateOwner.pigeonsResults.sixthPigeonReturnTime,
                      "HH:mm:ss"
                    )
                  : null
              }
              onChange={(time, timeString) => {
                setUpdateOwner((prev) => {
                  return {
                    ...prev,
                    pigeonsResults: {
                      ...prev.pigeonsResults,
                      sixthPigeonReturnTime: timeString,
                    },
                  };
                });
              }}
              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            />
          </div>
          <div className="d-flex gap-2 ">
            <label>#7 Pigeon</label>
            <TimePicker
              name="seventhPigeonReturnTime"
              placeholder="#7 Pigeon"
              // className="w-25"
              className="px-5"
              value={
                updateOwner.pigeonsResults.seventhPigeonReturnTime
                  ? dayjs(
                      updateOwner.pigeonsResults.seventhPigeonReturnTime,
                      "HH:mm:ss"
                    )
                  : null
              }
              onChange={(time, timeString) => {
                setUpdateOwner((prev) => {
                  return {
                    ...prev,
                    pigeonsResults: {
                      ...prev.pigeonsResults,
                      seventhPigeonReturnTime: timeString,
                    },
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
              value={updateOwner.pigeonsResults.total}
              className="px-3"
              readOnly
            />
          </div>
          <Button
            className="px-5 mt-3"
            variant="outline-dark"
            type="submit"
            size="sm"
          >
            Submit
          </Button>
          <Toaster />
        </Form>
      </div>
    </>
  );
};

export default PigeonOwnerResultUpdate;
