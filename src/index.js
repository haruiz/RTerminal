import React from "react";
import './styles.module.css'
import {Menu, Item, Submenu, MenuProvider} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import shortId from "shortid";
import TerminalLine from "./TerminalLine";


class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "cmd",
      lines: [],
      pwd: null,
      is_started: false
    }
    this.currentLineRef = React.createRef();
  }

  contextMenu = () => {
    let themes = ["ubuntu", "cmd", "powershell", "mac"]
    return (
      <Menu id='termContextMenu'>
        <Submenu label="Theme">
          {themes.map(item =>
            <Item key={shortId.generate()} onClick={(evt) =>
              this.contextMenuSelChanged(item)}>{item}</Item>)}
        </Submenu>
      </Menu>)
  }
  contextMenuSelChanged = (item) => {
    this.setState({
      "theme": item
    });
  }
  cmdHandler = (cmd) => {
    if (cmd === "clear" || cmd === "cls") {
      this.clear()
    } else {
      const {onCommand} = this.props
      if (onCommand) {
        onCommand(cmd);
      }
    }
  }
  clear = () => {
    this.setState(state => {
      return {lines: []};
    });
    this.newLine();
  }
  newLine = (color = "white") => {
    this.setState(state => {
      let new_line = <TerminalLine text_color={color} pwd={state.pwd} key={shortId.generate()}
                                   enterKeyPress={this.cmdHandler} ref={this.currentLineRef}/>
      const lines = [...state.lines, new_line]
      return {lines};
    });
  }
  print = (text, color = "white") => {
    if (this.currentLineRef.current)
      this.currentLineRef.current.print(text, color);
    this.newLine();
  }
  chdir = (path) => {
    this.setState(state => {
      return {pwd: path};
    });
  }
  start = () => {
    if (!this.state.is_started)
      this.setState({
        is_started: true
      })
    this.newLine();
  }

  render() {
    const {theme, lines} = this.state
    const {onCommand, ...customs} = this.props
    return (
      <React.Fragment>
        <MenuProvider id="termContextMenu" style={{width: "100%", display: 'inline-block'}}>
          <div className={`main-div ${theme}-main`}>
            <div  className={`nav-div ${theme}-nav`}>
              Terminal
            </div>
            <div className="body-div">
              {lines}
            </div>
          </div>
        </MenuProvider>
        {this.contextMenu()}
      </React.Fragment>
    )
  }
}

Terminal.defaultProps = {
  onCommand: null
}

export default Terminal;
