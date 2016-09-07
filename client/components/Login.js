import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      username: '',
      password: '',
    };
  }

  handleUserName(e) {
    this.setState({
      username: e.currentTarget.value,
    });
  }

  handlePassword(e) {
    this.setState({
      password: e.currentTarget.value,
    });
  }

  handleSubmit() {
    console.log('hey', this.state.username, this.state.password);
    this.props.handleLogin(this.state.username);
    this.close();
  }

  close() {
    this.setState({
      show: false,
    });
  }

  render() {
    return (
      <div id="login-modal">
        <Modal show={this.state.show} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id="login-information">
              <input
                type="text"
                value={this.state.username}
                placeholder="Enter name"
                onChange={e => this.handleUserName(e)}
              />
              <br />
              <input
                type="password"
                value={this.state.password}
                placeholder="Enter password"
                onChange={e => this.handlePassword(e)}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" onClick={e => this.handleSubmit(e)}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}