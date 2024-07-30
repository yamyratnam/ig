import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from '../assets/img.gif';
import { TOKEN, USERNAME, postSignup } from "../kv";

export default function Signup() {

  const navigate = useNavigate();

  useEffect(() => {
    if (TOKEN && USERNAME) navigate(`../createprofile`)
  }, []);

  const [auth, setAuth] = useState({
    username: null,
    password: null,
  });
  const handelInput = (e) => {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    let { username, password } = auth;

    //payload
    let data = {
      "username": username,
      "password": password,
    };

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data)
    }
    let res = await fetch(postSignup, options);

    // get the output as a responce from the server
    let output = await res.json();

    if (output.status) {
      localStorage.setItem("TOKEN", output.token);
      localStorage.setItem("USERNAME", username);
      navigate(`../createprofile`);
      location.reload();
    }
    else {
      alert(output.msg);
    }

  }

  return (
    <StyledDiv>
      <div className="signup-holder">
        <h1><img src={logo} /></h1>
        <input type="text" name="username" placeholder="Username" onChange={handelInput} />
        <input type="password" name="password" placeholder="Password" onChange={handelInput} />
        <button onClick={handelSubmit}>Signup</button>
        <Link to={"../login"}>Already a User?</Link>
      </div>
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
height: 100vh;
display: flex;
align-items: center;
justify-content: center;

.signup-holder{
    display: flex;
    flex-direction: column;
    gap: 15px;
    min-width: 300px;
    h1{
        text-align: center;
        margin-left: -20px;
        margin-bottom: -50px;
        img {
          width: 300px;
        }
    }

    a{
        display: block;
        text-align: center;
        color: #a3a3a3;
        cursor: pointer;
    }
    input, button {
      font-size: 14px;
    }
}
`
