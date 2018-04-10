import React, { Component } from 'react';
import { Redirect, Link, Route} from "react-router-dom";
import axios from 'axios';

import Seasons from './components/Seasons';


class App extends Component 
  {
   render(){
     return(
       <div>
         {/* <navbar/> */}
         <Route path='/' render={() => <Redirect to='/seasons'/>}/>
         <Route path='/seasons' component={Seasons}/>
        
       </div>
     )}
   }


export default App;
