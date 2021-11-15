import { AppConfig } from '../utils/AppConfig';
// import './Footer.css';

const FooterCopyright = () => (
  <div className='footer-copyright'>
    © Copyright {new Date().getFullYear()} {AppConfig.title}.
  </div>
);

export { FooterCopyright };
