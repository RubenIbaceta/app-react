import React, { useState, useMemo } from 'react';
import {
  Shield,
  Lock,
  FileCheck,
  Server,
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Key,
  Database,
  Network,
  Activity,
  BookOpen,
  Layers,
  Award,
  Cpu,
  ShieldAlert,
  Radio,
  ArrowRight,
  Check
} from 'lucide-react';

const PILLARS = {
  confidencialidad: {
    id: 'confidencialidad',
    title: 'Confidencialidad',
    subtitle: 'Solo personal autorizado',
    color: 'emerald',
    badgeBg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    glowColor: 'shadow-emerald-500/20',
    activeBorder: 'border-emerald-600',
    accentHex: '#059669',
    icon: Lock,
    shortDesc: 'Garantiza que la información sensible solo sea accesible por entidades o personas explícitamente autorizadas.',
    concepts: [
      { name: 'Cifrado de Datos', desc: 'Transformación de datos legibles a formato ilegible (AES-256, RSA) en reposo y tránsito.' },
      { name: 'Control de Acceso (RBAC)', desc: 'Restricción de permisos basada en roles mínimos necesarios (Menor Privilegio).' },
      { name: 'Autenticación Multifactor (MFA)', desc: 'Verificación mediante múltiples factores (contraseña + token/biometría).' },
      { name: 'Clasificación de Información', desc: 'Etiquetado de datos según su sensibilidad (Pública, Interna, Confidencial, Secreta).' }
    ],
    threats: [
      { name: 'Eavesdropping / Espionaje', desc: 'Intercepción no autorizada de paquetes de red no cifrados.' },
      { name: 'Phishing e Ingeniería Social', desc: 'Engaño para obtener credenciales legítimas de usuarios.' },
      { name: 'Filtración de Datos (Data Leakage)', desc: 'Exposición accidental o intencionada de bases de datos de clientes.' }
    ],
    defenses: ['Cifrado End-to-End', 'MFA Obligatorio', 'DLP (Data Loss Prevention)', 'Gestión de Claves (KMS)'],
    realWorldScenario: 'En una app de Banca Móvil, la confidencialidad evita que terceros vean tu saldo o historial de transacciones mediante tokenización y cifrado TLS 1.3.'
  },
  integridad: {
    id: 'integridad',
    title: 'Integridad',
    subtitle: 'Datos exactos y no alterados',
    color: 'teal',
    badgeBg: 'bg-teal-50 border-teal-300 text-teal-900',
    glowColor: 'shadow-teal-500/20',
    activeBorder: 'border-teal-600',
    accentHex: '#0d9488',
    icon: FileCheck,
    shortDesc: 'Asegura que los datos se mantengan exactos, completos, auténticos y libres de modificaciones no autorizadas o maliciosas.',
    concepts: [
      { name: 'Funciones Hash Criptográficas', desc: 'Huellas digitales únicas (SHA-256) para verificar la no alteración del archivo.' },
      { name: 'Firma Digital', desc: 'Validación de autenticidad e irrefutabilidad mediante clave privada del emisor.' },
      { name: 'Control de Versiones y Logs Auditables', desc: 'Registro inalterable de quién modificó qué dato y cuándo.' },
      { name: 'Sumas de Comprobación (Checksums)', desc: 'Verificación periódica contra corrupción de bits en almacenamiento.' }
    ],
    threats: [
      { name: 'Man-In-The-Middle (MITM)', desc: 'Un atacante intercepta y altera el contenido de un mensaje en tránsito.' },
      { name: 'Inyección SQL (SQLi)', desc: 'Inserción de código para alterar, borrar o falsificar registros en base de datos.' },
      { name: 'Sabotaje de Código (Tampering)', desc: 'Inyección de malware en librerías o ejecutables del sistema.' }
    ],
    defenses: ['Firmas Digitales PKI', 'Control de integridad de archivos (FIM)', 'Bases de Datos Inmutables', 'Validación estricta de Entradas'],
    realWorldScenario: 'Al transferir $100 dólares, la integridad asegura que un atacante no pueda cambiar el monto a $10,000 durante la transmisión del mensaje bancario.'
  },
  disponibilidad: {
    id: 'disponibilidad',
    title: 'Disponibilidad',
    subtitle: 'Acceso continuo cuando se necesite',
    color: 'lime',
    badgeBg: 'bg-lime-50 border-lime-300 text-lime-900',
    glowColor: 'shadow-lime-500/20',
    activeBorder: 'border-lime-600',
    accentHex: '#65a30d',
    icon: Server,
    shortDesc: 'Garantiza que los sistemas, aplicaciones y datos estén operativos y accesibles para los usuarios autorizados en el momento requerido.',
    concepts: [
      { name: 'Redundancia y Alta Disponibilidad', desc: 'Sistemas duplicados (Clusters, Multi-AZ) para eliminar puntos únicos de fallo.' },
      { name: 'Mitigación de DDoS', desc: 'Filtrado inteligente de tráfico masivo mediante CDN y depuración de tráfico limpia.' },
      { name: 'Respaldos y Disaster Recovery (DRP)', desc: 'Copias de seguridad automatizadas con RTO (Tiempo de Recuperación) mínimo.' },
      { name: 'Balanceo de Carga (Load Balancer)', desc: 'Distribución equitativa de peticiones entre múltiples servidores.' }
    ],
    threats: [
      { name: 'Ataques DDoS', desc: 'Saturación deliberada de ancho de banda o CPU para tumbar servidores.' },
      { name: 'Ransomware', desc: 'Cifrado malicioso de discos que bloquea el acceso a la infraestructura.' },
      { name: 'Fallos de Hardware o Energía', desc: 'Averías físicas en discos SSD, servidores o interrupción de electricidad.' }
    ],
    defenses: ['Balanceadores Cloud (AWS ALB / Cloudflare)', 'Planes DRP / BCP', 'Respaldos Off-Site 3-2-1', 'Monitoreo de Infraestructura 24/7'],
    realWorldScenario: 'En un sistema hospitalario de emergencias, la disponibilidad asegura que los médicos puedan consultar historias clínicas en tiempo real sin caídas de servidor.'
  }
};

