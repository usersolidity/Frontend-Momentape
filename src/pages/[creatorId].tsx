import { Base } from '../templates/Base';
import { useRouter } from 'next/router';
import { CreatorContent } from '../components';
const Creator = () => {
  const router = useRouter();
  const { creatorId } = router.query;
  return (
    <Base>
      <CreatorContent imgPath={`${router.basePath}/assets/images/${creatorId}.jpg`} />
    </Base>
  );
};

export default Creator;
