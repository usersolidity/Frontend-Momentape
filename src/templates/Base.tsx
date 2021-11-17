import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Header } from '../components';
const Base: React.FunctionComponent = ({ children }) => (
  <div className='relative'>
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <Header />
    {children}
  </div>
);

export { Base };
