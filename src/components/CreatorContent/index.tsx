import styles from './CreatorContent.module.css';
import _ from 'lodash';

type ICreatorContentProps = {
  imgPath: {
    profile: string;
    cover: string;
  };
  name: string;
  ethAddress: string;
};

const CreatorContent: React.FunctionComponent<ICreatorContentProps> = ({ imgPath, name, ethAddress }) => {
  return (
    <div>
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
        </div>
      </div>
    </div>
  );
};

export default CreatorContent;