const ATTACKS = [
  {
    id: 'ddos',
    name: 'Ataque DDoS de Gran Escala',
    icon: Radio,
    category: 'Disponibilidad',
    description: 'Una red de bots masiva (Botnet) bombardea con millones de peticiones HTTP/UDP por segundo el servidor central.',
    impacts: {
      confidencialidad: { status: 'seguro', label: 'Sin Impacto Directo', color: 'text-emerald-700 font-semibold', level: 'Bajo' },
      integridad: { status: 'seguro', label: 'Sin Modificación de Datos', color: 'text-emerald-700 font-semibold', level: 'Bajo' },
      disponibilidad: { status: 'comprometido', label: 'SISTEMA CAÍDO (Colapso)', color: 'text-red-600 font-bold', level: 'CRÍTICO' }
    },
    mitigation: 'Desplegar protección DDoS en capa de red, activar Rate Limiting y escalar nodos elásticamente.'
  },
  {
    id: 'ransomware',
    name: 'Ataque por Ransomware',
    icon: ShieldAlert,
    category: 'Disponibilidad e Integridad',
    description: 'Malware infecta el servidor de archivos, cifra la base de datos con AES-256 privado y exige rescate en Bitcoin.',
    impacts: {
      confidencialidad: { status: 'parcial', label: 'Posible Exfiltración previa', color: 'text-amber-700 font-semibold', level: 'MEDIO' },
      integridad: { status: 'comprometido', label: 'Datos Alterados y Cifrados', color: 'text-red-600 font-bold', level: 'ALTO' },
      disponibilidad: { status: 'comprometido', label: 'Servicio Inaccesible', color: 'text-red-600 font-bold', level: 'CRÍTICO' }
    },
    mitigation: 'Restaurar copias de respaldo inmutables Off-site, aislar la red infectada y aplicar política Zero-Trust.'
  },
  {
    id: 'mitm',
    name: 'Man-In-The-Middle (MITM) en Red Pública',
    icon: Network,
    category: 'Confidencialidad e Integridad',
    description: 'Un atacante intercepta la conexión HTTP entre el usuario y la API, leyendo datos y modificando respuestas.',
    impacts: {
      confidencialidad: { status: 'comprometido', label: 'Credenciales e HITS Espiados', color: 'text-red-600 font-bold', level: 'CRÍTICO' },
      integridad: { status: 'comprometido', label: 'Mensajes Modificados en Vuelo', color: 'text-red-600 font-bold', level: 'CRÍTICO' },
      disponibilidad: { status: 'seguro', label: 'Servidor Operativo', color: 'text-emerald-700 font-semibold', level: 'Bajo' }
    },
    mitigation: 'Implementar HTTPS obligatorio con TLS 1.3, HSTS (HTTP Strict Transport Security) y Certificate Pinning.'
  },
  {
    id: 'phishing',
    name: 'Phishing de Credenciales Administrador',
    icon: Zap,
    category: 'Confidencialidad',
    description: 'El administrador ingresa sus claves en un sitio clonado de inicio de sesión, entregando acceso a la consola Cloud.',
    impacts: {
      confidencialidad: { status: 'comprometido', label: 'Llaves de Acceso Expuestas', color: 'text-red-600 font-bold', level: 'CRÍTICO' },
      integridad: { status: 'parcial', label: 'Riesgo de Modificación', color: 'text-amber-700 font-semibold', level: 'MEDIO' },
      disponibilidad: { status: 'parcial', label: 'Riesgo de Borrado de Infraestructura', color: 'text-amber-700 font-semibold', level: 'MEDIO' }
    },
    mitigation: 'Habilitar autenticación MFA con llave de hardware FIDO2/YubiKey y capacitación anti-phishing.'
  },
  {
    id: 'sqli',
    name: 'Inyección SQL (SQLi) en Formulario',
    icon: Database,
    category: 'Integridad y Confidencialidad',
    description: 'Un atacante envía comillas y comandos SQL en el campo de búsqueda, logrando alterar registros y volcar la tabla de usuarios.',
    impacts: {
      confidencialidad: { status: 'comprometido', label: 'Base de Datos Expuesta', color: 'text-red-600 font-bold', level: 'ALTO' },
      integridad: { status: 'comprometido', label: 'Registros Alterados o Borrados', color: 'text-red-600 font-bold', level: 'CRÍTICO' },
      disponibilidad: { status: 'parcial', label: 'Posible degradación de DB', color: 'text-amber-700 font-semibold', level: 'MEDIO' }
    },
    mitigation: 'Usar Sentencias Preparadas (Prepared Statements), ORMs seguros y Sanitización de Inputs.'
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Si un atacante logra interceptar tu conexión en una red WiFi pública y leer tu contraseña de banca en texto plano, ¿qué pilar se rompió principalmente?',
    options: [
      { text: 'Confidencialidad', correct: true, explain: 'Correcto. La confidencialidad se pierde cuando una persona no autorizada accede a información sensible.' },
      { text: 'Integridad', correct: false, explain: 'Incorrecto. La integridad trata sobre la alteración o modificación no autorizada de los datos.' },
      { text: 'Disponibilidad', correct: false, explain: 'Incorrecto. El banco sigue estando online y accesible.' },
      { text: 'No-repudio', correct: false, explain: 'Incorrecto. El pilar directo afectado en la tríada CIA es la Confidencialidad.' }
    ]
  },
  {
    id: 2,
    question: 'Un atacante modifica los registros de auditoría de un servidor para borrar sus huellas. ¿Qué pilar de la información ha violado?',
    options: [
      { text: 'Disponibilidad', correct: false, explain: 'Incorrecto. Los registros siguen existiendo en el servidor.' },
      { text: 'Integridad', correct: true, explain: '¡Exacto! Al alterar o falsificar el contenido de los logs se vulnera la integridad.' },
      { text: 'Confidencialidad', correct: false, explain: 'Incorrecto. El daño principal no es que los haya leído, sino que los modificó.' },
      { text: 'Autenticidad únicamente', correct: false, explain: 'Incorrecto. Dentro de la Tríada CIA la modificación no autorizada afecta la Integridad.' }
    ]
  },
  {
    id: 3,
    question: 'Durante una oferta de ventas masiva, la página web de un e-commerce colapsa y muestra un error 504 Gateway Timeout debido a exceso de tráfico. ¿Qué pilar está fallando?',
    options: [
      { text: 'Confidencialidad', correct: false, explain: 'Incorrecto. Ningún dato fue robado ni expuesto.' },
      { text: 'Integridad', correct: false, explain: 'Incorrecto. La información de los productos sigue intacta.' },
      { text: 'Disponibilidad', correct: true, explain: '¡Correcto! Los usuarios legítimos no pueden acceder al servicio cuando lo necesitan.' },
      { text: 'Privacidad', correct: false, explain: 'Incorrecto. No hay impacto en la privacidad de usuarios.' }
    ]
  },
  {
    id: 4,
    question: '¿Cuál de las siguientes tecnologías es el mecanismo primario para asegurar la INTEGRIDAD de un archivo ejecutable descargado de internet?',
    options: [
      { text: 'Cifrado simétrico AES-256', correct: false, explain: 'Incorrecto. El cifrado protege la confidencialidad.' },
      { text: 'Suma de Comprobación Hash (SHA-256)', correct: true, explain: '¡Muy bien! El hash permite comparar el valor del archivo descargado con el original.' },
      { text: 'Red Privada Virtual (VPN)', correct: false, explain: 'Incorrecto. La VPN asegura el túnel de comunicación.' },
      { text: 'Servidor Firewall de Capa 7', correct: false, explain: 'Incorrecto. El firewall inspecciona tráfico, no garantiza la no-modificación.' }
    ]
  },
  {
    id: 5,
    question: 'Para lograr la máxima Disponibilidad de una aplicación crítica, ¿cuál es la mejor arquitectura?',
    options: [
      { text: 'Un único servidor de alta potencia con 128GB de RAM', correct: false, explain: 'Incorrecto. Representa un punto único de fallo (Single Point of Failure).' },
      { text: 'Despliegue Multi-Región con Balanceador de Carga y Auto-escalado', correct: true, explain: '¡Correcto! Garantiza la redundancia y resiliencia ante caídas de datacenters.' },
      { text: 'Cifrar la base de datos con claves asimétricas RSA-4096', correct: false, explain: 'Incorrecto. Esto mejora la confidencialidad, no la disponibilidad.' },
      { text: 'Cambiar las contraseñas de los administradores periódicamente', correct: false, explain: 'Incorrecto. No previene caídas técnicas ni saturación.' }
    ]
  }
];

