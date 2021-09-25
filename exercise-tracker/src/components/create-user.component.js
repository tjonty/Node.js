import { Component } from 'react';
import axios from 'axios';
import "./CSS/component.css";

export default class CreateUser extends Component {

    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username,
        }

        console.log(user);

        axios.post('https://exercise-tracker-nr.herokuapp.com/users/add', user)
            .then(res => console.log(res.data))
            .catch((err) => console.log(err));

        this.setState({
            username: ''
        })
    }

    render() {
        return (
            <div>
                <h3>CREATE USER</h3>
                <div className="form-container">
                <form onSubmit={this.onSubmit}>
                    <label htmlFor="username">Username: </label>
                    <input
                        id="username"
                        className="form-group"
                        type="text"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        required
                    />
                    <input type="submit" value="Create User" className="btn-submit" />
                </form>
            </div>
            </div >
        )
    }
}