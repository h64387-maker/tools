import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { HomeDemoPage } from './pages/HomeDemoPages'
import { NotFoundPage } from './pages/NotFoundPage'
import { ToolPlaceholderPage } from './pages/ToolPlaceholderPage'

function App() {
  return (
    <Routes>
      <Route path="demos/home-1" element={<HomeDemoPage variant="command" />} />
      <Route path="demos/home-2" element={<HomeDemoPage variant="ops" />} />
      <Route path="demos/home-3" element={<HomeDemoPage variant="personal" />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tools/:slug" element={<ToolPlaceholderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
