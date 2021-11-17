import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Footer } from './Footer';
import { Header, VerticalFeatures } from '../components';

const Base = () => (
  <div className='antialiased text-gray-600'>
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <Header />
    <VerticalFeatures />

    <Footer />
  </div>
);

export { Base };
