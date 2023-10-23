// REMOVE BEFORE COMMIT 
const _baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL
      : process.env.REACT_APP_API_URL_DEV

export const methodGet = async (url: string,query?:object) => {
  try {    
    const _url = new URL(`/api${url}`, _baseUrl);
    
    const response = await fetch(_url)
    
    if (response.status === 200 || response.status === 201) {
      return await response.json();
    }
  } catch (error) {
    console.log('Error in method GET : \n  ',error); 
  }
};
