import { ReactNode } from 'react';

import Link from 'next/link';

import { AppConfig } from '../utils/AppConfig';
import { ButtonUI, Header } from '../components';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className='antialiased w-full text-gray-700 px-1'>
    <Header />
  </div>
);

export { Main };
