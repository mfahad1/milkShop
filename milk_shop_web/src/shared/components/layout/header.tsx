import React from 'react';
import { Navbar } from 'react-bootstrap';

import Logo from '../Logo';
import './header.scss';

function Header(): JSX.Element {
  return (
    <Navbar expand="lg">
      <Logo />
    </Navbar>
  );
}

export default Header;
