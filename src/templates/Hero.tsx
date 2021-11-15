import Link from 'next/link';

import { Background } from '../background/Background';
import { ButtonUI } from '../components';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

const Hero = () => (
  <Background color='bg-gray-100'>
    <Section yPadding='py-6'>
      <NavbarTwoColumns logo={<Logo xl />}>
        <li>
          <Link href=''>
            <a>GitHub</a>
          </Link>
        </li>
        <li>
          <Link href='/'>
            <a>Sign in</a>
          </Link>
        </li>
      </NavbarTwoColumns>
    </Section>

    <Section yPadding='pt-20 pb-32'>
      <HeroOneButton
        title={
          <>
            {'The modern landing page for\n'}
            <span className='text-primary-500'>React developers</span>
          </>
        }
        description='The easiest way to build a React landing page in seconds.'
        button={
          <Link href='/'>
            <a>
              <ButtonUI>ex</ButtonUI>
            </a>
          </Link>
        }
      />
    </Section>
  </Background>
);

export { Hero };
