import React, { Component } from 'react';
import axios from 'axios';
import Datepicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class EditExercise extends Component {

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
        axios.get('https://exercise-tracker-nr.herokuapp.com/exercises/'+this.props.match.params.id)
            .then(res => {
                console.log('edit data: '+ res.data);
                this.setState({
                    username: res.data.username,
                    description: res.data.description,
                    duration: res.data.duration,
                    date: new Date(res.data.date) 
                })
            })
        axios.get('https://exercise-tracker-nr.herokuapp.com/users/')
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({
                        users: res.data.map(user => user.username),
                        
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

        axios.post('https://exercise-tracker-nr.herokuapp.com/exercises/update/'+this.props.match.params.id, exercise)
            .then(res => console.log(res.data))
            .catch((err) => console.log(err));

        window.location = '/';
    }

    render() {
        return (
            <div>
                <h3> Edit Exercise </h3>
                <form onSubmit={this.onSubmit} >
                    <label> Username: </label>
                    <select
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
                    <label>Description: </label>
                    <input
                        type="text"
                        value={this.state.description}
                        onChange={this.onChangeDescription}
                    />
                    <label>Duration (in minutes): </label>
                    <input
                        type="text"
                        value={this.state.duration}
                        onChange={this.onChangeDuration}
                    />
                    <label>Date: </label>
                    <div>
                        <Datepicker
                            selected={this.state.date}
                            onChange={this.onChangeDate}
                        />
                    </div>
                    <div>
                        <input type="submit" value="Edit Exercise Log" />
                    </div>
                </form>
            </div>
        )
    }
}