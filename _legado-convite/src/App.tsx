import { Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Planos from '@/pages/Planos'
import ComoFunciona from '@/pages/ComoFunciona'
import Acompanhar from '@/pages/Acompanhar'
import Regulamento from '@/pages/Regulamento'
import FaleConosco from '@/pages/FaleConosco'

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Invite page: full-viewport funnel, NO Navbar/Footer */}
        <Route path="/" element={<Home />} />
        <Route path="/convite/48647f6cd511d0f" element={<Home />} />

        {/* Inner pages wrapped in shared Layout (children pattern) */}
        <Route path="/planos" element={<Layout><Planos /></Layout>} />
        <Route path="/como-funciona" element={<Layout><ComoFunciona /></Layout>} />
        <Route path="/acompanhar" element={<Layout><Acompanhar /></Layout>} />
        <Route path="/regulamento" element={<Layout><Regulamento /></Layout>} />
        <Route path="/fale-conosco" element={<Layout><FaleConosco /></Layout>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}
