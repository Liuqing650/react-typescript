import * as React from "react";
import * as styles from './index.less';

export interface HelloProps { compiler: string; framework: string };

export class Hello extends React.Component<HelloProps, {}> {
  render() {
    return (
      <div className={styles.wrap}>
        <h1>Hello from {this.props.compiler} and {this.props.framework} hoho!</h1>
      </div>
    );
  }
}