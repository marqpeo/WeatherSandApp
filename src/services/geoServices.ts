import { methodGet } from "../api/methods";
import { LanguageType } from "../models/locales";
import { IResponse, IGeocodingCity } from "../models/services";


export const getCityByNameService = (name: string, lang: LanguageType):Promise<IResponse<IGeocodingCity>> =>
  methodGet( `/geocoding?name=${name}&lang=${lang}`);
