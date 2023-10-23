import { Typography } from "@mui/material";
import { memo } from "react";
import { ICity } from "../../../models/City";
import { IAppState } from "../../../models/AppState";
import { useSelector } from "react-redux";
import CollapseList from "../CollapseList/CollapseList";
import { useTranslation } from "react-i18next";
import { StarBorder } from "@mui/icons-material";

interface ICitiesListProps {
  open: boolean;
  handleChooseCity: (city: ICity) => void;
}

const CitiesList = ({open, handleChooseCity}: ICitiesListProps) => {
  const { t } = useTranslation('sidebar');

  const savedCities = useSelector<IAppState, ICity[]>(state => state.cities.citiesCache.filter(item => item.isSaved))

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
            {savedCities.map((item, index) => (
              <li key={item.id}
                // onDragStart={(e) => handleDragStart(e, index)}
                // onDragOver={(e) => handleDragEnter(e, index)}
                // onDragEnter={(e) => handleDragEnter(e, index)}
                // onDragLeave={e => handleDragLeave(e)}
                // onDragEnd={handleDrop}
                // onTouchStart={(event) => handleTouchStart(event, index)}
                // onTouchMove={handleTouchMove}
                // onTouchEnd={handleTouchEnd}
                // draggable='true'
                onClick={() => handleChooseCity(item)}
                className='flex justify-between'
              >
                <div>
                  <span className='text-2xl'>{item.name}</span>
                  {item.country.length > 0 && <span className='text-xl'>, {item.country}</span>
                  }
                </div>
                {/* <ArrowUpward  /> */}
                {/* <span className="material-symbols-outlined self-end">drag_indicator</span> */}
              </li>

            ))
            }
          </ul>
        }
    </CollapseList>




      // <ListItem sx={{cursor:'pointer'}}  onClick={handleToddleSavedList}>
      //   <ListItemIcon> <StarBorder /> </ListItemIcon>
      //   <ListItemText primary={<Typography variant='h6'>{t('savedCities')}</Typography>} />
      //   {open ? <ExpandLess /> : <ExpandMore />}
      // </ListItem>
      // <Collapse in={open && savedCities.length>0} timeout="auto" unmountOnExit>
      //   {open &&
      //     (savedCities.length === 0) ?
      //     <Typography component='span'>You don't have any saved city</Typography>
      //     :
      //     <ul
      //       className='child:transition-all child:duration-300
      //         child-hover:text-red-400 child:cursor-pointer first:hover:pt-0'
      //     >
      //       {savedCities.map((item, index) => (
      //         <li key={item.id}
      //           // onDragStart={(e) => handleDragStart(e, index)}
      //           // onDragOver={(e) => handleDragEnter(e, index)}
      //           // onDragEnter={(e) => handleDragEnter(e, index)}
      //           // onDragLeave={e => handleDragLeave(e)}
      //           // onDragEnd={handleDrop}
      //           // onTouchStart={(event) => handleTouchStart(event, index)}
      //           // onTouchMove={handleTouchMove}
      //           // onTouchEnd={handleTouchEnd}
      //           // draggable='true'
      //           onClick={() => handleChooseCity(item)}
      //           className='flex justify-between'
      //         >
      //           <div>
      //             <span className='text-2xl'>{item.name}</span>
      //             {item.country.length > 0 && <span className='text-xl'>, {item.country}</span>
      //             }
      //           </div>
      //           <ArrowUpward  />
      //           <span className="material-symbols-outlined self-end">drag_indicator</span> 
      //         </li>

      //       ))
      //       }
      //     </ul>
      //   }
      // </Collapse>
  )
}

export default memo(CitiesList);

// const dragItem = useRef<number|null>();
// const dragOverItem = useRef<number|null>();

// const handleDragStart = (e: any, index: number) => dragItem.current = index;

// const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
//   dragOverItem.current = index;
//   e.currentTarget.className
//     += ` border-${ (index===0) ? 'b' :'t'}-2 border-red-400`;
// };

// const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
//   e.currentTarget.className = 'flex justify-between'
// }

// const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
//   e.preventDefault();
//   const copyListItems = [...savedCities];
//   const dragItemContent = copyListItems[dragItem.current!];
//   copyListItems.splice(dragItem.current!, 1);
//   copyListItems.splice(dragOverItem.current!, 0, dragItemContent);
//   dragItem.current = null;
//   dragOverItem.current = null;
//   dispatch(modifyOrder(copyListItems))
// }