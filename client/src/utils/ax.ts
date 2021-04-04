import axios, { AxiosInstance } from 'axios';
import Ajv from 'ajv/dist/jtd';
import { isDev } from './isDev';

type AjvParamType = 'boolean' | 'string' | 'datetime' | 'float32' | 'float64' | 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32';
type AjvProperties = {[key: string]: {type: AjvParamType}};

interface AxParams {
  setLoading?: (isLoading: boolean) => void,
  schema?: {[key: string]: AjvParamType},
}

const baseURL = process.env.REACT_APP_BASE_URL;
const ajv = new Ajv();

const memoizedAx = () => {
  let cachedClients: {[key: string]: AxiosInstance} = {};
  let jwtToken: string | null = null;

  const ax = ({ setLoading, schema }: AxParams = {}): AxiosInstance => {
    // check cached axios
    if (!setLoading && !schema && cachedClients[jwtToken || '']) {
      return cachedClients[jwtToken || ''];
    }

    const client = axios.create({
      baseURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwtToken ? `Bearer ${jwtToken}` : undefined,
      },
    });

    if (setLoading) {
      client.interceptors.request.use(
        (config) => {
          setLoading(true);
          return config;
        },
        (error) => Promise.reject(error),
      );
      client.interceptors.response.use(
        (response) => {
          setLoading(false);
          return response;
        },
        (error) => {
          setLoading(false);
          return Promise.reject(error);
        },
      );
    }

    // валидация ответа схемой через ajv
    if (schema) {
      client.interceptors.response.use(async (response) => {
        const properties: AjvProperties = {};
        for (const [key, type] of Object.entries(schema)) {
          properties[key] = { type };
        }
        const ajvSchema = { properties, additionalProperties: true };
        const validate = ajv.compile(ajvSchema);
        if (validate) {
          const isValid = await validate(response.data);
          if (!isValid) {
            const { errors } = validate;
            isDev() && console.error(errors?.map(e => e.message)); // next: send to sentry.io
            return new Promise(() => {});
          }
        }
        return response;
      });
    }

    // cache axios client
    if (!setLoading && !schema) {
      cachedClients[jwtToken || ''] = client;
    }

    return client;
  };

  const setJwtToken = (token: string | null) => {
    jwtToken = token;
  };

  return { ax, setJwtToken };
};

const { ax, setJwtToken } = memoizedAx();

export {
  ax,
  setJwtToken,
};