const CHECKLIST_ITEMS = [
  { id: 'c1', category: 'confidencialidad', text: 'Implementar Cifrado TLS 1.3 obligatorio en todas las rutas con HSTS habilitado.' },
  { id: 'c2', category: 'confidencialidad', text: 'Enforzar Autenticación Multifactor (MFA) para todos los paneles administrativos.' },
  { id: 'c3', category: 'confidencialidad', text: 'Almacenar contraseñas usando Hashes con Salt (Bcrypt, Argon2id, PBKDF2).' },
  { id: 'i1', category: 'integridad', text: 'Usar Sentencias Preparadas / ORM para prevenir Inyecciones SQL.' },
  { id: 'i2', category: 'integridad', text: 'Implementar firmas de integridad (HMAC / JWT con secreto fuerte) en Webhooks y APIs.' },
  { id: 'i3', category: 'integridad', text: 'Habilitar auditoría de cambios inalterable (Audit Logging) en operaciones críticas.' },
  { id: 'a1', category: 'disponibilidad', text: 'Configurar copias de respaldo automatizadas diarias con regla 3-2-1 y pruebas de restauración.' },
  { id: 'a2', category: 'disponibilidad', text: 'Implementar limitación de tasa (Rate Limiting) en endpoints públicos para evitar abuso.' },
  { id: 'a3', category: 'disponibilidad', text: 'Disponer de supervisión activa de salud (Health Checks + Uptime Monitoring 24/7).' }
];

