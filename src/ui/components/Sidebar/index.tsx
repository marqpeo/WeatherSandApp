import { BaseSyntheticEvent, memo, useRef, useState } from 'react';
import DropdownSideBar from './dropdown';
import { methodGet } from '../../../api/methods';
import { getCityByName } from '../../../api/paths';
import { City, CityConvert } from '../../../models/City';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityForecast, modifyOrder } from '../../../redux/citiesState';
import { RootState } from '../../../redux/store';
import Geo from './geo';

const Sidebar = memo(() => {
  const [citiesSearch, setCitiesSearch] = useState<City[]>([]);
  const dragItem = useRef<number | null>();
  const dragOverItem = useRef<number | null>();


  let delayTimer: NodeJS.Timeout;

  // const router = useNavigate();
  const dispatch = useDispatch<any>();

  const handleOnInput = (event: BaseSyntheticEvent) => {
    const searchText: string = event.target.value;
    if (searchText.length > 2) {
      event.preventDefault();
      clearTimeout(delayTimer);
      delayTimer = setTimeout(async () => {
        const response = await methodGet(getCityByName(searchText));
        const cities = CityConvert.toCityArr(response.results);
        setCitiesSearch(cities);
        // console.log(event.target.value);

      }, 1000)
    } else if (citiesSearch.length > 0) {
      setCitiesSearch([]);
    }
  };

  const savedCities = useSelector<RootState, City[]>(state => state.cities.citiesCache?.filter(item => item.isSaved))

  const handleChooseCity = (city: City) => {
    setCitiesSearch([]);
    dispatch(
      fetchCityForecast(city)
    )
  }

  const handleDragStart = (e: any, index: number) => dragItem.current = index;

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragOverItem.current = index;
    console.log(e.currentTarget)
    e.currentTarget.className += ' border-2 border-red-400'
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.className = 'flex justify-between'
  }

  const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    const copyListItems = [...savedCities];
    const dragItemContent = copyListItems[dragItem.current!];
    copyListItems.splice(dragItem.current!, 1);
    copyListItems.splice(dragOverItem.current!, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    dispatch(modifyOrder(copyListItems))
  }


  return (
    <div className='hidden rounded-r-xl h-full w-1/5 flex-col bg-gray-50 py-4 px-7 lg:flex'>

      <div className='h-10 my-5 w-full relative'>
        <input
          placeholder='🔍 Search for a new city'
          className='w-full h-10 px-3 border-2 border-gray-400 rounded-sm transition-all duration-500 '
          onInput={handleOnInput}
        />
        {
          citiesSearch &&
          <ul
            className='child:transition-all child:duration-300
          child-hover:text-temp-deg child-hover:py-1 child:cursor-pointer first:hover:pt-0
          divide-y-2 divide-opacity-30 divide-black bg-white z-50 absolute left-0 top-10 min-w-full max-w-min'
          >
            {citiesSearch.map(item => (
              <li key={item.id} onClick={() => handleChooseCity(item)} className='px-1 flex flex-col'>
                <div>
                  <span className='text-2xl'>{item.name}, </span>
                  <span className='text-lg'>{item.country}</span>
                </div>
                <div>
                  {item.desc1 && <span className='text-lg'>{item.desc1}</span>}
                  {item.desc1 && item.desc2 && ', '}
                  {item.desc2 && <span className='text-lg'>{item.desc2}</span>}
                </div>
              </li>
            ))}
          </ul>
        }
      </div>

      <Geo />

      <DropdownSideBar openByDefault={true} label='Saved places' prefixIconName='star'>
        {
          (savedCities.length === 0) ?
            <span>You don't have any saved city</span>
            :
            <ul
              className='child:transition-all child:duration-300
            child-hover:text-red-400 child:cursor-pointer first:hover:pt-0
              '
              // divide-y-2 divide-opacity-30 divide-black
            >
              {savedCities.map((item, index) => (
                <li key={item.id}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={e => handleDragLeave(e)}
                  onDragEnd={handleDrop}
                  draggable='true'
                  onClick={() => handleChooseCity(item)}
                  className='flex justify-between'
                >
                  <div>
                    <span className='text-2xl'>{item.name}</span>
                    {item.country.length > 0 && <span className='text-xl'>, {item.country}</span>
                    }
                  </div>
                  <span className="material-symbols-outlined self-end">drag_indicator</span>
                </li>

              ))
              }
            </ul>
        }
      </DropdownSideBar>

      {/* <DropdownSideBar label='Настройки' prefixIconName='settings' >
        <></>
      </DropdownSideBar> */}
    </div>
  );
});
export default Sidebar;
