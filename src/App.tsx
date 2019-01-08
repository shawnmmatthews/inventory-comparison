import React, { Component } from "react";
import { withAuthenticator } from "aws-amplify-react";
import styled from 'styled-components'
import { ScannerPage } from "./ScannerPage";
import { Inventory } from "./Inventory";
import { Router, RouteComponentProps, Link } from "@reach/router"

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  `
let App = () => {
  return (
    <Container className="App">
      <Router>
        <RouterPage path="/" pageComponent={<Inventory />} />
        <RouterPage path="/phone-scanner" pageComponent={<ScannerPage />} />
        <RouterPage path="/gun-scanner" pageComponent={<ScannerPage />} />
      </Router>
    </Container>
  );
}
export default withAuthenticator(App);

//Typescript cheater component from https://github.com/reach/router/issues/141
const RouterPage = (
  props: { pageComponent: JSX.Element } & RouteComponentProps
) => props.pageComponent;