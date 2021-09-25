import { Component } from 'react';
import { Link } from 'react-router-dom';

import './CSS/Navbar.css'

export default class Navbar extends Component {

    render() {
        return (
            <div>
                <Link to="/" className="nav-brand">ExcerTracker</Link>
                <ul>
                    <li>
                        <Link to="/" className="nav-link">Exercises</Link>
                    </li>
                    <li>
                        <Link to="/create" className="nav-link">Create Exercise</Link>
                    </li>
                    <li className="nav-right">
                        <Link to="/user" className="nav-link">Create User</Link>
                    </li>
                </ul>
            </div>
        )
    }
}