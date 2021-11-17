import { Base } from '../templates/Base';
import { useRouter } from 'next/router';
import { CreatorContent } from '../components';
import { IContentItemProps } from '../components/CreatorContent/ContentItem';
const Creator = () => {
  const router = useRouter();
  const { creatorId } = router.query;
  const profileIMG = creatorId ? `${router.basePath}/assets/images/${creatorId}-profile.jpg` : `${router.basePath}/assets/images/user.png`;
  const name = 'Anna Sudol';
  const ethAddress = '0xFE92A2bbA39CdF36b53Cab3C8e6cC61bE9710eF6';
  const content: IContentItemProps[] = [
    {
      title: 'example',
      imgPath: `${router.basePath}/assets/images/photo-ship.jpg`,
      price: 1000,
    },
    {
      title: 'example',
      imgPath: `${router.basePath}/assets/images/photo-ship.jpg`,
      price: 1000,
    },
    {
      title: 'example',
      imgPath: `${router.basePath}/assets/images/photo-ship.jpg`,
      price: 1000,
    },
    {
      title: 'example',
      imgPath: `${router.basePath}/assets/images/photo-ship.jpg`,
      price: 1000,
    },
    {
      title: 'example',
      imgPath: `${router.basePath}/assets/images/photo-ship.jpg`,
      price: 1000,
    },
  ];
  return (
    <Base>
      <CreatorContent imgPath={{ cover: `${router.basePath}/assets/images/${creatorId}.jpg`, profile: profileIMG }} name={name} ethAddress={ethAddress} content={content} />
    </Base>
  );
};

export default Creator;
