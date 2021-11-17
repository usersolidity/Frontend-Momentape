import Link from 'next/link';

import { Logo } from '../../components';
import { FooterCopyright } from './FooterCopyright';

const Footer = () => (
  <div className='bg-gray-100 flex flex-col items-center justify-center p-8'>
    <Logo classes='text-main-100' />

    <div className='mt-8 text-sm'>
      <FooterCopyright />
    </div>
  </div>
);

export default Footer;
