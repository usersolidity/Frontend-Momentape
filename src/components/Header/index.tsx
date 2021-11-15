import React from 'react';
import Link from 'next/link';

import { Logo, SearchUI } from '../../components';

const Header = () => {
  const userIsLoggedIn = false;
  return (
    <div className='bg-main w-full h-18'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between'>
          <Link href='/'>
            <Logo class='cursor-pointer' />
          </Link>
          <SearchUI />
        </div>
      </div>
    </div>
  );
};
export default Header;
