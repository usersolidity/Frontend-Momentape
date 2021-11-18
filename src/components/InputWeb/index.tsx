import * as React from 'react';
export interface IInputProps {
  onChange: any;
  value: any;
  label: string;
}
const Input: React.FunctionComponent<IInputProps> = ({ onChange, value, label }) => {
  return (
    <div className='col-span-3 sm:col-span-2 mt-2'>
      <label htmlFor='company-website' className='block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <div className='mt-1 flex rounded-md shadow-sm'>
        <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>http://</span>
        <input
          onChange={(e: any) => onChange(e.target.value)}
          value={value}
          type='text'
          name='company-website'
          id='company-website'
          className='focus:ring-main-100 focus:border-main-100 flex-1 block w-full rounded-none rounded-r-md sm:text-sm  border border-gray-300 p-3'
          placeholder='www.example.com'
        />
      </div>
    </div>
  );
};

export default Input;
