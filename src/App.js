import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Dashboard from "./screens/Dashboard";
import Navbar from "./components/Navbar";
import Class from "./screens/Class";
import CreateClass from "./components/CreateClass";
import LectureScreen from "./screens/LectureScreen";
import AssignmentScreen from "./screens/AssignmentScreen";
function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/dashboard">
            <Navbar />
            <Dashboard />
          </Route>
          <Route exact path="/class/:id">
            <Navbar />
            <LectureScreen />
          </Route>
          <Route exact path="/class/:id/discussion">
            <Navbar />
            <Class />
          </Route>
          <Route exact path="/class/:id/assignments">
            <Navbar />
            <AssignmentScreen />
          </Route>
          {/* <Route exact path="/createclass">
            <Navbar />
            <CreateClass/>
          </Route> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
