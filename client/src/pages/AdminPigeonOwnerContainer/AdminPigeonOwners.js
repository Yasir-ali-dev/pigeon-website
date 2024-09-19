import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Button, Image } from "react-bootstrap";
import { Breadcrumb, Select, Tag } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TournamentContext from "../Contexts/TournamentContext";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";

const AdminPigeonOwners = () => {
  const [owners, setOwners] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [editingOwner, setEditingOwner] = useState(null);
  const [deletingOwner, setDeletingOwner] = useState(null);
  // const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleEditClick = (owner) => {
    setEditingOwner(owner); // Open the modal with owner data
  };
  const token = localStorage.getItem("token");

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
      if (response.data.success) {
        toast.success(response.data.message);
        setOwners(owners.filter((owner) => owner._id !== deletingOwner._id)); // Remove the deleted owner from the list
        setDeletingOwner(null); // Close the delete confirmation modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting owner:", error);
      toast.error("Something went wrong");
    }
  };
  const [activeTournamentId, setActiveTournamentId] = useState("");

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
    fetchTournaments();
  }, []);

  const fetchTournaments = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/tournaments/`
      );

      setTournaments(response.data.tournaments);
      if (response.data.tournaments.length > 0) {
        fetchTournamentPigeons(response.data.tournaments[0]._id);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  return (
    <div>
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
      <div className="d-flex flex-wrap px-2 justify-content-center gap-2">
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
      <div className="px-4 py-2">
        <Table>
          <Thead className="border py-2 bg-dark text-light">
            <Tr>
              <Th>
                {" "}
                <h6 className="pt-2 text-center">#</h6>
              </Th>

              <Th>
                {" "}
                <h6 className="pt-2 text-center">Image</h6>
              </Th>
              <Th>
                {" "}
                <h6 className="pt-2 text-center">Name</h6>
              </Th>
              <Th>
                {" "}
                <h6 className="pt-2 text-center">Contact</h6>
              </Th>
              <Th>
                {" "}
                <h6 className="pt-2 text-center">City</h6>
              </Th>
              <Th>
                {" "}
                <h6 className="pt-2 text-center">Results</h6>
              </Th>
              <Th>
                {" "}
                <h6 className="pt-2 text-center">Actions</h6>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {owners.map((owner, index) => (
              <Tr
                key={owner._id}
                style={{
                  backgroundColor: index % 2 === 1 ? "#F0F8FF" : "",
                }}
                className=" text-center border border-top"
              >
                <Td>{index + 1}</Td>
                <Td>
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
                </Td>
                <Td>{owner.name}</Td>
                <Td>
                  {owners.length > 0 ? (
                    <Tag color="orange">{owner.contacts}</Tag>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Image src="/empty.png" alt="empty_img" />
                    </div>
                  )}
                </Td>
                <Td>{owner.city}</Td>
                <Td>
                  <div className="d-flex justify-content-center gap-1">
                    {owner.pigeonsResults !== undefined ? (
                      <Button
                        size="sm"
                        variant="outline-dark"
                        onClick={() => {
                          navigate(`/pigeonOwners/updatePigeonOwnerResult`, {
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
                          navigate(`/pigeonOwners/addPigeonOwnerResult`, {
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
                        navigate(`/pigeonOwners/pigeonOwnerResult`, {
                          state: { owner },
                        });
                      }}
                    >
                      View
                    </Button>
                  </div>
                </Td>

                <Td>
                  <div className="d-flex gap-1 justify-content-center">
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
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      {editingOwner && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Owner</h5>
                <Button
                  type="button"
                  variant="outline-dark"
                  size="sm"
                  onClick={() => setEditingOwner(null)}
                >
                  <span>&times;</span>
                </Button>
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
                  size="sm"
                  onClick={() => setEditingOwner(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  variant="success"
                  size="sm"
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
                  size="sm"
                  onClick={() => setDeletingOwner(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
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
export default AdminPigeonOwners;
