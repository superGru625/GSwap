import React from "react";
import Token from "../views/Token";
import NotFound from "../views/NotFound";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ScrollTopBehaviour from "../components/ScrollTopBehaviour";
import ToastNotification from "../components/ToastNotification";

const Routes = () => {
    return (
        <>
            <Router>
                <ScrollTopBehaviour />
                <Switch>
                    <Route exact path="/" component={Token} />                    
                    <Route component={NotFound} />
                </Switch>
                <ToastNotification />
            </Router>
        </>
    );
};

export default Routes;
