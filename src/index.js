import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

// import routes from "./routes";
import "./styles.css";
import store from "store";
import { history } from "context";
import StatsCalc from './views/StatsCalc';

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        {/* {routes.map(({ path, component }, index) => (
          <Route
            key={index}
            path={path}
            component={component}
          />
        ))} */}

        <Route
          // path="/:lang(en|zh|ja)/:mode(stats|dungeon)?"
          path="/:lang(en|zh|ja)"
          component={StatsCalc}
        />
        {/* <Redirect to="/en" /> */}
        <Route component={StatsCalc} />
      </Switch>
    </Router>
  </Provider>
);

ReactDOM.render(
  <Root />,
  document.getElementById("root")
);