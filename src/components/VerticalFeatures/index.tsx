import { VerticalFeatureRow } from './VerticalFeatureRow';
import { VerticalPurpleFutureRow } from './VerticalPurpleFutureRow';
import { ButtonUI } from '../../components';
import { Section } from '../../layout/Section';

const VerticalFeatures = () => (
  <Section>
    <VerticalFeatureRow title='Collect creators&#39; Top Moments' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.' image='feature.svg' />
    <VerticalPurpleFutureRow title='You’re an Artist' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.' images={['feature.svg']} reverse>
      <ButtonUI>
        Get started as an artist
      </ButtonUI>
    </VerticalPurpleFutureRow>
  </Section>
);

export default VerticalFeatures;
