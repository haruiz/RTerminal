import React from "react";
import './styles.module.css'
import {Menu, Item, Submenu, MenuProvider} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import shortId from "shortid";
import TextareaAutosize from 'react-autosize-textarea';

class TerminalLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      textOut: "",
      textOutColor: "white",
      readOnly: false
    }
  }

  keyPressEvent = (evt) => {
    const {enterKeyPress} = this.props
    const {text} = this.state
    if (evt.key === 'Enter' && text) {
      enterKeyPress(text)
      this.setState({readOnly: true})
    }
  }
  textInputValueChangedEvent = (event) => {
    this.setState({text: event.target.value});
  }
  textAreaValueChangedEvent = (event) => {
    this.setState({textOut: event.target.text});
  }
  print = (text, color = "white") => {
    this.setState({textOut: text, textOutColor: color})
  }

  render() {
    const {text, textOut, textOutColor, readOnly} = this.state
    const {pwd} = this.props
    return (
      <React.Fragment>
        <div className="term_line_container">
          <label className="term_line_txt_pwd">{pwd}></label>
          <input className="term_line_txt_cmd" type="text" readOnly={readOnly} value={text}
                 onChange={this.textInputValueChangedEvent} autoFocus={true} onKeyPress={this.keyPressEvent}/>
        </div>
        {textOut &&
        <TextareaAutosize readOnly={readOnly} className="term_line_txt_output" ref={this.textarea} value={textOut}
                          wrap="off" style={{color: textOutColor}}/>}
      </React.Fragment>
    );
  }
}

TerminalLine.defaultProps = {
  text_out_color: "red",
  pwd: null
}

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
        <main className={`${theme}-terminal`} {...customs}>
          <MenuProvider id="termContextMenu" style={{width: "100%", display: 'inline-block'}}>
            <nav>
            </nav>
          </MenuProvider>
          <section>
            {lines}
          </section>
        </main>
        {this.contextMenu()}
      </React.Fragment>
    )
  }
}

Terminal.defaultProps = {
  onCommand: null
}

export default Terminal;
