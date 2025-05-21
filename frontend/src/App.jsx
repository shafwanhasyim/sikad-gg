import Layout from './components/Layout'
import RouteHandler from './components/RouteHandler'
import AppRouter from './router'
import './App.css'

function App() {
  return (
    <RouteHandler>
      <Layout>
        <AppRouter />
      </Layout>
    </RouteHandler>
  )
}

export default App
