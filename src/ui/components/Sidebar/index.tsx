import { BaseSyntheticEvent, memo, useRef, useState } from 'react';
// import { methodGet } from '../../../api/methods';
import { ICity, CityConvert } from '../../../models/City';
import { useDispatch, useSelector } from 'react-redux';
import { modifyOrder } from '../../../redux/citiesState';
// import Geo from './geo';
import { Box, Collapse, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import { IAppState } from '../../../models/AppState';
import { getCityByName } from '../../../services/geoServices';
import { fetchCityWeather } from '../../../models/redux/actions/forecast';
import { toggleSavedList } from '../../../redux/core';

// interface ISideBarProps{
//   isMobile?: true;
// } 


const Sidebar = memo(() => {
  const [citiesSearch, setCitiesSearch] = useState<ICity[]>([]);
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
        console.log(event.target.value);
        const response = await getCityByName(searchText);        
        const cities = CityConvert.toCityArr(response.results);
        setCitiesSearch(cities);

      }, 1000)
    } else if (citiesSearch.length > 0) {
      setCitiesSearch([]);
    }
  };

  const savedCities = useSelector<IAppState, ICity[]>(state => state.cities.citiesCache?.filter(item => item.isSaved))

  const handleChooseCity = (city: ICity) => {
    setCitiesSearch([]);
    dispatch(fetchCityWeather(city))
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

  const savedListIsOpen = useSelector<IAppState, boolean>(state => state.core.savedListIsOpen);

  const handleClick = () => dispatch(toggleSavedList());


  return (
    <List component='nav'
    aria-labelledby="nested-list-subheader"
      sx={{height:'100%', py:2, px:3, backgroundColor:'#c7edff', display:'flex', flexDirection:'column', li:{p:0, width:'100%'}
    }}
    >

      <ListItem sx={{height:'10%', width:'100%', my:2, position:'relative', p:0}}>
        <Box
          component='input'
          placeholder='🔍 Search for a new city'
          sx={{ width:'100%', height:'60%', px:1, backgroundColor:'white', color:'black'}}
          // prefix=''
          onInput={handleOnInput}
          // className='w-full h-10 px-3 border-2 border-gray-400 rounded-sm transition-all duration-500 '
        />
        {
          citiesSearch.length > 0 &&
          <List
            className='scrollbar'
          // divide-y-2 divide-opacity-30 divide-black bg-white z-50 absolute left-0 top-10 min-w-full max-w-min'
          sx={{position:'absolute', left:0, top:'80%', width:'100%', maxHeight:'80vh', zIndex:1000, overflowY:'scroll'}}
          >
            {citiesSearch.map(item => (
              <ListItem key={item.id}
              onClick={() => handleChooseCity(item)}
              // className='px-1 flex flex-col'
              // className='duration-300'
              // child:transition-all child:duration-300 child-hover:text-temp-deg child-hover:py-1 child:cursor-pointer first:hover:pt-0
                sx={{ p:0,px:1, display:'flex', width:'100%', flexDirection:'column', cursor:'pointer', background:'white', alignItems:'start',
                  transition:'all', transitionDuration:'300ms', ':hover':{ py:1, color:'#0EA5E9' }
                }}
                >
                <div>
                  <Typography component='span' variant='h5'>{item.name}, </Typography>
                  <Typography component='span' variant='subtitle1'>{item.country}</Typography>
                </div>
                <div>
                  {item.desc1 && <Typography component='span' variant='subtitle1'>{item.desc1}</Typography>}
                  {item.desc1 && item.desc2 && ', '}
                  {item.desc2 && <Typography component='span' variant='subtitle1'>{item.desc2}</Typography>}
                </div>
              </ListItem>
            ))}
          </List>
        }
      </ListItem>
{/* 
      <ListItem>
        <Geo />
      </ListItem> */}

      <ListItem sx={{cursor:'pointer'}} onClick={handleClick}>
        <ListItemIcon> <StarBorder /> </ListItemIcon>
        <ListItemText primary={<Typography variant='h6'>Saved cities</Typography>} />
        {savedListIsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={savedListIsOpen} timeout="auto" unmountOnExit>
        {savedListIsOpen &&
          (savedCities.length === 0) ?
          <Typography component='span'>You don't have any saved city</Typography>
          :
          <ul
            className='child:transition-all child:duration-300
            child-hover:text-red-400 child:cursor-pointer first:hover:pt-0'
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
      </Collapse>
          {/* <List>
        <ListItemButton>
          <ListItemIcon> <DragIndicator /> </ListItemIcon>
          <ListItemText primary={label}/>
        </ListItemButton>
      </List> */}

      {/* <DropdownSideBar label='Настройки' prefixIconName='settings' >
        <></>
      </DropdownSideBar> */}
    </List>
  );
});
export default Sidebar;