const EncryptionWidget = () => {
  const [text, setText] = useState('Mensaje Secreto CIA 2026');
  const [key, setKey] = useState('CyberKey99');
  const [isEncrypted, setIsEncrypted] = useState(true);

  const cipherText = useMemo(() => {
    if (!text) return '';
    try {
      return btoa(
        text
          .split('')
          .map((char, index) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length)))
          .join('')
      );
    } catch (e) {
      return 'Error de Cifrado';
    }
  }, [text, key]);

  return (
    <div className="bg-emerald-950/5 border border-emerald-200 rounded-2xl p-5 my-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-emerald-700" />
          <h4 className="font-bold text-emerald-950 text-sm sm:text-base">Demostrador Interactivo de Cifrado (Confidencialidad)</h4>
        </div>
        <span className="text-xs font-mono px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">AES-Simulated</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block text-slate-700 text-xs mb-1 font-semibold">Texto Plano (Legible):</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
            placeholder="Escribe un mensaje sensible..."
          />
        </div>
        <div>
          <label className="block text-slate-700 text-xs mb-1 font-semibold">Clave Secreta de Cifrado:</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded-xl border border-emerald-200 shadow-inner">
        <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
          <span className="font-semibold text-slate-700">Resultado en Tránsito / Almacenamiento:</span>
          <button
            onClick={() => setIsEncrypted(!isEncrypted)}
            className="text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            {isEncrypted ? 'Revelar con Clave' : 'Ocultar Cifrado'}
          </button>
        </div>
        <div className="font-mono text-xs break-all text-emerald-800 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 font-bold">
          {isEncrypted ? cipherText : text}
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-2 italic">
        *Sin la clave exacta, un atacante que intercepte este paquete solo verá caracteres ininteligibles.
      </p>
    </div>
  );
};

