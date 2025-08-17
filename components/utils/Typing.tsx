import React from "react";
import Typed from 'typed.js'

interface TypingProps {
  words: string[];
}

class Typing extends React.Component<TypingProps> {
  typed: Typed | undefined;
  el: HTMLElement | null = null;

  componentDidMount () {
    this.initializeTyped();
  }

  componentDidUpdate(prevProps: TypingProps) {
    if (prevProps.words !== this.props.words) {
      this.typed?.destroy();
      this.initializeTyped();
    }
  }

  componentWillUnmount () {
    if (this.typed) this.typed.destroy();
  }

  initializeTyped() {
    const { words } = this.props;
    const options = {
      strings: words,
      typeSpeed: 50,
      backSpeed: 50,
      loop: false,
      cursorChar: "|",
    };
    this.typed = new Typed(this.el, options);
  }

  render () {
    return (
      <span style= { { whiteSpace: "pre" }} ref= { (el) => { this.el = el; }} />
    );
  }
}

export default Typing;