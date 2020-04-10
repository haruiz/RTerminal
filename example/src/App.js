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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "60%",
          resize: "both",
          margin: "0 auto",
          paddingTop: "10%",
          overflow: "auto"
        }}>
          <Terminal ref={this.terminalRef} onCommand={this.onCommand}  style={{width: 800, height: 600, minHeight: 500, minWidth: 800}}/>
      </div>
      )
  }


}

export default App
