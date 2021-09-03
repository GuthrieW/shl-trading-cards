import axios from 'axios'

const client = axios.create()
// const IS_SERVER = typeof window === 'undefined'

const request = ({ ...options }) => {
  const onSuccess = (response) => response
  const onError = (error) => {
    return error
  }

  return client(options).then(onSuccess).catch(onError)
}

export default request
