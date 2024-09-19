import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { Avatar, Card, Tag } from "antd";
import { Button, Container, Image } from "react-bootstrap";
import ClubsContext from "./Contexts/ClubsContext";
import { Tbody, Td, Th, Thead, Tr, Table } from "react-super-responsive-table";
const Clubs = () => {
  const { clubs, setClubs } = useContext(ClubsContext);
  const [isTabular, setIsTabular] = useState();
  const [editingClub, setEditingClub] = useState(null);

  const handleEditClick = (club) => {
    setEditingClub(club); // Open the modal with the club data
  };
  const [deletingClub, setDeletingClub] = useState(null); // For deleting
  const handleDeleteClick = (club) => {
    setDeletingClub(club); // Open the delete confirmation modal
  };
  const token = localStorage.getItem("token");
  const handleSave = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/clubs/${id}`,
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
        setClubs(
          clubs.map((club) => (club._id === id ? response.data.club : club))
        );
        setEditingClub(null); // Close the modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating club:", error);
      toast.error("Something went wrong");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/auth/clubs/${deletingClub._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setClubs(clubs.filter((club) => club._id !== deletingClub._id)); // Remove the deleted club from the list
        setDeletingClub(null); // Close the delete confirmation modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting club:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <Container className="d-flex justify-content-between align-items-center px-3">
        <h5>
          Total clubs <Tag color="blue">{clubs.length}</Tag>
        </h5>

        <Button
          type="button"
          variant="none"
          onClick={() => setIsTabular((prevIsTabular) => !prevIsTabular)}
        >
          <Image src="/tabel.png" width={"25px"} height={"25px"} alt="_img" />
        </Button>
      </Container>
      {isTabular ? (
        <div className="d-flex flex-wrap justify-content-center gap-2 align-items-start">
          {clubs.map((club) => (
            <Card
              key={club._id}
              actions={[
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => handleEditClick(club)}
                >
                  <EditOutlined key="edit" /> Edit
                </Button>,
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDeleteClick(club)}
                >
                  <DeleteOutlined /> Delete
                </Button>,
              ]}
              style={{
                width: 270,
              }}
            >
              <Card.Meta
                avatar={<Avatar src="/clubs.png" alt="club_image" />}
                title={club.cname}
                description={
                  <div>
                    <h5>
                      <span className="badge text-bg-info">{club.name}</span>
                    </h5>
                    <h6 className="d-flex flex-column">
                      <Image src="/gmail.png" width={"25px"} />
                      <strong>{club.email}</strong>{" "}
                    </h6>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      ) : (
        <Container>
          <Table>
            <Thead className="border py-2 bg-dark text-light">
              <Tr>
                {[
                  "Club Name",
                  "Club Owner",
                  "Email",
                  "Created Date",
                  "Actions",
                ].map((_, index) => {
                  return (
                    <Th key={index}>
                      <h6 className="pt-2 text-center">{_}</h6>
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {clubs.map((club, index) => {
                return (
                  <Tr
                    style={{
                      backgroundColor: index % 2 === 1 ? "#F0F8FF" : "",
                    }}
                    key={index}
                    className=" text text-center border border-top"
                  >
                    <Td>{club.name}</Td>
                    <Td>{club.cname}</Td>
                    <Td>{club.email}</Td>
                    <Td>{club.createdAt?.slice(0, 10)}</Td>
                    <Td>
                      <div className="d-flex gap-2 py-2 justify-content-center">
                        <Button
                          size="sm"
                          variant="outline-dark"
                          onClick={() => handleEditClick(club)}
                        >
                          <EditOutlined key="edit" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteClick(club)}
                        >
                          <DeleteOutlined /> Delete
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Container>
      )}

      {editingClub && (
        <div
          className="modal show d-block text-secondary"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <p className="modal-title">Edit Club</p>
                <Button
                  variant="outline-danger"
                  size="sm"
                  type="button"
                  className="close"
                  onClick={() => setEditingClub(null)}
                >
                  <span>&times;</span>
                </Button>
              </div>
              <div className="modal-body text-secondary">
                <input
                  type="text"
                  value={editingClub.name}
                  onChange={(e) =>
                    setEditingClub({ ...editingClub, name: e.target.value })
                  }
                  placeholder="Enter Name"
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={editingClub.cname}
                  onChange={(e) =>
                    setEditingClub({ ...editingClub, cname: e.target.value })
                  }
                  placeholder="Enter Club Name"
                  className="form-control mb-2"
                />
                <input
                  type="email"
                  value={editingClub.email}
                  onChange={(e) =>
                    setEditingClub({ ...editingClub, email: e.target.value })
                  }
                  placeholder="Enter Email"
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <Button
                  size="sm"
                  type="button"
                  variant="outline-primary"
                  onClick={() => setEditingClub(null)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline-primary"
                  onClick={() => handleSave(editingClub._id, editingClub)}
                >
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingClub && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <p className="modal-title">Confirm Delete</p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline-danger"
                  className="close"
                  onClick={() => setDeletingClub(null)}
                >
                  <span>&times;</span>
                </Button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete the club "{deletingClub.cname}
                  "?
                </p>
              </div>
              <div className="modal-footer">
                <Button
                  type="button"
                  size="sm"
                  variant="outline-primary"
                  onClick={() => setDeletingClub(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline-danger"
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

export default Clubs;
