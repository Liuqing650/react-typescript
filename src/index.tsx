import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Hello } from './Hello';

ReactDom.render(
  <Hello compiler='TypeScript' framework='React' theme='green' />,
  document.getElementById('app'),
);
