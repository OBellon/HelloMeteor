import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
    };
  }

  toggleHideCompleted(e) {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const text = this.refs.textInput.value.trim();

    Meteor.call('tasks.insert', text);
    // Clear form
    this.refs.textInput.value = '';
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if(this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter( task => !task.checked);
    }

    const { currentUser } = this.props;
    return filteredTasks.map((task) => {
      const currentUserId = currentUser && currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
          <h5>Incompleted tasks: {this.props.incompleteCount}</h5>
          <label>
            <input
              type="checkbox"
              checked={this.state.hideCompleted}
              onChange={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form>
            : ''
          }
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, {
      sort: { createdAt: -1 }
    }).fetch(),
    incompleteCount: Tasks.find({
      checked: { $ne: true }
    }).count(),
    currentUser: Meteor.user(),
  };
}, App);
