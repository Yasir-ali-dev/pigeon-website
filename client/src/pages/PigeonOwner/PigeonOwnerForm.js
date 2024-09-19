import { Breadcrumb, Input } from "antd";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

const PigeonOwnerForm = () => {
  const [phoneError, setPhoneError] = useState("");
  const [phone, setPhone] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [owners, setOwners] = useState([]);
  const slug = JSON.parse(localStorage.getItem("user")).slug;
  const [tournaments, setTournaments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

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
      toast.success("Owner created successfully");
      fetchOwners();
      formRef.current.reset();
      setImage(null);
      setTimeout(() => {
        navigate(`/club/${slug}/pigeonOwners`);
      }, 3000);
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/allowners`
      ); // Adjust the URL to your backend endpoint
      setOwners(response.data);
    } catch (error) {
      console.error("Error fetching owners:", error);
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

  const fetchClubTournaments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/tournaments/club/:${user.id}`
      );
      if (response.data.success) {
        setTournaments(response.data.clubTournaments);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };
  useEffect(() => {
    fetchClubTournaments();
  }, []);

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
                to={`/club/:${user.slug}/pigeonOwners`}
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
                    color: isActive ? "black" : "#ffa76e",
                    fontWeight: isActive ? "normal" : "bold",
                    backgroundColor: isActive ? "#ffa76e" : "",
                    viewTransitionName: isTransitioning ? "slide" : "",
                  };
                }}
                to={`/club/:${user.slug}/pigeonOwnerForm`}
                className={"text-decoration-none"}
              >
                Create Pigeon Owners
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
                  <Button variant="dark" type="submit">
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

export default PigeonOwnerForm;
