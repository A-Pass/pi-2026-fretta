'use client'

import { useState } from 'react'
import './style.css'

export default function DashboardPrestador() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [services] = useState([
    { id: 1, title: 'Limpeza residencial', location: 'Centro', price: 'R$ 120' },
    { id: 2, title: 'Faxina pós-obra', location: 'Zona Sul', price: 'R$ 300' },
  ])

  return (
    <div className="min-h-screen bg-white pt-20 pb-24">

      {/* TOP MENU */}
      <header className="fixed top-0 left-0 right-0 z-20 h-20 bg-blue-600 rounded-b-3xl flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-3 text-white">
          <img
            src="/profile.jpg"
            alt="Perfil"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">João Silva</span>
        </div>

        <button
          onClick={() => setShowNotifications(true)}
          className="w-11 h-11 bg-white text-blue-600 rounded-full shadow-lg flex items-center justify-center text-xl"
        >
          🔔
        </button>
      </header>

      {/* MODAL NOTIFICAÇÕES */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="bg-white w-[85%] max-w-sm rounded-xl p-5"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-semibold mb-3">Notificações</h3>
            <ul className="space-y-2 text-sm">
              <li>Novo serviço disponível</li>
              <li>Cliente confirmou horário</li>
            </ul>
          </div>
        </div>
      )}

      {/* CONTEÚDO */}
      <main className="px-4 space-y-4">
        <input
          type="text"
          placeholder="Buscar serviços..."
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 text-sm">
            Hoje
          </button>
          <button className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 text-sm">
            Esta semana
          </button>
          <button className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 text-sm">
            Próximo
          </button>
        </div>

        <div className="space-y-3">
          {services.length === 0 ? (
            <p className="text-center text-gray-500 mt-16">
              Nenhum serviço encontrado
            </p>
          ) : (
            services.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-4 shadow-md"
              >
                <h4 className="font-semibold">{service.title}</h4>
                <p className="text-sm text-gray-500">{service.location}</p>
                <span className="text-blue-600 font-medium">
                  {service.price}
                </span>
              </div>
            ))
          )}
        </div>
      </main>

      {/* BOTTOM MENU */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 h-20 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.15)] flex items-center justify-around">
        <button className="text-sm">Explorar</button>
        <button className="text-sm">Agenda</button>

        <button className="absolute -top-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-2xl">
          💬
        </button>

        <button className="text-sm">Perfil</button>
        <button className="text-sm">Config</button>
      </footer>
    </div>
  )
}
