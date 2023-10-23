import { methodGet } from "../api/methods";


export const getCityByName = (name: string) => methodGet( `/geocoding?name=${name}`);
