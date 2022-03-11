import Footer from '../footer'
import Header from '../header'

const DefaultLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
)

export default DefaultLayout
