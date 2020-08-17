import React from 'react';
import './App.css';
import HouseDetail from './HouseDetail';
import HouseOverview from './HouseOverview';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/houseDetails/:houseId/:backgroundColor">
          <HouseDetail houseId="{houseId}" backgroundColor="{backgroundColor}"/>
        </Route>
        <Route path="/">
          <HouseOverview></HouseOverview>
          <Link to="/houseDetails/200">HouseDetails</Link>
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
