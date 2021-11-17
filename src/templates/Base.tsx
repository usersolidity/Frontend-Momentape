import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Header, VerticalFeatures, Footer } from '../components';

const Base = () => (
  <div className='antialiased text-gray-600'>
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <Header />
    <VerticalFeatures />

    <Footer />
  </div>
);

export { Base };
