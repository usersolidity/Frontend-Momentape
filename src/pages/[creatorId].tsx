import { Base } from '../templates/Base';
import { useRouter } from 'next/router';
import { CreatorContent } from '../components';
const Creator = () => {
  const router = useRouter();
  const { creatorId } = router.query;
  const profileIMG = creatorId ? `${router.basePath}/assets/images/${creatorId}-profile.jpg` : `${router.basePath}/assets/images/user.png`;
  const name = 'Anna Sudol';
  const ethAddress = '0xFE92A2bbA39CdF36b53Cab3C8e6cC61bE9710eF6';
  return (
    <Base>
      <CreatorContent imgPath={{ cover: `${router.basePath}/assets/images/${creatorId}.jpg`, profile: profileIMG }} name={name} ethAddress={ethAddress} info={{ followers: 11222, following: 32111 }} />
    </Base>
  );
};

export default Creator;
