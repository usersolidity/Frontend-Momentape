import styles from './CreatorContent.module.css';
import _ from 'lodash';

export type IContentItemProps = {
  imgPath: string;
  title: string;
  price: number;
};

const ContentItem: React.FunctionComponent<IContentItemProps> = ({ imgPath, title, price }) => {
  return <div>{title}</div>;
};

export default ContentItem;
