import { methodGet } from "../api/methods";


export const getCityByName = (name: string) => methodGet( `api/geocoding?name=${name}`);
