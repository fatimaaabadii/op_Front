import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const client = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            console.log('error 401');
        } if (error.response.status === 403) {
            console.log('error 403');
            deleteCookie('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

client.interceptors.request.use(
    (config) => {
        const token = getCookie('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const api = client;
export function getDeplacement() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/deplacements', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}

export function getArticles() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/article/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}






export async function getOperations() {
    try {
      const token = getCookie("token");
      
      const response = await api.get("/operations" ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     // console.log(response.data);
      return response.data;
      
    } catch (error) {
      console.log(error);
    }

}



export async function getDashboard() {
    try {
      const token = getCookie("token");
      
      const response = await api.get('/operations/pourcentages-par-delegation' ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     console.log(response.data);
      return response.data;
      
    } catch (error) {
      console.log(error);
    }

}





export async function getOperationsByDelegations(iddeleg) {
    try {
      const token = getCookie("token");
  
      // Utiliser la syntaxe de template string pour inclure `iddeleg` dans l'URL
      const response = await api.get(`/operations/delegation/${iddeleg}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
       console.log(response.data); // Décommentez cette ligne si vous voulez voir la réponse dans la console
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  



  export async function getStockByDelegations(iddeleg) {
    try {
      const token = getCookie("token");
  
      // Utiliser la syntaxe de template string pour inclure `iddeleg` dans l'URL
      const response = await api.get(`/stocks/delegation/${iddeleg}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // console.log(response.data); // Décommentez cette ligne si vous voulez voir la réponse dans la console
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  




export function getProduits() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/produits', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}





export function getBene() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/beneficiaire/getBenes', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}
function formatDateToLongDateString(timestamp) {
    const date = new Date(timestamp);
    const options = {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    // Formater la date en format long
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

export function getPartenariats() {
   
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/part/allpart', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        
        if (data && data.populationCible) {
            data.populationCible = JSON.parse(data.populationCible);
        }
        if (data && data.domaine) {
            data.domaine = JSON.parse(data.domaine);
        }
       
        if (data && data.typeCentre) {
            data.typeCentre = JSON.parse(data.typeCentre);
        }
       // console.log(data);
        return data;
    };
}
export function getEtablissements() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/eta/getBenes', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}




export function getEmployees() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/employee/getEmployees', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}
export function getUsers() {
    return async () => {

        const token = getCookie('token');
        const { data } = await api.get('/auth/getUsers', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}
export function getPartenaires() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/partenaire/getPartenaires', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}


export function getDelegations() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/delegation/getDelegations', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}
const tokenPayload = async () => {
    const token = await getCookie('token');
    if (!token) return null;
    const payload = token?.split('.')[1];
    const decodedPayload = await atob(payload);
    const tokenPay = JSON.parse(decodedPayload);
    return tokenPay?.sub;
}
export function getCurrentUser() {
    return async () => {
        const email = await tokenPayload();
        if (!email) return null;
        const token = getCookie('token');
        const { data } = await api.get('/auth/email/' + email, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}