const HashWidget = () => {
  const [inputVal, setInputVal] = useState('Transferir $500 a Cuenta #9876');

  const simulatedHash = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < inputVal.length; i++) {
      const char = inputVal.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    let full = '';
    for (let j = 0; j < 8; j++) {
      full += Math.abs(Math.sin(hash + j) * 10000000)
        .toString(16)
        .substring(0, 8);
    }
    return full.substring(0, 64);
  }, [inputVal]);

  return (
    <div className="bg-teal-950/5 border border-teal-200 rounded-2xl p-5 my-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-teal-100">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-teal-700" />
          <h4 className="font-bold text-teal-950 text-sm sm:text-base">Simulador de Integridad: Efecto Avalancha Hash</h4>
        </div>
        <span className="text-xs font-mono px-2 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-semibold">SHA-256</span>
      </div>

      <label className="block text-slate-700 text-xs mb-1 font-semibold">Instrucción / Contenido del Archivo:</label>
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs mb-3"
      />

      <div className="p-3 bg-white rounded-xl border border-teal-200 shadow-inner">
        <div className="text-xs text-slate-600 mb-1 font-semibold">Huella Digital Criptográfica (Hash SHA-256):</div>
        <div className="font-mono text-xs break-all text-teal-800 font-bold tracking-wider bg-teal-50/70 p-3 rounded-lg border border-teal-200">
          {simulatedHash}
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-2">
        💡 <strong className="text-teal-800">Prueba esto:</strong> Cambia un solo carácter o agrega un punto al final. Observa cómo el Hash resultante cambia por completo. Si el Hash cambia, la integridad ha sido alterada.
      </p>
    </div>
  );
};

