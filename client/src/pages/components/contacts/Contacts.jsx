import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import nofollow from '../../../assets/notfollowing.webp';
import { CONTACTS, TOKEN, USER_PROFILE, getContacts, getFollowers } from "../../../kv";

export default function Contacts() {

  const navigate = useNavigate();
  const [ followers, setFollowers ]  = useState([]);
  const [contacts, setContacts] = useState(CONTACTS);

  useEffect(() => {
    if (!TOKEN && !USER_PROFILE) {
      navigate('../signup');
    }

    if (!CONTACTS) {
      async function doFetch() {

        let res = await fetch(getContacts, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `${TOKEN}`
          },
        });
  
        // get the output as a responce from the server
        let output = await res.json();

        if (output.status) {
          localStorage.setItem("CONTACTS", JSON.stringify(output.contacts));
          setContacts(output.contacts);
        }
        else {
          console.log(output.msg);
        }
      }
  
      doFetch();
    }

    async function doFetch() {

      let res = await fetch(getFollowers, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `${TOKEN}`
        },
      });

      // get the output as a responce from the server
      let output = await res.json();


      if (output.status) {
        setFollowers(output.followers);
      }
      else {
        console.log(output.msg);
      }
    }

    doFetch();
  }, [])

  return (
    <StyledDiv>
      
      <div className="search-wrapper">
        <input type="text" placeholder="Search.." />
      </div>

      <div className="following-wrapper">
        <div id="follow-holder">
          <h2>Following ({contacts ? contacts?.contacts?.length : null}) </h2>
          
          {(contacts?.contacts.length > 0)
            ? <div className="following">
            {contacts?.contacts
              ? contacts.contacts.map(contact => {
                return (
                  <div className="user-wrapper">
                    <div className="img-wrapper">
                      <img src={contact.dp} />
                    </div>
                    <h4> <Link to={"../" + contact.username}>{contact.username}</Link> </h4>
                  </div>
                )
              }).reverse()
              : null
            }
          </div>
          : <div className="nofollow">
            <div className="img-wrapper">
              <img src={nofollow} />
            </div>
          </div>
          }

        </div>
        
            <div className="followed">
              <h5>Followed by ({(followers?.length > 0) ? followers.length : 0})</h5>
              <ul>
                {(followers?.length > 0)
                  ? followers.map( follow => {
                    return <li><Link  to={"../" + follow}>{follow}</Link></li>
                  }).reverse()
                  : null
                }
              </ul>
            </div>

      </div>
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  overflow: hidden;
  overflow-y: scroll;

  a{
    color: inherit;
  }

  .search-wrapper{
    width: fit-content;
    height: fit-content;
    margin: 30px;
    position: relative;
    
    ul{
      overflow: hidden;
      max-height: 50vh;
      overflow-y: auto;
      position: absolute;
      margin-top: 2px;
      width: 100%;
      border-left: 1px solid lightgrey;
      border-right: 1px solid lightgrey;
      border-bottom: 1px solid lightgrey;
      border-bottom-left-radius: 7px;
      border-bottom-right-radius: 7px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
      display: none;

      li{
        list-style: none;
        padding: 5px 10px;
        color: #555555;
        background-color: #eef8ff;

        &:nth-child(2n){
          background-color: #fafeff;
        }
      }
    }
  }

  .followed{
    border: 2px solid lightgrey;
    padding: 15px;
    border-radius: 10px;
    height: fit-content;
    margin-top: 60px;


    li{
      list-style: none;
      color: grey;
    }
  }

  .nofollow{
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .following-wrapper{
    padding: 30px;
    margin-left: 20px;
    margin-top: 30px;
    h2{
      margin-bottom: 30px;
    }
    display: grid;
    gap: 30px;
    grid-template-columns: 2fr 1fr;
  }

  .following{
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(auto-fill, 190px);
    grid-template-rows: 240px;

    .user-wrapper{
      padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  width: 150px;
  height: 190px;
  border-radius: 10px;
  animation: pop 0.3s ease-in-out !important;
  gap: 15px;
  align-items: center;

  .img-wrapper{
    width: 150px;
    height: 150px;
    border-radius: 10px;
    overflow: hidden;

    img{
      width: inherit;
      height: inherit;
      object-fit: cover;
    }
  }
    }
  }


`