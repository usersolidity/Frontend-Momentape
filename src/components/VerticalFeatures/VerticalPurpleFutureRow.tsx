import className from 'classnames';
import { useRouter } from 'next/router';

type IVerticalPurpleFutureRow = {
  title: string;
  description: string;
  reverse?: boolean;
  images: [string];
};

const VerticalPurpleFutureRow: React.FunctionComponent<IVerticalPurpleFutureRow> = ({ title, description, reverse, images, children }) => {
  const verticalFeatureClass = className('mt-20', 'flex', 'flex-wrap', 'items-center', 'h-80', {
    'flex-row-reverse': reverse,
  });

  const router = useRouter();

  return (
    <div className={verticalFeatureClass}>
      <div className='w-full sm:w-1/2 text-center sm:px-6'>
        <h3 className='text-3xl text-gray-900 font-semibold'>{title}</h3>
        <div className='mt-6 text-xl leading-9 mb-3'>{description}</div>
        {children}
      </div>
      <div className='w-full sm:w-1/2 p-6 bg-main-100'>
        {images.map((image) => (
          <img src={`${router.basePath}/assets/images/${image}`} alt={image} />
        ))}
      </div>
    </div>
  );
};

export { VerticalPurpleFutureRow };
