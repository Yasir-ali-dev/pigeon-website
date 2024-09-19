import React, { useContext, useEffect, useState } from 'react'
import {  Button,  Image } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { Avatar, Card, message, Popconfirm, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import TournamentContext from './Contexts/TournamentContext';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

const TournamentsContainer = () => {
    const {tournaments, fetchTournaments}=useContext(TournamentContext)
    const [isTabular]=useState(true);
    // const columns = [
    //   {
    //     title: "Tournament",
    //     dataIndex: "tournamentName",
    //   },
    //   {
    //     title: "Category",
    //     dataIndex: "category",
    //   },
    //   {
    //     title: "No Prizes",
    //     dataIndex: "numberOfPrizes",
    //   },
    //   {
    //     title: "No Pigeons",
    //     dataIndex: "numberOfPigeons",
    //   },
    //   {
    //     title: "Start Date",
    //     dataIndex: "startDate",
    //     render: (_, { tags }) => {
    //       const date = _.slice(0, 10);
    //       return <Tag> {date}</Tag>;
    //     },
    //   },
    //   {
    //     title: "Start Time",
    //     dataIndex: "startTime",
    //   },
    //   {
    //     title: "Status",
    //     dataIndex: "status_",
    //     render: (_, { tags }) => {
    //       const color = _.length <= 6 ? "red" : "blue";
    //       return <Tag color={color}> {_}</Tag>;
    //     },
    //   },
    //   {
    //     title: "Tournament info",
    //     dataIndex: "tournamentInformation",
    //   },
    //   {
    //     title: "Helper Pigeons",
    //     dataIndex: "helperPigeons",
    //   },
    //   {
    //     title: "Continue Days",
    //     dataIndex: "continueDays",
    //   },
    //   {
    //     title:"Landed Pigeons",
    //     dataIndex:"landedPigeons"
    //   },
    //   {
    //     title: "No Days",
    //     dataIndex: "numberOfDays",
    //   },
    //   {
    //     title: "Type",
    //     dataIndex: "type",
    //   },
    //   {
    //     title: "Participating Loft",
    //     dataIndex: "participatingLoft",
    //     render: (_) => {
    //       return  
    //     },
    //   },
  
    //   {
    //     title: "1st Prize",
    //     dataIndex: "prize1",
    //   },
    //   {
    //     title: "2nd Prize",
    //     dataIndex: "prize2",
    //   },
    //   {
    //     title: "3rd Prize",
    //     dataIndex: "prize3",
    //   },
    //   {
    //     title: "4th Prize",
    //     dataIndex: "prize4",
    //   },
  
    //   {
    //     title: "5th Prize",
    //     dataIndex: "prize5",
    //   },

    
    //   {
    //     title: "Actions",
    //     render :(_)=>{
    //       return 
    //     }
    //   }
    // ];   
    
    console.log(tournaments);
    
    useEffect(()=>{
      fetchTournaments()
    },[])
    const { Meta } = Card;
    const navigate =useNavigate()
   return (
    <div className='px-2' >
    <h5 className="card-title">total tournaments <Tag color='blue'>{tournaments.length}</Tag></h5>
    {!isTabular ?
      <div className='d-flex gap-2 flex-wrap justify-content-center'>
       {
        tournaments.map((tournament,index)=>{
        return(
            <Card
            key={index}
            style={{
                width: 250,
                cursor:"pointer"
            }}
            onClick={()=>{
                navigate(`/tournaments/:${tournament._id}`,{
                state:{tournament:tournament}}
            )   

            }}
            cover={
            <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
            }
            actions={[
                    <span 
                        className={`badge ${tournament.status_ ==="active" ? "text-bg-danger" : "text-bg-warning"} rounded-pill`}>{tournament.status_}
                    </span>,
                <div className='position-relative'>
                    <Image width={"35px"} src='/prize.png' alt='_img'/>
                    <span className="position-absolute top-15 start-60 translate-middle badge rounded-pill bg-info">{tournament.numberOfPrizes}</span>
                </div>,
                <div className='position-relative'>
                    <Image width={"35px"} src='/pigeon.png' alt='_img'/>
                    <span className="position-absolute top-15 start-60 translate-middle badge rounded-pill bg-info">{tournament.numberOfPigeons}</span>
                  </div>
            ]}
          >
                <Meta
                    avatar={<Avatar src="/tournament.png" />}
                    title={tournament.tournamentName}
                    description={tournament.tournamentInformation}
                />
            </Card>
            )
            })
        }     
  </div>
      :
      <Table>
      <Thead className="border py-2 bg-dark text-light">
        <Tr>
          {[
            "Tournament",
            "No Pigeons",
            "Started-Date",
            "Start-Time",
            "Tournament info",
            "Helper Pigeons",
            "Continue Days",
            "Landed Pigeons",
            "No Days",
            "Participating Loft",
            "No prizes",
            "1st Prize",
            "2nd Prize",
            "3rd Prize",
            "4th Prize",
            "5th Prize",
            "actions"
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
        {tournaments.map((tournament, index) => {
          return (
            <Tr
              style={{
                backgroundColor: index % 2 === 1 ? "#F0F8FF" : "",
              }}
              key={index}
              className=" text text-center border border-top"
            >
             <Td>{tournament.tournamentName}</Td> 
             <Td>{tournament.numberOfPigeons}</Td> 
             <Td>
                <Tag color='blue'>
                {tournament.startDate?.slice(1,10)}
               </Tag>
              </Td> 
             <Td>{tournament.startTime}</Td> 
             <Td className='d-block'>
              {tournament.tournamentInformation ==="" ? " " :tournament.tournamentInformation }
              </Td> 
             <Td>{tournament?.helperPigeons}</Td> 
             <Td>{tournament.continueDays}</Td> 
             <Td>{tournament?.landedPigeons ===null ? " " : tournament?.landedPigeons}</Td> 
             <Td>{tournament.numberOfDays}</Td> 
             <Td>
              <Button size='sm'
                onClick={()=>navigate(`/pigeonOwners/pigeonOwnerForm`)} 
                variant='success'
              >Participants</Button> 
            </Td> 
             <Td>{tournament.numberOfPrizes}</Td>' 
             <Td>{tournament.prize1}</Td>
             <Td>{tournament.prize2}</Td>
             <Td>{tournament.prize3}</Td>
             <Td>{tournament.prize4}</Td>'
             <Td>{tournament.prize5}</Td>
             <Td>
              <div className="d-flex gap-2 flex-column py-2 align-items-start">
                <Popconfirm
                  title="Update the task"
                  description="Are you sure to update this task?"
                  okText="Yes"
                  cancelText="No"
                  onCancel={() => message.info("Cancle update")}
                  onConfirm={(e) => {
                    navigate(`/tournaments/:${tournament._id}`,{state:{tournament:tournament}})
                  }}
                >
                  <Button variant="outline-dark" size='sm'>Update</Button>
                  <Toaster />
                </Popconfirm>
              </div>
            </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
      }
    </div>
  )
}

export default TournamentsContainer;