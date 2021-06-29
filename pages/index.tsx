import Loading from '@components/loading'
import useAuthentication from '@hooks/use-authentication'

const index = (props) => {
  const [isLoading, username, userGroups] = useAuthentication() as [
    boolean,
    string,
    Array<Number>
  ]

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <h1>DONE LOADING</h1>
      <p>Username: {username}</p>
      <p>User Groups: {userGroups}</p>
    </>
  )
}

export default index
