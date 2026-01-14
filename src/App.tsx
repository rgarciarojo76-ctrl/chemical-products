import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainContent from './components/MainContent';
import Gatekeeper from './components/Gatekeeper';

function App() {
  return (
    <Gatekeeper>
      <Layout>
        <Header />
        <MainContent />
        <Footer />
      </Layout>
    </Gatekeeper>
  );
}

export default App;
