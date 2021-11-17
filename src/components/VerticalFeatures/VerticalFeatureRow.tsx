import className from 'classnames';
import { useRouter } from 'next/router';

type IVerticalFeatureRowProps = {
  title: string;
  description: string;
  image: {
    path: string;
    alt: string;
  };
  reverse?: boolean;
};

const VerticalFeatureRow: React.FunctionComponent<IVerticalFeatureRowProps> = ({ title, description, image, reverse, children }) => {
  const verticalFeatureClass = className('mt-20', 'flex', 'flex-wrap', 'items-center', {
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

      <div className='w-full sm:w-1/2 p-6'>
        <img src={`${router.basePath}/assets/images/${image.path}`} alt={image.alt} />
      </div>
    </div>
  );
};

export { VerticalFeatureRow };
