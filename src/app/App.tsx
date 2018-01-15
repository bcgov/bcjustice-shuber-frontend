import * as React from 'react';
import './App.css';
import './Glyphicons.css'
import { Provider } from 'react-redux'
import store from './store'
import {
  Route,
  BrowserRouter as Router
} from "react-router-dom";


import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {
  Contact,
  Home,
  Timeline,
  ManageSheriff
} from './pages'

import Footer from './components/Footer';
import Navigation from './components/Navigation'

class Layout extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="headerArea">
          <Navigation />
        </div>
        <div className="mainArea" style={{ marginTop: -5}}>
          <Route exact path='/' component={Home} />
          <Route path='/timeline' component={Timeline} />
          <Route path='/sheriffs/manage' component={ManageSheriff} />
          <Route path='/contact' component={Contact} />
        </div>
        <div className='footerArea'>
        <Footer />
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Layout/>
        </Router>
      </Provider>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
