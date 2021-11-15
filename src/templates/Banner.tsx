import Link from 'next/link';

import { ButtonUI } from '../components';
import { CTABanner } from '../cta/CTABanner';
import { Section } from '../layout/Section';

const Banner = () => (
  <Section>
    <CTABanner
      title='Lorem ipsum dolor sit amet consectetur adipisicing elit.'
      subtitle='Lorem ipsum dolor sit amet'
      button={
        <Link href=''>
          <a>
            <ButtonUI>Get Started</ButtonUI>
          </a>
        </Link>
      }
    />
  </Section>
);

export { Banner };
