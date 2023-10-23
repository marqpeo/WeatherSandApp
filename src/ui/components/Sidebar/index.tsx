import { BaseSyntheticEvent, memo, useRef, useState } from 'react';
// import { methodGet } from '../../../api/methods';
import { ICity, CityConvert, ICityDescLocalized, ICitySearchResponse } from '../../../models/City';
import { useDispatch, useSelector } from 'react-redux';
import { onModifyOrder } from '../../../redux/citiesState';
// import Geo from './geo';
import { Box, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import { IAppState } from '../../../models/AppState';
import { getCityByNameService } from '../../../services/geoServices';
import { fetchCityWeather } from '../../../models/redux/actions/forecast';
import { onToggleSavedList } from '../../../redux/core';
import { useTranslation } from 'react-i18next';
import LangSelector from './LangSelector';
import CitiesList from './CitiesList';
import { LanguageType } from '../../../models/locales';


const Sidebar = memo(() => {
  const [citiesSearch, setCitiesSearch] = useState<ICitySearchResponse[]>([]);

  const { t, i18n } = useTranslation('sidebar');
  const currentLang = i18n.language as LanguageType;

  let delayTimer: NodeJS.Timeout;

  const dispatch = useDispatch<any>();

  const handleOnInput = (event: BaseSyntheticEvent) => {
    const searchText: string = event.target.value;
    if (searchText.length > 2) {
      event.preventDefault();
      clearTimeout(delayTimer);
      delayTimer = setTimeout(async () => {
        const response = await getCityByNameService(searchText, currentLang);        
        const cities = CityConvert.toCityArr(response.results);
        setCitiesSearch(cities);

      }, 1000)
    } else if (citiesSearch.length > 0) {
      setCitiesSearch([]);
    }
  };

  const handleChooseCity = (city: ICitySearchResponse) => {
    setCitiesSearch([]);
    dispatch(fetchCityWeather(city))
  }

  const savedListIsOpen = useSelector<IAppState, boolean>(state => state.core.savedListIsOpen);

  const handleToddleSavedList = () => dispatch(onToggleSavedList());

  return (
    <List component='nav'
    aria-labelledby="nested-list-subheader"
      sx={{height:'100%', py:2, px:3, backgroundColor:'#c7edff', display:'flex', flexDirection:'column', li:{p:0, width:'100%'}
    }}
    >

      <ListItem sx={{height:'10%', width:'100%', my:2, position:'relative', p:0}}>
        {/* <Tooltip sx={{fontSize:'1.5rem'}} title={t('onlyEnglish')}
          enterTouchDelay={0} leaveTouchDelay={5000}
          enterDelay={0} leaveDelay={1000}
          >
            </Tooltip> */}
        <Box
          component='input'
          placeholder={`🔍 ${t('citySearchPlaceholder')}`}
          sx={{ width:'100%', height:'60%', px:1, backgroundColor:'white', color:'black'}}
          onInput={handleOnInput}
          />
        {
          citiesSearch.length > 0 &&
          <List
            className='scrollbar'
          sx={{position:'absolute', left:0, top:'80%', width:'100%', maxHeight:'80vh', zIndex:1000, overflowY:'scroll'}}
          >
            {citiesSearch.map(item => {
              // const textContent = currentLang!=='dev' ? item[currentLang] : undefined;
              // console.log({item, textContent});
              
              return (
                <ListItem key={item.id}
                onClick={() => handleChooseCity(item)}
                  sx={{ p:0,px:1, display:'flex', width:'100%', flexDirection:'column', cursor:'pointer', background:'white', alignItems:'start',
                    transition:'all', transitionDuration:'300ms', ':hover':{ py:1, color:'#0EA5E9' }
                  }}
                  >
                  <div>
                    <Typography component='span' variant='h5'>{item!.name}, </Typography>
                    <Typography component='span' variant='subtitle1'>{item!.country}</Typography>
                  </div>
                  <div>
                    {item!.desc1 && <Typography component='span' variant='subtitle1'>{item!.desc1}</Typography>}
                    {item!.desc1 && item!.desc2 && ', '}
                    {item!.desc2 && <Typography component='span' variant='subtitle1'>{item!.desc2}</Typography>}
                  </div>
                </ListItem>
              )
            })}
          </List>
        }
      </ListItem>
      {/*<ListItem>
        <Geo />
      </ListItem> */}

      <CitiesList open={savedListIsOpen} />
      
      <LangSelector/>
      
    </List>
  );
});
export default Sidebar;
