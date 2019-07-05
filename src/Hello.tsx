import * as React from "react";
import * as styles from './index.less';

export interface HelloProps { compiler: string; framework: string };

export class Hello extends React.Component<HelloProps, {}> {
  handleClick =  ((name: object) => {
    console.log('hello------->', name);
  });
  render() {
    return (
      <div className={styles.wrap}>
        <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>
        <button className={styles.btn} onClick={this.handleClick.bind(this, {name: 'Tome'})}>Test Button</button>
      </div>
    );
  }
}