import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Task extends Component {
  toggleChecked() {
    const { task } = this.props;
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  deleteThisTask() {
    const { task } = this.props;
    Meteor.call('tasks.remove', task._id);
  }

  render() {
    const taskClassName = this.props.task.checked
                            ? 'checked'
                            : '';

    return (
      <li className={taskClassName}>
        <button className="delete"
                onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>
      </li>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
};
