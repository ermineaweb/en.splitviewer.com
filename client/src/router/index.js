import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../pages/Home";
import Streamers from "../pages/Streamers";
import Streamer from "../pages/Streamer";
import NotFound from "../pages/NotFound";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import ScrollToTop from "./ScrollToTop";
import Battle from "../pages/Battle";
import Graph from "../pages/Graph";
import InstallPrompt from "../components/InstallPrompt";
import HelpPage from "../pages/Help";

export const routes = {
  home: "/",
  streamers: "/streamers",
  streamer: "/streamer/:login",
  graph: "/graph",
  battle: "/battle",
  help: "/help",
};

function Router() {
  const [isVisible, setVisible] = useState(false);
  return (
    <BrowserRouter>
      <Menu />
      <InstallPrompt isVisible={isVisible} setVisible={setVisible} />
      <main>
        <ScrollToTop>
          <Switch>
            <Route exact path={routes.home} component={Home} />
            <Route path={routes.streamers} component={Streamers} />
            <Route path={routes.streamer} component={Streamer} />
            <Route path={routes.graph} component={Graph} />
            {/*<Route path={routes.battle} component={Battle} />*/}
            {/*<Route path={routes.help} component={HelpPage} />*/}
            <Route component={NotFound} />
          </Switch>
        </ScrollToTop>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default Router;
