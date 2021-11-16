import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Banner } from './Banner';
import { Footer } from './Footer';
import { Header } from '../components';
import { VerticalFeatures } from './VerticalFeatures';

const Base = () => (
  <div className='antialiased text-gray-600'>
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <Header />
    <VerticalFeatures />
    {/* <Banner /> */}
    <Footer />
  </div>
);

export { Base };
