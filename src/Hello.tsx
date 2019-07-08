import * as React from 'react';
import * as styles from './index.less';

import { Button } from 'antd';

import Tell from './components/Tell';
import hoc from './Hoc';

type Name = string;

export interface UserInfo { name: Name; }
export interface HelloProps { compiler: string; framework: string; }
export interface UserInfoProps { name: Name; sex?: number; }

class Hello extends React.Component<HelloProps, {}> {
  public state = {
    userInfo: {},
  };
  public handleClick =  ((user: UserInfo): Name => {
    console.log('hello------->', name);
    return user.name;
  });
  public render() {
    return (
      <div className={styles.wrap}>
        <Tell name='tt' />
        <Button>Test Button</Button>
        <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>
        <button className={styles.btn} onClick={this.handleClick.bind(this, {name: 'Tome'})}>Test Button</button>
      </div>
    );
  }
}

const HelloHoc = hoc(Hello);
export { HelloHoc as Hello };
