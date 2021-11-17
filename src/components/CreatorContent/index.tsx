import styles from './CreatorContent.module.css';
import _ from 'lodash';
import ContentItem, { IContentItemProps } from './ContentItem';

type ICreatorContentProps = {
  imgPath: {
    profile: string;
    cover: string;
  };
  name: string;
  ethAddress: string;
  content: IContentItemProps[];
};

const CreatorContent: React.FunctionComponent<ICreatorContentProps> = ({ imgPath, name, ethAddress, content }) => {
  return (
    <>
      <div className={styles.cover} style={{ backgroundImage: `url(${imgPath.cover})` }}></div>
      <div className='container'>
        <div className='flex'>
          <div className='w-24 h-24 rounded relative bottom-12'>
            <img src={imgPath.profile} alt='profile img' className='w-24 h-24 rounded object-cover' />
          </div>
          <div>
            <span className='text-gray-900 text-2xl font-bold ml-2 block'>{name}</span>
            <span className='text-gray-800 block ml-2'>
              {_.truncate(ethAddress, {
                length: 14,
                separator: ' ',
              })}
            </span>
          </div>
          {content.map((item, i: number) => (
            <ContentItem imgPath={item.imgPath} title={item.title} price={item.price} key={i} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CreatorContent;
