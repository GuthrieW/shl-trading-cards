import { Footer, Header } from '../index'

const DefaultLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
)

export default DefaultLayout
