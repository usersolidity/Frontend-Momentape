import { VerticalFeatureRow } from '../feature/VerticalFeatureRow';
import { Section } from '../layout/Section';

const VerticalFeatures = () => (
  <Section>
    <VerticalFeatureRow
      title='Collect creators&#39; Top Moments'
      description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.'
      image='/assets/images/feature.svg'
      imageAlt='NFT'
    />
    <VerticalFeatureRow
      title='Your title here'
      description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.'
      image='/assets/images/feature2.svg'
      imageAlt='Second feature alt text'
      reverse
    />
    <VerticalFeatureRow
      title='Your title here'
      description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum, nunc non posuere consectetur, justo erat semper enim, non hendrerit dui odio id enim.'
      image='/assets/images/feature3.svg'
      imageAlt='Third feature alt text'
    />
  </Section>
);

export { VerticalFeatures };
