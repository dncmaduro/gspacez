import { callApi } from '../utils/axios'
import { GetCountriesResponse } from './models'

export const useCountries = () => {
  const getCountries = () => {
    return callApi<never, GetCountriesResponse>({
      path: '/v0.1/countries/flag/images',
      method: 'GET',
      customUrl: 'https://countriesnow.space/api'
    })
  }

  return { getCountries }
}
