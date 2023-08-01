import { enResource } from "./en";
import { esResource } from "./es";
import { ruResource } from "./ru";


const resources = {
  en: enResource,
  es:{
    translation: esResource
  },
  ru:{
    translation: ruResource
  }
};

export default resources;