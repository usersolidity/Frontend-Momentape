import { ButtonUI, Header } from '../components';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';

const Index = () => {
  // const router = useRouter();

  return (
    <Main meta={<Meta title='Momentape' description='Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework.' />}>
      <Header />
      <ButtonUI>Button</ButtonUI>
    </Main>
  );
};

export default Index;
