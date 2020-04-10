import React from 'react'
import Terminal from 'rterminal'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.terminalRef = React.createRef();
    this.terminal = null
  }
  componentDidMount() {
    this.terminal = this.terminalRef.current;
    this.terminal.chdir("C:\\Users\\henry.ruiz");
    this.terminal.start()

  }
  onCommand=(cmd)=>{
    this.terminal.print("Hello world");
  }
  render() {
    return (
      <React.Fragment>
        <h1 className="demo-title">React Terminal</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "50%",
            resize: "both",
            margin: "0 auto",
            paddingTop: "0%",
            overflow: "auto"
          }}>

            <Terminal ref={this.terminalRef} onCommand={this.onCommand}  style={{width: 800, maxHeight: 400, minHeight: 400}}/>
        </div>
      </React.Fragment>
      )
  }


}

export default App
