import { AppConfig } from '../../utils/AppConfig';

const FooterCopyright = () => (
  <div className='footer-copyright'>
    &#169; Copyright {new Date().getFullYear()} {AppConfig.title}.
  </div>
);

export { FooterCopyright };
