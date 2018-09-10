import React from 'react'
import ReactDOM from 'react-dom'

class HelloWorld extends React.Component {
  render () {
    return (
      <div>
        <h1>Roguelike Game</h1>
        <p>Welcome to Cyberpunk Roguelike!</p>
      </div>
    )
  }
}

ReactDOM.render(<HelloWorld />, document.getElementById('app'))
