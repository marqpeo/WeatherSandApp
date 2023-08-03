import { Grid, ListItemButton, ListItemText } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import CollapseList from '../CollapseList/CollapseList';
import { Language } from '@mui/icons-material';
import { changeCurrentLanguage } from '../../../models/redux/actions/core';
import { useDispatch } from 'react-redux';
import { LanguageType } from '../../../models/locales';


const LangSelector = () => {
  const { t, i18n } = useTranslation('sidebar');
  const dispatch = useDispatch();
  const handleChangeLang = (newLang: LanguageType) => {
    i18n.changeLanguage(newLang);
    dispatch(changeCurrentLanguage(newLang));
  }
  
  const supportedLngs = i18n.options.resources ? Object.keys(i18n.options.resources) : [];
  
  return (
    <CollapseList label={t('changeLang')} icon={<Language/>}>
      <Grid>
        {
          supportedLngs.map((lang) => 
            <ListItemButton key={lang} onClick={() => handleChangeLang(lang as LanguageType)}>
              <ListItemText primary={t(lang)}/>
            </ListItemButton>
            )
        }
      </Grid>
    </CollapseList>
    )
  }
  
export default memo(LangSelector);