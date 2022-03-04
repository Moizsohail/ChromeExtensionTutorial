import React, { useState } from "react";
import { Button, Container, FormControl, Navbar } from "react-bootstrap";
import { sendMessage } from "../messaging";
import { MessageTypes } from "../types";

const Home = () => {
  const [text, setText] = useState("");
  const handleChange = (e: any) => {
    setText(e.target.value);
  };
  const mooHandler = () => {
    sendMessage(MessageTypes.execute, { text: text });
  };
  return (
    <>
      <Navbar bg="primary" className="px-3" expand="lg" variant="dark">
        <Navbar.Brand>Our Mooo Extension</Navbar.Brand>
      </Navbar>
      <Container className="w-100 h-100 p-3">
        <FormControl
          value={text}
          placeholder="What to Moo?"
          onChange={handleChange}
        ></FormControl>
        <div className="d-flex mt-3 justify-content-end">
          <Button onClick={mooHandler}>Let's Mooo</Button>
        </div>
      </Container>
    </>
  );
};
export default Home;
