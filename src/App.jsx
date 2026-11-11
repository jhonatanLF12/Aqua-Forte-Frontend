import React, { useState, useEffect } from 'react';
import { Product3DViewer } from './components/Product3DViewer';
import { 
  Package, PlusCircle, RefreshCw, CheckCircle2, AlertCircle, 
  ExternalLink, Layers, DollarSign, Image, Box, Sparkles,
  Users, Truck, UserCheck, Search, Calendar, Clock, Droplets, MapPin, Phone
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api-productos-4ozt.onrender.com';

export default function App() {
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' | 'clientes' | 'entregas' | 'usuarios'
  const [feedback, setFeedback] = useState(null);

  // Estados de datos
  const [products, setProducts] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Formularios
  const [productForm, setProductForm] = useState({ name: '', price: '', stock: '', image_url: '' });
  
  const [clienteForm, setClienteForm] = useState({
    idcliente: '',
    nombre: '',
    telefono: '',
    direccion: '',
    zona: '',
    tipocliente: 'Particular'
  });

  const [entregaForm, setEntregaForm] = useState({
    identrega: '',
    idcliente: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '10:00',
    litrosentregados: '',
    monto: '',
    estadopago: 'Pendiente',
    tipoentrega: 'Turril'
  });

  const [usuarioForm, setUsuarioForm] = useState({
    idusuario: '',
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    rol: 'Operador'
  });

  // Carga general de datos desde la API
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resProd, resCli, resEnt, resUsu] = await Promise.all([
        fetch(`${API_BASE}/api/v1/products`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/v1/clientes`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/v1/entregas`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/v1/usuarios`).then(r => r.ok ? r.json() : [])
      ]);

      setProducts(resProd);
      setClientes(resCli);
      setEntregas(resEnt);
      setUsuarios(resUsu);

      if (resProd.length > 0 && !selectedProduct) {
        setSelectedProduct(resProd[resProd.length - 1]);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: `Error conectando con la API: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handlers para crear registros
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name.trim(),
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock) || 0,
          image_url: productForm.image_url.trim() || null
        })
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Error al guardar');
      const data = await res.json();
      setFeedback({ type: 'success', message: `Producto "${data.name}" guardado en Supabase.` });
      setProductForm({ name: '', price: '', stock: '', image_url: '' });
      setSelectedProduct(data);
      fetchAllData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCliente = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteForm)
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Error al registrar cliente');
      const data = await res.json();
      setFeedback({ type: 'success', message: `Cliente "${data.nombre}" registrado exitosamente.` });
      setClienteForm({ idcliente: '', nombre: '', telefono: '', direccion: '', zona: '', tipocliente: 'Particular' });
      fetchAllData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateEntrega = async (e) => {
    e.preventDefault();
    if (!entregaForm.idcliente) {
      setFeedback({ type: 'error', message: 'Debe seleccionar un cliente para la entrega.' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/entregas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entregaForm,
          litrosentregados: parseFloat(entregaForm.litrosentregados),
          monto: parseFloat(entregaForm.monto)
        })
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Error al registrar entrega');
      const data = await res.json();
      setFeedback({ type: 'success', message: `Entrega #${data.identrega} registrada con éxito.` });
      setEntregaForm({
        identrega: '',
        idcliente: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: '10:00',
        litrosentregados: '',
        monto: '',
        estadopago: 'Pendiente',
        tipoentrega: 'Turril'
      });
      fetchAllData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateUsuario = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioForm)
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Error al crear usuario');
      const data = await res.json();
      setFeedback({ type: 'success', message: `Usuario "${data.nombre} ${data.apellido}" creado con éxito.` });
      setUsuarioForm({ idusuario: '', nombre: '', apellido: '', correo: '', contraseña: '', rol: 'Operador' });
      fetchAllData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-blue-300 bg-clip-text text-transparent">
                Aqua-Forte
              </h1>
              <p className="text-xs text-slate-400">Distribución de Agua Purificada & Sistema de Gestión</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              API Render: Online
            </span>

            <a
              href={`${API_BASE}/docs`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
            >
              <span>Swagger API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Barra de Pestañas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 border-t border-slate-800/60 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('productos')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'productos' 
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Simulador 3D Cisterna & Catálogo</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('clientes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'clientes' 
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Clientes</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60">{clientes.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('entregas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'entregas' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Entregas de Agua</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60">{entregas.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'usuarios' 
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Usuarios & Operadores</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60">{usuarios.length}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Banner Feedback */}
        {feedback && (
          <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-lg ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            )}
            <span className="text-sm font-medium flex-1">{feedback.message}</span>
            <button 
              onClick={() => setFeedback(null)} 
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* 1. PESTAÑA PRODUCTOS & VISOR 3D */}
        {activeTab === 'productos' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Formulario Producto */}
              <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                  <PlusCircle className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-semibold text-white">Registrar Producto (Catálogo)</h2>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Producto *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Ej. Botellón 20 Litros"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Precio ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="15.00"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        placeholder="50"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">URL de Imagen (Opcional)</label>
                    <input
                      type="url"
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Guardar Producto</span>
                  </button>
                </form>
              </div>

              {/* Visor 3D */}
              <div className="lg:col-span-7 space-y-4">
                <Product3DViewer productName={selectedProduct ? selectedProduct.name : "Aqua-Forte 3D"} />
                {selectedProduct && (
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-xs text-slate-400 block">Inspeccionando en 3D:</span>
                      <span className="font-semibold text-white">{selectedProduct.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Precio:</span>
                      <span className="text-indigo-400 font-bold text-base">${Number(selectedProduct.price).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Catálogo de Productos ({products.length})
                </h3>
                <button
                  onClick={fetchAllData}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-slate-900/70 border rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-indigo-500/50 ${
                      selectedProduct?.id === p.id ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="h-36 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden mb-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Box className="w-10 h-10 text-slate-700" />
                        )}
                      </div>
                      <h4 className="font-semibold text-white truncate">{p.name}</h4>
                      <p className="text-lg font-bold text-indigo-400 mt-1">${Number(p.price).toFixed(2)}</p>
                      <p className="text-xs text-slate-400">Stock: {p.stock} unidades</p>
                    </div>

                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="mt-3 w-full py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Ver en 3D</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. PESTAÑA CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Formulario Cliente */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Nuevo Cliente
              </h2>

              <form onSubmit={handleCreateCliente} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ID Cliente *</label>
                  <input
                    type="text"
                    value={clienteForm.idcliente}
                    onChange={(e) => setClienteForm({ ...clienteForm, idcliente: e.target.value })}
                    placeholder="Ej. CLI-005"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Completo o Empresa *</label>
                  <input
                    type="text"
                    value={clienteForm.nombre}
                    onChange={(e) => setClienteForm({ ...clienteForm, nombre: e.target.value })}
                    placeholder="Ej. Residencia San Juan"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={clienteForm.telefono}
                      onChange={(e) => setClienteForm({ ...clienteForm, telefono: e.target.value })}
                      placeholder="78901234"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Zona</label>
                    <input
                      type="text"
                      value={clienteForm.zona}
                      onChange={(e) => setClienteForm({ ...clienteForm, zona: e.target.value })}
                      placeholder="Norte / Sur"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={clienteForm.direccion}
                    onChange={(e) => setClienteForm({ ...clienteForm, direccion: e.target.value })}
                    placeholder="Calle 12 y Av. Principal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tipo de Cliente</label>
                  <select
                    value={clienteForm.tipocliente}
                    onChange={(e) => setClienteForm({ ...clienteForm, tipocliente: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    <option value="Particular">Particular</option>
                    <option value="Empresa">Empresa</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  <span>Registrar Cliente</span>
                </button>
              </form>
            </div>

            {/* Tabla de Clientes */}
            <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Listado de Clientes Registrados ({clientes.length})</h3>
                <button
                  onClick={fetchAllData}
                  className="px-3 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Recargar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Nombre</th>
                      <th className="py-3 px-3">Teléfono</th>
                      <th className="py-3 px-3">Dirección / Zona</th>
                      <th className="py-3 px-3">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {clientes.map((c) => (
                      <tr key={c.idcliente} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-cyan-400">{c.idcliente}</td>
                        <td className="py-3 px-3 font-semibold text-white">{c.nombre}</td>
                        <td className="py-3 px-3 text-slate-400">{c.telefono || '-'}</td>
                        <td className="py-3 px-3">
                          <span className="block truncate max-w-[200px]">{c.direccion || '-'}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{c.zona}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            c.tipocliente === 'Empresa' ? 'bg-purple-950 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {c.tipocliente}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. PESTAÑA ENTREGAS */}
        {activeTab === 'entregas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Formulario Entrega */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                Registrar Entrega de Agua
              </h2>

              <form onSubmit={handleCreateEntrega} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">ID Entrega *</label>
                    <input
                      type="text"
                      value={entregaForm.identrega}
                      onChange={(e) => setEntregaForm({ ...entregaForm, identrega: e.target.value })}
                      placeholder="ENT-005"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Cliente Destino *</label>
                    <select
                      value={entregaForm.idcliente}
                      onChange={(e) => setEntregaForm({ ...entregaForm, idcliente: e.target.value })}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="">Seleccione cliente...</option>
                      {clientes.map(c => (
                        <option key={c.idcliente} value={c.idcliente}>{c.idcliente} - {c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Fecha *</label>
                    <input
                      type="date"
                      value={entregaForm.fecha}
                      onChange={(e) => setEntregaForm({ ...entregaForm, fecha: e.target.value })}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Hora *</label>
                    <input
                      type="time"
                      value={entregaForm.hora}
                      onChange={(e) => setEntregaForm({ ...entregaForm, hora: e.target.value })}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Litros Entregados *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={entregaForm.litrosentregados}
                      onChange={(e) => setEntregaForm({ ...entregaForm, litrosentregados: e.target.value })}
                      placeholder="1000.00"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Monto ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={entregaForm.monto}
                      onChange={(e) => setEntregaForm({ ...entregaForm, monto: e.target.value })}
                      placeholder="120.00"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Tipo de Entrega</label>
                    <select
                      value={entregaForm.tipoentrega}
                      onChange={(e) => setEntregaForm({ ...entregaForm, tipoentrega: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="Turril">Turril</option>
                      <option value="Tanque">Tanque</option>
                      <option value="Cisterna">Cisterna</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Estado de Pago</label>
                    <select
                      value={entregaForm.estadopago}
                      onChange={(e) => setEntregaForm({ ...entregaForm, estadopago: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="Pagado">Pagado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Parcial">Parcial</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  <span>Registrar Entrega</span>
                </button>
              </form>
            </div>

            {/* Tabla de Entregas */}
            <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Historial de Entregas ({entregas.length})</h3>
                <button
                  onClick={fetchAllData}
                  className="px-3 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Recargar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Cliente</th>
                      <th className="py-3 px-3">Fecha / Hora</th>
                      <th className="py-3 px-3">Litros</th>
                      <th className="py-3 px-3">Monto</th>
                      <th className="py-3 px-3">Tipo</th>
                      <th className="py-3 px-3">Pago</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {entregas.map((ent) => (
                      <tr key={ent.identrega} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-blue-400">{ent.identrega}</td>
                        <td className="py-3 px-3 font-mono text-cyan-300">{ent.idcliente}</td>
                        <td className="py-3 px-3 text-slate-400">{ent.fecha} {ent.hora}</td>
                        <td className="py-3 px-3 font-semibold text-white">{ent.litrosentregados} L</td>
                        <td className="py-3 px-3 font-bold text-emerald-400">${Number(ent.monto).toFixed(2)}</td>
                        <td className="py-3 px-3 text-slate-300">{ent.tipoentrega}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            ent.estadopago === 'Pagado'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}>
                            {ent.estadopago}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. PESTAÑA USUARIOS */}
        {activeTab === 'usuarios' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Formulario Usuario */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-violet-400" />
                Registrar Operador
              </h2>

              <form onSubmit={handleCreateUsuario} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ID Usuario *</label>
                  <input
                    type="text"
                    value={usuarioForm.idusuario}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, idusuario: e.target.value })}
                    placeholder="USR-003"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={usuarioForm.nombre}
                      onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
                      placeholder="Carlos"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Apellido *</label>
                    <input
                      type="text"
                      value={usuarioForm.apellido}
                      onChange={(e) => setUsuarioForm({ ...usuarioForm, apellido: e.target.value })}
                      placeholder="Mendoza"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={usuarioForm.correo}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, correo: e.target.value })}
                    placeholder="carlos@aquaforte.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña *</label>
                  <input
                    type="password"
                    value={usuarioForm.contraseña}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, contraseña: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Rol</label>
                  <select
                    value={usuarioForm.rol}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, rol: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  >
                    <option value="Operador">Operador</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>Guardar Usuario</span>
                </button>
              </form>
            </div>

            {/* Tabla de Usuarios */}
            <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Equipo y Usuarios ({usuarios.length})</h3>
                <button
                  onClick={fetchAllData}
                  className="px-3 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Recargar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Nombre Completo</th>
                      <th className="py-3 px-3">Correo</th>
                      <th className="py-3 px-3">Rol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {usuarios.map((u) => (
                      <tr key={u.idusuario} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-violet-400">{u.idusuario}</td>
                        <td className="py-3 px-3 font-semibold text-white">{u.nombre} {u.apellido}</td>
                        <td className="py-3 px-3 text-slate-400">{u.correo}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            u.rol === 'Administrador'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                          }`}>
                            {u.rol}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950 text-center text-xs text-slate-500">
        <p>Aqua-Forte • Sistema Integral de Distribución de Agua Purificada (FastAPI + Supabase + React)</p>
      </footer>
    </div>
  );
}
