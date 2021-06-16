import axios from 'axios'
import { useEffect, useState } from 'react'

const useAuthentication = () => {
  const [isLoading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [userGroups, setUserGroups] = useState([])

  useEffect(() => {
    const authenticate = async () => {
      const url =
        process.env.NODE_ENV === 'production'
          ? 'https://simulationhockey.com/userinfo.php'
          : 'https://dev.simulationhockey.com/userinfo.php'

      const result = {
        data: {
          userid: 2856,
          username: 'caltroit_red_flames',
          usergroups: [33, 125, 157],
        },
      }

      // const result = await axios({
      //   method: 'GET',
      //   url: url,
      // })

      setUsername(result.data.username)
      setUserGroups(result.data.usergroups)
      setLoading(false)
    }

    authenticate()
  }, [])

  return [isLoading, username, userGroups]
}

export default useAuthentication
