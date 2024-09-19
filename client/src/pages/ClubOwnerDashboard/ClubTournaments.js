import { Breadcrumb, message, Popconfirm, Table, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

const ClubTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchClubTournaments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/tournaments/club/:${user.id}`
      );
      console.log(response.data);

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
  const columns = [
    {
      title: "Tournament",
      align: "start",
      dataIndex: "tournamentName",
    },
    {
      title: "Category",
      align: "center",
      dataIndex: "category",
    },
    {
      title: "No Prizes",
      align: "center",
      dataIndex: "numberOfPrizes",
    },
    {
      title: "No Pigeons",
      align: "center",
      dataIndex: "numberOfPigeons",
    },
    {
      title: "Start Date",
      align: "center",
      dataIndex: "startDate",
      render: (_, { tags }) => {
        const date = _.slice(0, 10);
        return <Tag> {date}</Tag>;
      },
    },
    {
      title: "Start Time",
      align: "center",
      dataIndex: "startTime",
    },
    {
      title: "Status",
      align: "center",
      dataIndex: "status_",
      render: (_, { tags }) => {
        const color = _.length <= 6 ? "red" : "blue";
        return <Tag color={color}> {_}</Tag>;
      },
    },
    {
      title: "Tournament Info",
      align: "center",
      dataIndex: "tournamentInformation",
    },
    {
      title: "Helper Pigeons",
      align: "center",
      dataIndex: "helperPigeons",
    },
    {
      title: "Continue Days",
      align: "center",
      dataIndex: "continueDays",
    },
    {
      title: "No Days",
      align: "center",
      dataIndex: "numberOfDays",
    },
    {
      title: "Landed Pigeons",
      align: "center",
      dataIndex: "landedPigeons",
    },

    {
      title: "Type",
      align: "center",
      dataIndex: "type",
    },
    {
      title: "1st Prize",
      align: "center",
      dataIndex: "prize1",
    },
    {
      title: "2nd Prize",
      align: "center",
      dataIndex: "prize2",
    },
    {
      title: "3rd Prize",
      align: "center",
      dataIndex: "prize3",
    },
    {
      title: "4th Prize",
      align: "center",
      dataIndex: "prize4",
    },

    {
      title: "5th Prize",
      align: "center",
      dataIndex: "prize5",
    },
    {
      title: "Participating Lofts",
      align: "center",
      dataIndex: "startTime",
      render: (rowRecord) => {
        return (
          <Button
            size="sm"
            variant="success"
            onClick={() => {
              navigate(`/club/${user.slug}/pigeonOwnerForm`, {
                startTime: rowRecord,
              });
            }}
          >
            Participants
          </Button>
        );
      },
    },
    {
      title: "Actions",
      render: (_) => {
        return (
          <div className="d-flex gap-2 flex-column py-2 align-items-start">
            <Popconfirm
              title="Update the task"
              description="Are you sure to update this task?"
              okText="Yes"
              cancelText="No"
              onCancel={() => message.info("Cancle update")}
              onConfirm={(e) => {
                navigate(`/club/:${user.slug}/tournaments/:${_._id}`, {
                  state: { tournament: _ },
                });
              }}
            >
              <Button variant="dark" size="sm">
                Update
              </Button>
              <Toaster />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const rowClassName = (record, index) => {
    return index % 2 === 0 ? "striped-row" : ""; // Apply class to every other row
  };

  return (
    <div className="px-2">
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
                Create Tournaments
              </NavLink>
            ),
          },
        ]}
      />
      <Table
        columns={columns}
        scroll={{ x: 1300 }}
        bordered
        showSorterTooltip
        pagination={false}
        dataSource={tournaments && tournaments}
        size="small"
        rowClassName={rowClassName} // Apply the class to the rows
        rowKey={(rowRecord) => rowRecord.id || rowRecord._id}
      />
    </div>
  );
};

export default ClubTournaments;
