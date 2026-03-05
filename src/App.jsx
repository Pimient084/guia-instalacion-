import React, { useState } from 'react';
import { 
  Terminal, 
  Settings, 
  Globe, 
  Mail, 
  UserPlus, 
  CheckCircle2, 
  Copy, 
  Network,
  Cpu,
  ArrowRight
} from 'lucide-react';

const Step = ({ title, icon: Icon, children, isActive, onClick, isCompleted }) => (
  <div 
    className={`mb-3 rounded-2xl border-2 transition-all duration-300 overflow-hidden shadow-sm ${
      isActive ? 'border-[#7B2FBE] bg-white' : 'border-gray-200 bg-white hover:border-[#B5E048] hover:shadow-md'
    }`}
  >
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${isActive ? 'bg-[#7B2FBE] text-white' : 'bg-[#B5E048]/30 text-[#5a1f90]'}`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className={`font-bold text-base ${isActive ? 'text-[#7B2FBE]' : 'text-gray-800'}`}>{title}</h3>
          {isCompleted && (
            <span className="text-xs text-[#5a9e0f] font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={12}/> Completado
            </span>
          )}
        </div>
      </div>
      <div className={`rounded-full p-1.5 transition-all ${isActive ? 'bg-[#7B2FBE] rotate-90' : 'bg-[#B5E048]'}`}>
        <ArrowRight size={16} className={isActive ? 'text-white' : 'text-gray-800'} />
      </div>
    </button>
    
    {isActive && (
      <div className="px-5 pb-5 border-t-2 border-[#B5E048]">
        <div className="mt-5 space-y-4">
          {children}
        </div>
      </div>
    )}
  </div>
);

const CodeBlock = ({ command, label }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      {label && <p className="text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">{label}</p>}
      <div className="flex items-center bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
        <code className="flex-1 p-3.5 text-sm text-[#B5E048] font-mono overflow-x-auto whitespace-pre">
          {command}
        </code>
        <button 
          onClick={copyToClipboard}
          className="p-3.5 text-gray-400 hover:text-white hover:bg-[#7B2FBE] transition-colors border-l border-gray-700"
          title="Copiar comando"
        >
          {copied ? <CheckCircle2 size={16} className="text-[#B5E048]" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const toggleStep = (index) => {
    setActiveStep(activeStep === index ? null : index);
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const steps = [
    {
      title: "Configuración de Red (VM)",
      icon: Network,
      content: (
        <>
          <div className="bg-[#B5E048]/20 border-l-4 border-[#7B2FBE] p-3 text-sm text-gray-800 mb-2 rounded-r-lg">
            <strong className="text-[#7B2FBE]">Importante:</strong> Antes de encender la máquina, cambia la red a <strong>Adaptador Puente (Bridge)</strong> en los ajustes de VirtualBox/VMware.
          </div>
          <CodeBlock label="Entrar como Root y actualizar" command="sudo su\napt update && apt upgrade -y" />
          <CodeBlock label="Configurar DNS local" command="nano /etc/hosts" />
          <p className="text-xs text-gray-600 bg-[#B5E048]/15 border border-[#B5E048]/40 p-2.5 rounded-lg">
            Dentro de nano, añade: <code className="text-[#7B2FBE] font-bold">127.0.0.1 correo.squirrel</code>
          </p>
        </>
      )
    },
    {
      title: "Herramientas de Red",
      icon: Settings,
      content: (
        <>
          <CodeBlock label="Instalar net-tools" command="sudo apt install net-tools -y" />
          <CodeBlock label="Verificar dirección IP" command="ifconfig" />
          <div className="text-xs text-gray-500 italic p-2.5 border-2 border-dashed border-[#B5E048] bg-[#B5E048]/10 rounded-lg font-sans">
            Nota: Si no funciona, haz ping a la IP de Windows y verifica el tráfico con Wireshark.
          </div>
        </>
      )
    },
    {
      title: "Servidor Web & PHP 7.4",
      icon: Globe,
      content: (
        <>
          <CodeBlock label="Instalar Apache" command="sudo apt install apache2 -y" />
          <CodeBlock label="Añadir repositorio PHP y dependencias" command="sudo apt install software-properties-common -y\nsudo add-apt-repository ppa:ondrej/php\nsudo apt update" />
          <CodeBlock label="Instalar versión específica PHP 7.4" command="sudo apt install php7.4 libapache2-mod-php7.4 php-mysql -y" />
        </>
      )
    },
    {
      title: "Servidores de Correo (MTA/IMAP)",
      icon: Mail,
      content: (
        <>
          <CodeBlock label="Instalar Postfix (Envío)" command="sudo apt install postfix -y" />
          <CodeBlock label="Instalar Dovecot (Recepción)" command="sudo apt install dovecot-imapd dovecot-pop3d -y" />
        </>
      )
    },
    {
      title: "Instalación de SquirrelMail",
      icon: Cpu,
      content: (
        <>
          <CodeBlock label="Descargar y desempaquetar" command="cd /var/www/html\nsudo wget https://sourceforge.net/projects/squirrelmail/files/stable/1.4.22/squirrelmail-webmail-1.4.22.zip\nsudo unzip squirrelmail-webmail-1.4.22.zip\nsudo mv squirrelmail-webmail-1.4.22 squirrelmail" />
          <CodeBlock label="Asignar permisos de Apache" command="sudo chown -R www-data:www-data /var/www/html/squirrelmail/\nsudo chmod -R 775 /var/www/html/squirrelmail/" />
          
          <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-[#7B2FBE]/40">
            <h4 className="text-[#B5E048] font-mono text-xs mb-2 uppercase tracking-wider font-bold">Configuración Interactiva (Perl)</h4>
            <CodeBlock command="sudo perl /var/www/html/squirrelmail/config/conf.pl" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="text-[10px] text-gray-400 border border-[#7B2FBE]/40 p-2 rounded-lg">
                <span className="text-white block font-bold mb-1">MENÚ 2 (Server)</span>
                Opción 1: Escribir dominio <br/> <span className="text-[#B5E048]">correo.squirrel</span>
              </div>
              <div className="text-[10px] text-gray-400 border border-[#7B2FBE]/40 p-2 rounded-lg">
                <span className="text-white block font-bold mb-1">MENÚ 4 (General)</span>
                Opción 11: Poner en <span className="text-[#B5E048]">True</span>
              </div>
              <div className="col-span-2 text-[10px] text-center text-gray-500 mt-1">
                Presiona <span className="text-white font-bold">S</span> para guardar y <span className="text-white font-bold">Q</span> para salir.
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Gestión de Usuarios",
      icon: UserPlus,
      content: (
        <>
          <div className="bg-[#7B2FBE]/10 border border-[#7B2FBE]/30 p-3 rounded-xl text-xs text-[#5a1f90] mb-3 italic font-medium">
            Reemplaza [USER] por el nombre real (ejemplo: juan).
          </div>
          <CodeBlock label="Crear nuevo usuario" command="sudo adduser [USER]" />
          <CodeBlock label="Configurar directorio de trabajo" command="sudo usermod -m -d /var/www/html/[USER] [USER]\nsudo mkdir -p /var/www/html/[USER]" />
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="bg-[#7B2FBE] text-white p-2 rounded-xl">
            <Terminal size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-none">Servidor de Correo</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Guía de instalación SquirrelMail</p>
          </div>
        </div>
      </div>

      {/* Lime hero banner */}
      <div className="bg-[#B5E048]">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Instala tu servidor<br />paso a paso
          </h2>
          <p className="mt-2 text-gray-700 font-medium max-w-lg">
            Sigue cada etapa para configurar SquirrelMail en tu máquina virtual con Debian/Ubuntu.
          </p>
          {/* Progress dots */}
          <div className="mt-6 flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-10 rounded-full transition-all duration-500 ${
                  completedSteps.includes(i) ? 'bg-[#7B2FBE]' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <main>
          {steps.map((step, index) => (
            <Step 
              key={index}
              title={step.title}
              icon={step.icon}
              isActive={activeStep === index}
              isCompleted={completedSteps.includes(index)}
              onClick={() => toggleStep(index)}
            >
              {step.content}
            </Step>
          ))}
        </main>

        <footer className="mt-10 text-center text-gray-400 text-sm border-t pt-6 border-gray-200">
          <p className="font-medium text-gray-500">Configuración completa. Accede desde tu navegador:</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-[#7B2FBE] text-white px-5 py-2.5 rounded-full font-mono font-semibold text-sm select-all">
            http://[TU-IP]/squirrelmail
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
