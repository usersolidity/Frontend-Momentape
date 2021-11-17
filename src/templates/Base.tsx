import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Header, Footer } from '../components';
const Base: React.FunctionComponent = ({ children }) => (
  <div className='antialiased text-gray-600'>
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <Header />
    {children}
    <Footer />
  </div>
);

export { Base };
