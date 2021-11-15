import Link from 'next/link';

import { ButtonUI } from '../components';
import { CTABanner } from '../cta/CTABanner';
import { Section } from '../layout/Section';

const Banner = () => (
  <Section>
    <CTABanner
      title='Lorem ipsum dolor sit amet consectetur adipisicing elit.'
      subtitle='Start your Free Trial.'
      button={
        <Link href='https://creativedesignsguru.com/category/nextjs/'>
          <a>
            <ButtonUI>Get Started</ButtonUI>
          </a>
        </Link>
      }
    />
  </Section>
);

export { Banner };
