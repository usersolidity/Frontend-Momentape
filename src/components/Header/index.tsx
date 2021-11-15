import React from 'react';
import Link from 'next/link';

import Logo from '../Logo';

const Header = () => (
  <div className='bg-main w-full h-18'>
    <div className='container mx-auto px-4'>
      <Link href='/'>
        <Logo class='cursor-pointer' />
      </Link>
    </div>
  </div>
);

export default Header;
