import React, {Component} from "react";
import { Link, Route } from "react-router-dom";
import axios from 'axios';


class Seasons extends Component {
    constructor(){
    super();
    this.state = {
       seasons : []
   }
}

ComponentDidMount(){
    axios.get('http://localhost:3001/seasons')
    .then((res) =>
    {
        console.log(res);
        this.setState({
            season:res.data
        })})
}
    render() {

        const musim=this.state.season.map((item,index)=>
        
            <div key={index}>
                <li>
                    <div className="season-season">
                        <p className="season-desc">
                        {musim.season}</p>
                    </div>
                </li>
            </div>    
        ); 
        return (
            <div>
            <Link to="/Categories">
            <div class="new-season">{musim}
            </div>
            </Link>
            </div>
        )
    }}
export default Seasons;