import React from 'react';

import Header from '../shared/components/layout/header';
import RoutingButtons from '../shared/components/layout/sidebar';

import './PrivateSection.scss';

function PrivateSection(props: React.PropsWithChildren<{}>): JSX.Element | null {
  return (
    <div className="private-layout">
      <div className="container-layout">
        <Header />
        <RoutingButtons />
        <div className="container-fluid">{props.children}</div>
      </div>
    </div>
  );
}

export default PrivateSection;
