import React from "react";
import { Button, Container, FormControl, Navbar } from "react-bootstrap";

const Home = () => (
  <>
    <Navbar bg="primary" className="px-3" expand="lg" variant="dark">
      <Navbar.Brand>Our Mooo Extension</Navbar.Brand>
    </Navbar>
    <Container className="w-100 h-100 p-3">
      <FormControl placeholder="What to Moo?"></FormControl>
      <div className="d-flex mt-3 justify-content-end">
        <Button>Let's Mooo</Button>
      </div>
    </Container>
  </>
);
export default Home;
