import { Typography } from "@mui/material";
import { memo } from "react";
import { ICity, ICityDescLocalized } from "../../../models/City";
import { IAppState } from "../../../models/AppState";
import { useDispatch, useSelector } from "react-redux";
import CollapseList from "../CollapseList/CollapseList";
import { useTranslation } from "react-i18next";
import { StarBorder } from "@mui/icons-material";
import { LanguageType } from "../../../models/locales";
import { fetchCityWeather } from "../../../models/redux/actions/forecast";

interface ICitiesListProps {
  open: boolean;
  // handleChooseCity: (city: ICity) => void;
}

const CitiesList = ({open}: ICitiesListProps) => {
  const { t } = useTranslation('sidebar');

  const dispatch = useDispatch();

  const savedCities = useSelector<IAppState, ICity[]>(state => state.cities.citiesCache.filter(item => item.isSaved));
  const lang = useSelector<IAppState, LanguageType>(state => state.core.language);

  const handleChooseCity = (city:ICity) =>{
    // setCitiesSearch([]);
    dispatch(fetchCityWeather(city))
  }
  

  return (
    <CollapseList
      label={t('savedCities')}
      icon={<StarBorder/>}
      openByDefault={open}
      >
      {open &&
          (savedCities.length === 0) ?
          <Typography component='span'>{t('noSavedCities')}</Typography>
          :
          <ul
            className='child:transition-all child:duration-300
              child-hover:text-red-400 child:cursor-pointer first:hover:pt-0'
          >
            {savedCities.map(item => {
              const desc = item[lang] as ICityDescLocalized;
              // console.log({item, desc, lang});
              
              
              return desc !== undefined && (
                <li key={item.id}
                  onClick={() => handleChooseCity(item)}
                  className='flex justify-between'
                >
                  <div>
                    <span className='text-2xl'>{desc?.name}</span>
                    {desc?.country?.length > 0 && <span className='text-xl'>, {desc?.country}</span>}
                  </div>
                  {/* <ArrowUpward  /> */}
                  {/* <span className="material-symbols-outlined self-end">drag_indicator</span> */}
                </li>
  
              )
            })
            }
          </ul>
        }
    </CollapseList>
  )
}

export default memo(CitiesList);
