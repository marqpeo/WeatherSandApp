import { memo, useState } from 'react';

const Geo = () => {
  const [geoPermission, setGeo] = useState(false);

  // const handleOnGeo: MouseEventHandler<HTMLButtonElement> = (e) => {
  //   e.preventDefault();
  //   setGeo(prev => !prev);
  //   navigator.geolocation.getCurrentPosition(success, (err) => {
  //     console.log({err});
  //     setGeo(false);
  //   });

  // };


  return (
    <div className='flex items-center justify-between h-14'>
      <span className='material-symbols-outlined'>near_me</span>
      <label className='text-xl leading-6 text-center'>Геопозиция</label>
      <div className='flex h-6 items-center'>
        <button
          type='button'
          className={`${geoPermission ? 'bg-indigo-600' : 'bg-gray-200'} flex w-8 flex-none cursor-pointer rounded-full
                      p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                      `}
          role='switch'
          aria-checked='false'
          aria-labelledby='switch-1-label'
          // onClick={handleOnGeo}
        >
          <span
            aria-hidden='true'
            className={`${geoPermission ? 'translate-x-3.5' : 'translate-x-0'} h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out`}
          ></span>
        </button>
      </div>
    </div>
  );
};

export default memo(Geo);
