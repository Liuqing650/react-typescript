import * as React from 'react';
import * as styles from './hocStyle.less';

interface StyleThemeProps {
  theme: string;
}

const hoc = <P extends object>(WrappedComponent: React.ComponentType<P>) => (
  class StyleComp extends React.Component<P & StyleThemeProps> {
    public render() {
      const { theme = '#FFF', ...props } = this.props;
      return (
        <div className={styles.wrap} style={{background: theme}}>
          <WrappedComponent {...props as P} />
        </div>
      );
    }
  }
);

export default hoc;
