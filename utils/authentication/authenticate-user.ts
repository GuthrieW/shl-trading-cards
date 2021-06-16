import axios from 'axios'

const authenticateUser = async () => {
  const url =
    process.env.NODE_ENV === 'production'
      ? 'https://simulationhockey.com/userinfo.php'
      : 'https://dev.simulationhockey.com/userinfo.php'

  const result = await axios({
    method: 'GET',
    url: url,
  })

  return result
}

export default authenticateUser
