import React, { useContext, useRef, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import TournamentContext from "../Contexts/TournamentContext";
import { Button } from "react-bootstrap";
import { Breadcrumb } from "antd";
import axios from "axios";

const AdminPigeonForm = () => {
  const [phoneError, setPhoneError] = useState("");
  const [phone, setPhone] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const { tournaments } = useContext(TournamentContext);
  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", event.target.name.value);
    formData.append("contacts", phone);
    formData.append("city", event.target.city.value);
    if (image) {
      formData.append("image", image);
      console.log(image);
    }

    formData.append("tournament", event.target.tournament.value);
    try {
      console.log(formData);

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/owner`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response);

      toast.success("Owner created successfully");
      formRef.current.reset();
      setImage(null);
      setTimeout(() => {
        navigate(`/pigeonOwners`);
      }, 3000);
    } catch (error) {
      toast.error("An error occurred");
      console.log(error);
    }
  };

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    // Validate for digits and symbols (+, -, (, ))
    if (/^[\d+\-()]*$/.test(newPhone)) {
      setPhone(newPhone);
      setPhoneError("");
    } else {
      setPhoneError("Phone number can only contain digits and symbols + - ( )");
    }
  };
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <>
      <Breadcrumb
        className="px-4 pb-2"
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
                to={"/pigeonOwners"}
              >
                Pigeon Owners
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
                to={"/pigeonOwners/pigeonOwnerForm"}
              >
                Create Pigeon Owner
              </NavLink>
            ),
          },
        ]}
      />

      <div className="d-flex flex-column align-items-start justify-content-center">
        <div className="d-flex justify-content-center">
          <div className="w-50 p-3">
            <div>
              <div className="d-flex justify-content-center align-items-center ">
                <h5 className="card-title">Create Participant</h5>
              </div>
              <form
                ref={formRef}
                className="row g-3"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <div className="">
                  <label className="w-25">Tournament</label>
                  <select
                    className="aaq form-control"
                    type="text"
                    id="tournament"
                    name="tournament"
                    placeholder="tournament"
                    required
                  >
                    <option value=""></option>
                    {tournaments &&
                      tournaments.map((_, index) => {
                        return (
                          <option key={index} value={_._id}>
                            {_.tournamentName}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div>
                  <label className="w-25">Name</label>
                  <input
                    className="aaq form-control"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                  />
                </div>

                <div>
                  <label className="w-25">Phone</label>
                  <input
                    className={`aaq form-control ${
                      phoneError ? "is-invalid" : ""
                    }`}
                    type="text"
                    id="contacts"
                    name="contacts"
                    placeholder="Contact No."
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                  {phoneError && (
                    <div className="invalid-feedback">{phoneError}</div>
                  )}
                </div>
                <div>
                  <label className="w-25">City</label>

                  <input
                    className="aaq form-control"
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter City"
                    required
                  />
                </div>
                <div>
                  <label className="w-25">Image</label>

                  <input
                    type="file"
                    id="image"
                    placeholder="Upload image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className=" d-flex justify-content-center">
                  <Button variant="dark" className="px-3" type="submit">
                    Create Owner
                  </Button>
                  <Toaster />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPigeonForm;
