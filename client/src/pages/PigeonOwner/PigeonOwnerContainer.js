import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Button, Image, Table } from "react-bootstrap";
import { Breadcrumb, Tag } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const PigeonOwnerContainer = () => {
  const [owners, setOwners] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [editingOwner, setEditingOwner] = useState(null);
  const [deletingOwner, setDeletingOwner] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const slug = JSON.parse(localStorage.getItem("user")).slug;
  const [activeTournamentId, setActiveTournamentId] = useState("");
  const token = localStorage.getItem("token");
  const handleEditClick = (owner) => {
    setEditingOwner(owner); // Open the modal with owner data
  };

  const handleSave = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/owners/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setOwners(
          owners.map((owner) =>
            owner._id === id ? response.data.owner : owner
          )
        );
        setEditingOwner(null); // Close the modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating owner:", error);
      toast.error("Something went wrong");
    }
  };

  // Function to handle delete click
  const handleDeleteClick = (owner) => {
    setDeletingOwner(owner); // Open the delete confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `
        ${process.env.REACT_APP_API}/api/v1/owners/${deletingOwner._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      toast.success(response.data.message);
      setOwners(owners.filter((owner) => owner._id !== deletingOwner._id)); // Remove the deleted owner from the list
      setDeletingOwner(null); // Close the delete confirmation modal
    } catch (error) {
      console.error("Error deleting owner:", error);
      toast.error(error.response.data.message);
    }
  };

  const fetchClubTournaments = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/tournaments/club/:${user.id}`
      );
      if (response.data.success) {
        setTournaments(response.data.clubTournaments);
        if (response.data.clubTournaments.length > 0) {
          fetchTournamentPigeons(response.data.clubTournaments[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const fetchTournamentPigeons = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/pigeonOwners/:${id}`
      );
      if (response.data.success) {
        setOwners(response.data.pigeonOwners);
        setActiveTournamentId(id);
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

      <div className="d-flex px-2 justify-content-center gap-2">
        {tournaments &&
          tournaments.map((_, index) => {
            return (
              <Button
                size="sm"
                variant={activeTournamentId === _._id ? "dark" : "outline-dark"}
                key={index}
                onClick={() => {
                  fetchTournamentPigeons(_._id);
                  setActiveTournamentId(_._id);
                }}
              >
                {_.tournamentName}
              </Button>
            );
          })}
      </div>
      <div className="px-2 py-2">
        <Table responsive striped border={"1px solid grey"} hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Contacts</th>
              <th>City</th>
              <th>Results</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {owners.length > 0 &&
              owners.map((owner, index) => (
                <tr key={owner._id}>
                  <td>{index + 1}</td>
                  <td>
                    {owner.image ? (
                      <Image
                        className="rounded"
                        src={`${process.env.REACT_APP_API}/uploads/${owner.image}`}
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
                  </td>
                  <td>{owner.name}</td>
                  <td>
                    <Tag color="orange">{owner.contacts}</Tag>
                  </td>
                  <td>{owner.city}</td>
                  <td>
                    <div className="d-flex gap-1">
                      {owner.pigeonsResults !== undefined ? (
                        <Button
                          size="sm"
                          variant="outline-dark"
                          onClick={() => {
                            navigate(`/club/${slug}/pigeonOwnerResultUpdate`, {
                              state: { owner },
                            });
                          }}
                        >
                          Update
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline-dark"
                          onClick={() => {
                            navigate(`/club/${slug}/pigeonResultForm`, {
                              state: { owner },
                            });
                          }}
                        >
                          Add
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline-dark"
                        onClick={() => {
                          navigate(`/club/${slug}/pigeonOwnerResults`, {
                            state: { owner },
                          });
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        size="sm"
                        variant="outline-dark"
                        onClick={() => handleEditClick(owner)}
                      >
                        <EditOutlined />
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteClick(owner)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      {editingOwner && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Owner</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setEditingOwner(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={editingOwner.name}
                  onChange={(e) =>
                    setEditingOwner({ ...editingOwner, name: e.target.value })
                  }
                  placeholder="Enter Name"
                  className="form-control mb-3"
                />
                <input
                  type="text"
                  value={editingOwner.contacts}
                  onChange={(e) =>
                    setEditingOwner({
                      ...editingOwner,
                      contacts: e.target.value,
                    })
                  }
                  placeholder="Enter Contacts"
                  className="form-control mb-3"
                />
                <input
                  type="text"
                  value={editingOwner.city}
                  onChange={(e) =>
                    setEditingOwner({ ...editingOwner, city: e.target.value })
                  }
                  placeholder="Enter City"
                  className="form-control mb-3"
                />
              </div>
              <div className="modal-footer">
                <Button
                  type="button"
                  variant="outline-dark"
                  // className="btn btn-secondary"
                  onClick={() => setEditingOwner(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  variant="success"
                  onClick={() => handleSave(editingOwner._id, editingOwner)}
                >
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deletingOwner && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setDeletingOwner(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete the owner "
                  {deletingOwner.name}"?
                </p>
              </div>
              <div className="modal-footer">
                <Button
                  type="button"
                  variant="outline-dark"
                  onClick={() => setDeletingOwner(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PigeonOwnerContainer;
