import { ReactNode } from 'react';
// import './Footer.css';

type IFooterIconListProps = {
  children: ReactNode;
};

const FooterIconList = (props: IFooterIconListProps) => <div className='footer-icon-list flex flex-wrap'>{props.children}</div>;

export { FooterIconList };