const ClusterWidget = () => {
  const [nodes, setNodes] = useState([
    { id: 1, name: 'Nodo US-East (Principal)', active: true },
    { id: 2, name: 'Nodo EU-West (Réplica)', active: true },
    { id: 3, name: 'Nodo AP-South (Reserva)', active: true }
  ]);

  const toggleNode = (id) => {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, active: !n.active } : n)));
  };

  const activeCount = nodes.filter((n) => n.active).length;
  const systemStatus = activeCount > 0 ? 'OPERATIVO (99.99% Uptime)' : 'SISTEMA CAÍDO (Outage)';

  return (
    <div className="bg-lime-950/5 border border-lime-200 rounded-2xl p-5 my-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-lime-100">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-lime-700" />
          <h4 className="font-bold text-lime-950 text-sm sm:text-base">Simulador de Alta Disponibilidad & Redundancia</h4>
        </div>
        <span
          className={`text-xs font-mono px-3 py-1 rounded-full font-bold border ${
            activeCount > 0
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-red-100 text-red-800 border-red-300 animate-pulse'
          }`}
        >
          {systemStatus}
        </span>
      </div>

      <p className="text-xs text-slate-600 mb-3 font-medium">
        Haz clic en los servidores para simular fallos físicos o ataques y observa la tolerancia a fallos del servicio:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {nodes.map((node) => (
          <button
            key={node.id}
            onClick={() => toggleNode(node.id)}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all shadow-sm ${
              node.active
                ? 'bg-white border-lime-400 text-lime-950 hover:border-lime-600 hover:shadow-md'
                : 'bg-red-50 border-red-200 text-red-700 hover:border-red-400 opacity-80'
            }`}
          >
            <Cpu className={`w-6 h-6 mb-2 ${node.active ? 'text-lime-600' : 'text-red-500'}`} />
            <span className="text-xs font-bold text-center">{node.name}</span>
            <span
              className={`text-[10px] mt-2 uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
                node.active ? 'bg-lime-100 text-lime-800' : 'bg-red-200 text-red-900'
              }`}
            >
              {node.active ? 'ONLINE' : 'OFFLINE'}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-600 text-center font-medium">
        {activeCount === 3 && 'Toda la infraestructura está balanceada saludablemente.'}
        {activeCount < 3 && activeCount > 0 && '¡Failover activado! El tráfico se redirigió automáticamente a los nodos activos.'}
        {activeCount === 0 && '⚠️ Todos los nodos cayeron. La Disponibilidad se ha violado completamente.'}
      </div>
    </div>
  );
};

const TriadSVGDiagram = ({ activePillar, setActivePillar }) => {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center p-2">
      <svg viewBox="0 0 400 360" className="w-full h-full drop-shadow-md">
        {/* Connecting Lines */}
        <line x1="200" y1="60" x2="80" y2="280" className="stroke-emerald-300 stroke-[3]" />
        <line x1="200" y1="60" x2="320" y2="280" className="stroke-teal-300 stroke-[3]" />
        <line x1="80" y1="280" x2="320" y2="280" className="stroke-lime-300 stroke-[3]" />

        {/* Inner Triangle */}
        <polygon
          points="200,70 90,270 310,270"
          className="fill-emerald-50/40 stroke-emerald-200 stroke-2"
        />

        {/* Center Node */}
        <g transform="translate(200, 190)">
          <circle r="40" className="fill-white stroke-emerald-500 stroke-2 shadow-lg" />
          <foreignObject x="-25" y="-25" width="50" height="50">
            <div className="flex flex-col items-center justify-center h-full text-emerald-700">
              <Shield className="w-6 h-6 text-emerald-600" />
              <span className="text-[8px] font-black tracking-wider uppercase text-emerald-900">SEGURIDAD</span>
            </div>
          </foreignObject>
        </g>

        {/* TOP NODE: Confidencialidad */}
        <g
          onClick={() => setActivePillar('confidencialidad')}
          className="cursor-pointer group"
          transform="translate(200, 60)"
        >
          <circle
            r="38"
            className={`transition-all duration-300 ${
              activePillar === 'confidencialidad'
                ? 'fill-emerald-600 stroke-emerald-800 stroke-[4] shadow-xl'
                : 'fill-white stroke-emerald-500 stroke-2 group-hover:stroke-emerald-700 group-hover:fill-emerald-50'
            }`}
          />
          <foreignObject x="-25" y="-25" width="50" height="50">
            <div className="flex flex-col items-center justify-center h-full">
              <Lock
                className={`w-6 h-6 ${
                  activePillar === 'confidencialidad' ? 'text-white' : 'text-emerald-700'
                }`}
              />
            </div>
          </foreignObject>
          <text
            x="0"
            y="-48"
            textAnchor="middle"
            className={`text-xs font-black tracking-wide ${
              activePillar === 'confidencialidad' ? 'fill-emerald-900 text-sm' : 'fill-slate-700'
            }`}
          >
            CONFIDENCIALIDAD
          </text>
        </g>

        {/* BOTTOM RIGHT NODE: Integridad */}
        <g
          onClick={() => setActivePillar('integridad')}
          className="cursor-pointer group"
          transform="translate(320, 280)"
        >
          <circle
            r="38"
            className={`transition-all duration-300 ${
              activePillar === 'integridad'
                ? 'fill-teal-600 stroke-teal-800 stroke-[4] shadow-xl'
                : 'fill-white stroke-teal-500 stroke-2 group-hover:stroke-teal-700 group-hover:fill-teal-50'
            }`}
          />
          <foreignObject x="-25" y="-25" width="50" height="50">
            <div className="flex flex-col items-center justify-center h-full">
              <FileCheck
                className={`w-6 h-6 ${
                  activePillar === 'integridad' ? 'text-white' : 'text-teal-700'
                }`}
              />
            </div>
          </foreignObject>
          <text
            x="0"
            y="55"
            textAnchor="middle"
            className={`text-xs font-black tracking-wide ${
              activePillar === 'integridad' ? 'fill-teal-900 text-sm' : 'fill-slate-700'
            }`}
          >
            INTEGRIDAD
          </text>
        </g>

        {/* BOTTOM LEFT NODE: Disponibilidad */}
        <g
          onClick={() => setActivePillar('disponibilidad')}
          className="cursor-pointer group"
          transform="translate(80, 280)"
        >
          <circle
            r="38"
            className={`transition-all duration-300 ${
              activePillar === 'disponibilidad'
                ? 'fill-lime-600 stroke-lime-800 stroke-[4] shadow-xl'
                : 'fill-white stroke-lime-500 stroke-2 group-hover:stroke-lime-700 group-hover:fill-lime-50'
            }`}
          />
          <foreignObject x="-25" y="-25" width="50" height="50">
            <div className="flex flex-col items-center justify-center h-full">
              <Server
                className={`w-6 h-6 ${
                  activePillar === 'disponibilidad' ? 'text-white' : 'text-lime-800'
                }`}
              />
            </div>
          </foreignObject>
          <text
            x="0"
            y="55"
            textAnchor="middle"
            className={`text-xs font-black tracking-wide ${
              activePillar === 'disponibilidad' ? 'fill-lime-900 text-sm' : 'fill-slate-700'
            }`}
          >
            DISPONIBILIDAD
          </text>
        </g>
      </svg>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('infografia');
  const [selectedPillar, setSelectedPillar] = useState('confidencialidad');
  const [selectedAttack, setSelectedAttack] = useState(ATTACKS[0]);

  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [checkedItems, setCheckedItems] = useState({
    c1: true,
    i1: true,
    a3: true
  });

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistProgress = useMemo(() => {
    const total = CHECKLIST_ITEMS.length;
    const completed = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [checkedItems]);

  const handleQuizSelect = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] !== undefined && q.options[quizAnswers[q.id]].correct) {
        score += 1;
      }
    });
    return score;
  };

  const currentPillarData = PILLARS[selectedPillar];
  const PillarIcon = currentPillarData.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-16">
      {}
      <header className="border-b border-emerald-100 bg-white/90 sticky top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-2xl text-white shadow-md shadow-emerald-600/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Tríada CIA <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">Ciberseguridad</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Infografía Interactiva & Laboratorio de Seguridad</p>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('infografia')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'infografia'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Infografía CIA</span>
            </button>
            <button
              onClick={() => setActiveTab('simulador')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'simulador'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Simulador</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'checklist'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Auditoría</span>
            </button>
          </nav>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 pt-8">
        {/* TAB 1: INFOGRAFÍA CIA */}
        {activeTab === 'infografia' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-10 text-center text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

              <span className="inline-block px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-400/30 text-emerald-200 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
                Modelo Fundamental de Ciberseguridad
              </span>
              <h2 className="text-2xl sm:text-4xl font-black mb-3 tracking-tight">
                La Tríada de la Información (Tríada CIA)
              </h2>
              <p className="max-w-3xl mx-auto text-emerald-100 text-sm sm:text-base leading-relaxed font-medium">
                El pilar universal en Ciberseguridad para diseñar arquitecturas seguras, evaluar vulnerabilidades y proteger activos digitales frente a amenazas modernas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 bg-white border border-emerald-100 rounded-3xl p-6 shadow-lg shadow-emerald-900/5 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">
                  Haz clic en un pilar para explorar
                </span>
                <TriadSVGDiagram activePillar={selectedPillar} setActivePillar={setSelectedPillar} />

                <div className="grid grid-cols-3 gap-2 w-full mt-6">
                  {Object.values(PILLARS).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPillar(p.id)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all border ${
                        selectedPillar === p.id
                          ? p.badgeBg + ' ' + p.activeBorder + ' shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50/50'
                      }`}
                    >
                      <p.icon className="w-4 h-4" />
                      <span>{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className={`p-6 rounded-3xl border bg-white shadow-lg shadow-emerald-900/5 ${currentPillarData.activeBorder} transition-all`}>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                      <PillarIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">{currentPillarData.title}</h3>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">{currentPillarData.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{currentPillarData.shortDesc}</p>
                </div>

                {selectedPillar === 'confidencialidad' && <EncryptionWidget />}
                {selectedPillar === 'integridad' && <HashWidget />}
                {selectedPillar === 'disponibilidad' && <ClusterWidget />}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      Conceptos Clave
                    </h4>
                    <ul className="space-y-2.5">
                      {currentPillarData.concepts.map((c, idx) => (
                        <li key={idx} className="text-xs border-l-2 border-emerald-500 pl-3 py-0.5">
                          <strong className="text-slate-900 block font-bold">{c.name}</strong>
                          <span className="text-slate-600">{c.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Amenazas Principales
                    </h4>
                    <ul className="space-y-2.5">
                      {currentPillarData.threats.map((t, idx) => (
                        <li key={idx} className="text-xs border-l-2 border-red-500 pl-3 py-0.5">
                          <strong className="text-red-950 block font-bold">{t.name}</strong>
                          <span className="text-slate-600">{t.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" /> Caso Real de Uso:
                  </h4>
                  <p className="text-xs text-emerald-950 leading-relaxed font-medium italic">{currentPillarData.realWorldScenario}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIMULADOR DE CIBERAMENAZAS */}
        {activeTab === 'simulador' && (
          <div className="space-y-6">
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-lg shadow-emerald-900/5">
              <h2 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2.5">
                <Activity className="w-6 h-6 text-emerald-600" />
                Simulador de Ciberamenazas & Impacto CIA
              </h2>
              <p className="text-slate-600 text-sm font-medium">
                Selecciona un ciberataque real para analizar cómo afecta de forma independiente o simultánea a la Confidencialidad, Integridad y Disponibilidad.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider">Ataques Disponibles</h3>
                {ATTACKS.map((attack) => {
                  const IconComp = attack.icon;
                  const isSelected = selectedAttack.id === attack.id;
                  return (
                    <button
                      key={attack.id}
                      onClick={() => setSelectedAttack(attack)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-md'
                          : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800 shadow-sm'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-900 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold">{attack.name}</h4>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${
                          isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          Impacto: {attack.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-lg shadow-emerald-900/5 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h3 className="text-lg font-black text-slate-900">{selectedAttack.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">{selectedAttack.description}</p>
                  </div>

                  <h4 className="text-xs font-mono uppercase text-slate-500 font-bold mb-4 tracking-wider">
                    Estado de Vulneración en Pilares CIA
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                      <Lock className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                      <span className="text-xs font-extrabold text-slate-900 block">Confidencialidad</span>
                      <span className={`text-xs mt-2 block ${selectedAttack.impacts.confidencialidad.color}`}>
                        {selectedAttack.impacts.confidencialidad.label}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                      <FileCheck className="w-5 h-5 text-teal-600 mx-auto mb-2" />
                      <span className="text-xs font-extrabold text-slate-900 block">Integridad</span>
                      <span className={`text-xs mt-2 block ${selectedAttack.impacts.integridad.color}`}>
                        {selectedAttack.impacts.integridad.label}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                      <Server className="w-5 h-5 text-lime-700 mx-auto mb-2" />
                      <span className="text-xs font-extrabold text-slate-900 block">Disponibilidad</span>
                      <span className={`text-xs mt-2 block ${selectedAttack.impacts.disponibilidad.color}`}>
                        {selectedAttack.impacts.disponibilidad.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-700" />
                      Estrategia de Mitigación (Playbook):
                    </h5>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">{selectedAttack.mitigation}</p>
                  </div>
                </div>

                <div className="mt-6 text-[11px] text-slate-500 font-medium text-center border-t border-slate-100 pt-4">
                  *Nota: Un mismo vector de ataque puede vulnerar múltiples pilares dependiendo del tiempo de exposición y parches de seguridad.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUIZ DE EVALUACIÓN */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 text-center shadow-lg shadow-emerald-900/5">
              <Award className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h2 className="text-xl font-black text-slate-900">Evaluación de Conocimientos: Tríada CIA</h2>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Ponte a prueba con 5 escenarios reales para evaluar tu comprensión de la Ciberseguridad.
              </p>
            </div>

            <div className="space-y-5">
              {QUIZ_QUESTIONS.map((q, qIndex) => {
                const selectedOption = quizAnswers[q.id];
                return (
                  <div key={q.id} className="bg-white border border-emerald-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-start gap-2.5">
                      <span className="text-xs font-mono bg-emerald-100 px-2 py-0.5 rounded-md text-emerald-800 font-extrabold border border-emerald-200">
                        Q{qIndex + 1}
                      </span>
                      {q.question}
                    </h3>

                    <div className="space-y-2">
                      {q.options.map((opt, oIndex) => {
                        const isChosen = selectedOption === oIndex;
                        let btnStyle = 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-800';

                        if (quizSubmitted) {
                          if (opt.correct) {
                            btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                          } else if (isChosen && !opt.correct) {
                            btnStyle = 'bg-red-100 border-red-500 text-red-900 font-semibold';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                        }

                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleQuizSelect(q.id, oIndex)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt.text}</span>
                            {quizSubmitted && opt.correct && <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />}
                            {quizSubmitted && isChosen && !opt.correct && (
                              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && selectedOption !== undefined && (
                      <div className="mt-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                        <strong>Explicación:</strong> {q.options[selectedOption].explain}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-white border border-emerald-100 p-6 rounded-2xl text-center shadow-sm">
              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold disabled:opacity-40 transition-all text-sm shadow-md"
                >
                  Calcular Puntuación y Ver Resultados
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-2xl font-black text-slate-900">
                    Puntuación: <span className="text-emerald-600">{calculateQuizScore()}</span> / {QUIZ_QUESTIONS.length}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {calculateQuizScore() === 5
                      ? '🏆 ¡Excelente! Tienes un dominio avanzado de la Tríada de la Información.'
                      : calculateQuizScore() >= 3
                      ? '👍 ¡Buen trabajo! Comprendes los conceptos fundamentales de seguridad.'
                      : '📚 Te recomendamos repasar los pilares interactivos e intentarlo de nuevo.'}
                  </p>
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 inline-flex items-center gap-2 border border-slate-200"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reiniciar Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AUDITORÍA Y CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-lg shadow-emerald-900/5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-6 h-6 text-emerald-600" />
                    Checklist de Madurez de Ciberseguridad (CIA)
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Lista de verificación técnica recomendada para administradores y desarrolladores.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-mono font-black text-emerald-700">{checklistProgress}%</span>
                  <span className="block text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Nivel de Madurez</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-3">
              {CHECKLIST_ITEMS.map((item) => {
                const isChecked = !!checkedItems[item.id];
                const pillarInfo = PILLARS[item.category];

                return (
                  <label
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                        : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:border-emerald-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div className="flex-1 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                            pillarInfo ? pillarInfo.badgeBg : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {pillarInfo ? pillarInfo.title : item.category}
                        </span>
                      </div>
                      <span className={isChecked ? 'line-through text-slate-500 font-medium' : 'text-slate-800 font-semibold'}>
                        {item.text}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {}
      <footer className="max-w-7xl mx-auto px-4 mt-16 text-center text-xs text-slate-500 border-t border-slate-200 pt-6 font-medium">
        <p>Infografía Educativa de Ciberseguridad • La Tríada CIA (Confidencialidad, Integridad, Disponibilidad)</p>
      </footer>
    </div>
  );
}