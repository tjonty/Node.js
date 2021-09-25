import React, { Component } from 'react';
import axios from 'axios';
import Datepicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./CSS/component.css";

export default class CreateExercise extends Component {

    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            description: '',
            duration: 0,
            date: new Date(),
            users: []
        }
    }

    componentDidMount() {
        axios.get('https://exercise-tracker-nr.herokuapp.com/users/')
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({
                        users: res.data.map(user => user.username),
                        username: res.data[0].username
                    })
                }
            })
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        })
    }

    onChangeDuration(e) {
        this.setState({
            duration: e.target.value
        })
    }

    onChangeDate(date) {
        this.setState({
            date: date
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const exercise = {
            username: this.state.username,
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date
        }

        console.log(exercise);

        axios.post('https://exercise-tracker-nr.herokuapp.com/exercises/add', exercise)
            .then(
                res => {
                    console.log(res.data)
                    window.location = '/';
                })
            .catch((err) => console.log(err));

        // this.setState({
        //         duraion: '213'
        //     })
    }

    render() {
        return (
            <div>
                <h3>CREATE EXERCISE</h3>
                <div className="form-container">
                    <form onSubmit={this.onSubmit} >
                        <label htmlFor="username"> Username: </label>
                        <select
                            id="username"
                            className="form-group"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                            required>
                            {
                                this.state.users.map((user) => {
                                    return <option
                                        key={user}
                                        value={user}>{user}
                                    </option>;
                                })
                            }
                        </select>
                        <label htmlFor="description">Description: </label>
                        <input
                            id="description"
                            className="form-group"
                            type="text"
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                        <label htmlFor="duration">Duration (in minutes): </label>
                        <input
                            id="duration"
                            className="form-group"
                            type="text"
                            value={this.state.duration}
                            onChange={this.onChangeDuration}
                        />
                        <label htmlFor="date">Date: </label>
                        <div>
                            <Datepicker
                                selected={this.state.date}
                                onChange={this.onChangeDate}
                            />
                        </div>
                        <div>
                            <input type="submit" value="Create Exercise Log" className="btn-submit" />
                        </div>
                    </form>
                </div>
            </div >
        )
    }
}