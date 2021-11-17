import styles from './CreatorContent.module.css';

type ICreatorContentProps = {
  imgPath: string;
};

const CreatorContent: React.FunctionComponent<ICreatorContentProps> = ({ imgPath }) => {
  return <div className={styles.cover} style={{ backgroundImage: `url(${imgPath})` }}></div>;
};

export default CreatorContent;
