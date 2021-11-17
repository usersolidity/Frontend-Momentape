import styles from './CreatorContent.module.css';
import _ from 'lodash';
import { ButtonUI } from '../../components';
import { VariantType } from '../ButtonUI';
export type IContentItemProps = {
  imgPath: string;
  title: string;
  price: number;
};

const ContentItem: React.FunctionComponent<IContentItemProps> = ({ imgPath, title, price }) => {
  return (
    <div className='w-1/4 p-2'>
      <img src={imgPath} alt={title} style={{ width: '100%', height: '200px' }} className='object-cover' />
      <div className='bg-main-100 p-4'>
        <div className='flex justify-between mb-3'>
          <p className='text-white uppercase font-light'>{title}</p>
          <p className='text-white uppercase font-light'>{price}$</p>
        </div>
        <ButtonUI variant={VariantType.outlinedWhite} onClick={() => console.log('buy' + title)}>
          BUY NOW
        </ButtonUI>
      </div>
    </div>
  );
};

export default ContentItem;
