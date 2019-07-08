import * as React from 'react';
import * as styles from './index.less';

export interface TellProps { name: string; }

class Tell extends React.Component<TellProps, {}> {
  public render() {
    return (
      <div className={styles.wrap}>
        Tell
      </div>
    );
  }
}
export default Tell;
