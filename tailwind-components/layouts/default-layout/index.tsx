import Footer from '../footer'
import Header from '../header'

const DefaultLayout = ({ children }) => (
  <div className="h-full w-full">
    <Header />
    {children}
    <Footer />
  </div>
)

export default DefaultLayout
