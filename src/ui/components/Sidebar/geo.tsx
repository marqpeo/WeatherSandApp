import { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchForecastGeo, toggleGeoPermission } from '../../../redux/citiesState';
import { RootState } from '../../../redux/store';

const Geo = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<any>();

  const permissionUseGeo = useSelector<RootState, boolean>(({ cities }) => cities.permissionUseGeo);

  const handleOnGeo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setLoading(true);
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        dispatch(toggleGeoPermission());
        dispatch(fetchForecastGeo(coords));
        setLoading(false);
      },
      (err) => {
        console.log({ err });
        dispatch(
          toggleGeoPermission(false)
        )
        setLoading(false);
      });
  };

  return (
    <div className='flex items-center justify-between h-14'>
      <span className='material-symbols-outlined'>near_me</span>
      <label className='text-xl leading-6 text-center'>Use geolocation</label>
      <div className='flex h-6 items-center'>
        <button
          type='button'
          className={`${permissionUseGeo ? 'bg-indigo-600' : 'bg-gray-200'} flex w-8 flex-none cursor-pointer rounded-full
                      ${loading ? 'justify-center' : ''}
                      p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                      `}
          role='switch'
          aria-checked='false'
          aria-labelledby='switch-1-label'
          onClick={handleOnGeo}
          disabled={loading}
        >
          {
            loading ?
              <div className='flex items-center justify-center child:w-5 child:h-5'>
                <span className='loader'></span>
              </div>
              :
              <span
                aria-hidden='true'
                className={`${permissionUseGeo ? 'translate-x-3.5' : 'translate-x-0'} h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out`}
              ></span>
          }
        </button>
      </div>
    </div>
  );
};

export default memo(Geo);
