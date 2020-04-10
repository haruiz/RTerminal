import React from "react";
import TextareaAutosize from "react-autosize-textarea";

class TerminalLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textCmd: "",
      textOut: "",
      textOutColor: "white",
      readOnly: false,
      db: [
        'clear','cls','admin','alias','ar','asa','at','awk','basename','batch','bc','bg','cal','cat','cd','cflow','chgrp','chmod','chown','cksum','cmp','comm','command','compress','cp','crontab','csplit','ctags','cut','cxref','date','dd','delta','df','diff','dirname','du','echo','ed','env','ex','expand','expr','FALSE','fc','fg','file','find','fold','fort77','fuser','gencat','get','getconf','getopts','grep','hash','head','iconv','id','ipcrm','ipcs','jobs','join','kill','lex','link','ln','locale','localedef','logger','logname','lp','ls','m4','mailx','make','man','mesg','mkdir','mkfifo','more','mv','newgrp','nice','nl','nm','nohup','od','paste','patch','pathchk','pax','pr','printf','prs','ps','pwd','qalter','qdel','qhold','qmove','qmsg','qrerun','qrls','qselect','qsig','qstat','qsub','read','renice','rm','rmdel','rmdir','sact','sccs','sed','sh','sleep','sort','split','strings','strip','stty','tabs','tail','talk','tee','test','time','touch','tput','tr','TRUE','tsort','tty','type','ulimit','umask','unalias','uname','uncompress','unexpand','unget','uniq','unlink','uucp','uudecode','uuencode','uustat','uux','val','vi','wait','wc','what','who','write','xargs','yacc','zcat'
      ]
    }
    this.terms = []
    this.currTermIndex = 0
  }

  keyPressEvent = (evt) => {
    const {enterKeyPress} = this.props
    const {textCmd} = this.state
    if (evt.key === 'Enter' && textCmd) {
      enterKeyPress(textCmd)
      this.setState({readOnly: true})
    }
    else if(evt.key === "Tab"){
      if(this.terms.length > 0) {
        this.currTermIndex = (this.currTermIndex + 1) % this.terms.length;
        this.setState({textCmd: this.terms[this.currTermIndex]})
      }
      evt.preventDefault(); // Let's stop this event.
      evt.stopPropagation(); // Really this time.
    }
  }
  updateTerms=()=>{
    this.currTermIndex = 0;
    const {textCmd, db} = this.state;
    if(db.length > 0){
      this.terms = db.filter( v => v.startsWith(textCmd))
    }
  }
  txtCommandValueChanged = (event) => {
    let newValue =  event.target.value;
    this.setState({textCmd: newValue});
    this.updateTerms()
  }
  print = (text, color = "white") => {
    this.setState({textOut: text, textOutColor: color})
  }
  render() {
    const {textCmd, textOut, textOutColor, readOnly} = this.state
    const {pwd} = this.props
    return (
      <React.Fragment>
        <div className="term_line_container">
          <label className="term_line_txt_pwd">{pwd}></label>
          <input className="term_line_txt_cmd" type="text" readOnly={readOnly} value={textCmd} onChange={this.txtCommandValueChanged} autoFocus={true} onKeyDown={this.keyPressEvent}/>
        </div>
        {textOut && <TextareaAutosize readOnly={readOnly} className="term_line_txt_output" ref={this.textarea} value={textOut}  wrap="off" style={{color: textOutColor}}/>}
      </React.Fragment>
    );
  }
}

TerminalLine.defaultProps = {
  text_out_color: "red",
  pwd: null
}

export default TerminalLine;
