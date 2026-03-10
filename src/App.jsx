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
    className={`mb-3 rounded-2xl border-2 transition-all duration-500 shadow-sm ${
      isActive 
        ? 'border-[#7B2FBE] bg-white shadow-lg shadow-[#7B2FBE]/10' 
        : 'border-gray-200 bg-white hover:border-[#B5E048] hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.006]'
    }`}
  >
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${
          isActive ? 'bg-[#7B2FBE] text-white scale-110 shadow-md shadow-[#7B2FBE]/40' : 'bg-[#B5E048]/30 text-[#5a1f90]'
        }`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className={`font-bold text-base transition-colors duration-300 ${isActive ? 'text-[#7B2FBE]' : 'text-gray-800'}`}>{title}</h3>
          {isCompleted && (
            <span className="text-xs text-[#5a9e0f] font-semibold flex items-center gap-1 mt-0.5 animate-scale-in">
              <CheckCircle2 size={12}/> Completado
            </span>
          )}
        </div>
      </div>
      <div className={`rounded-full p-1.5 transition-all duration-300 ${isActive ? 'bg-[#7B2FBE] rotate-90 scale-110' : 'bg-[#B5E048]'}`}>
        <ArrowRight size={16} className={isActive ? 'text-white' : 'text-gray-800'} />
      </div>
    </button>

    {/* Grid-rows trick: animates height smoothly on open AND close */}
    <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
      <div className="overflow-hidden">
        <div className={`px-5 pb-5 border-t-2 border-[#B5E048] transition-opacity duration-300 ${isActive ? 'opacity-100 delay-100' : 'opacity-0'}`}>
          <div className="mt-5 space-y-4">
            {React.Children.map(children, (child, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ${isActive ? 'animate-slide-up' : ''}`}
                style={isActive ? { animationDelay: `${i * 60 + 80}ms`, animationFillMode: 'both' } : {}}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
    <div className="group relative animate-fade-in">
      {label && <p className="text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">{label}</p>}
      <div className="flex items-center bg-gray-900 rounded-xl overflow-hidden border border-gray-700 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-black/30">
        <code className="flex-1 p-3.5 text-sm text-[#B5E048] font-mono overflow-x-auto whitespace-pre">
          {command}
        </code>
        <button 
          onClick={copyToClipboard}
          className="p-3.5 text-gray-400 hover:text-white hover:bg-[#7B2FBE] transition-all duration-200 border-l border-gray-700 active:scale-95"
          title="Copiar comando"
        >
          {copied 
            ? <CheckCircle2 size={16} className="text-[#B5E048] animate-scale-in" /> 
            : <Copy size={16} />}
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
          <CodeBlock label="Instalar net-tools" command="apt install net-tools -y" />
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
          <CodeBlock label="Instalar Apache" command="apt install apache2 -y" />
          <CodeBlock label="Añadir repositorio PHP y dependencias" command="apt install software-properties-common -y\nadd-apt-repository ppa:ondrej/php\napt update" />
          <CodeBlock label="Instalar versión específica PHP 7.4" command="apt install php7.4 libapache2-mod-php7.4 php-mysql -y" />
        </>
      )
    },
    {
      title: "Servidores de Correo (MTA/IMAP)",
      icon: Mail,
      content: (
        <>
          <CodeBlock label="Instalar Postfix (Envío)" command="apt install postfix -y" />
          <CodeBlock label="Instalar Dovecot (Recepción)" command="apt install dovecot-imapd dovecot-pop3d -y" />
        </>
      )
    },
    {
      title: "Instalación de SquirrelMail",
      icon: Cpu,
      content: (
        <>
          <CodeBlock label="Descargar y desempaquetar" command="cd /var/www/html\nwget https://sourceforge.net/projects/squirrelmail/files/stable/1.4.22/squirrelmail-webmail-1.4.22.zip\nunzip squirrelmail-webmail-1.4.22.zip\nmv squirrelmail-webmail-1.4.22 squirrelmail" />
          <CodeBlock label="Asignar permisos de Apache" command="chown -R www-data:www-data /var/www/html/squirrelmail/\nsudo chmod -R 775 /var/www/html/squirrelmail/" />
          
          <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-[#7B2FBE]/40">
            <h4 className="text-[#B5E048] font-mono text-xs mb-3 uppercase tracking-wider font-bold">Configuración  (Perl)</h4>
            <CodeBlock command="perl /var/www/html/squirrelmail/config/conf.pl" />

            {/* Menú 2 */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#7B2FBE] text-white text-xs font-bold px-2 py-0.5 rounded">2</span>
                <span className="text-gray-300 text-xs font-semibold">Server settings</span>
              </div>
              <div className="ml-4 space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="bg-[#B5E048]/20 text-[#B5E048] text-xs font-bold px-1.5 py-0.5 rounded shrink-0">1</span>
                  <p className="text-gray-400 text-xs">
                    <span className="text-white font-semibold">Domain</span> — Escribe el dominio configurado al principio:{' '}
                    <code className="text-[#B5E048]">correo.squirrel</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Menú 4 */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#7B2FBE] text-white text-xs font-bold px-2 py-0.5 rounded">4</span>
                <span className="text-gray-300 text-xs font-semibold">General options</span>
              </div>
              <div className="ml-4 space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="bg-[#B5E048]/20 text-[#B5E048] text-xs font-bold px-1.5 py-0.5 rounded shrink-0">1</span>
                  <p className="text-gray-400 text-xs"><span className="text-white font-semibold">Data directory</span> — Confirmar ruta por defecto</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-[#B5E048]/20 text-[#B5E048] text-xs font-bold px-1.5 py-0.5 rounded shrink-0">2</span>
                  <p className="text-gray-400 text-xs"><span className="text-white font-semibold">Attachment directory</span> — Confirmar ruta por defecto</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-[#B5E048]/20 text-[#B5E048] text-xs font-bold px-1.5 py-0.5 rounded shrink-0">11</span>
                  <p className="text-gray-400 text-xs">
                    <span className="text-white font-semibold">Allow server-side sorting</span> — Poner en{' '}
                    <span className="text-[#B5E048] font-bold">True</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Guardar y salir */}
            <div className="mt-4 flex items-center gap-3 border-t border-gray-700 pt-3">
              <div className="flex items-center gap-1.5">
                <kbd className="bg-white text-gray-900 text-xs font-extrabold px-2 py-0.5 rounded">S</kbd>
                <span className="text-gray-400 text-xs">Guardar cambios</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="bg-white text-gray-900 text-xs font-extrabold px-2 py-0.5 rounded">Q</kbd>
                <span className="text-gray-400 text-xs">Salir del configurador</span>
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
          <CodeBlock label="Crear nuevo usuario" command="adduser [USER]" />
          <CodeBlock label="Configurar directorio de trabajo" command="usermod -m -d /var/www/html/[USER] [USER]\nmkdir -p /var/www/html/[USER]" />
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm animate-slide-down">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="bg-[#7B2FBE] text-white p-2 rounded-xl transition-transform duration-300 hover:scale-110 hover:rotate-3">
            <Terminal size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-none">Servidor de Correo</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Guía de instalación SquirrelMail</p>
          </div>
        </div>
      </div>

      {/* Lime hero banner */}
      <div className="bg-[#B5E048] animate-fade-in">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight animate-slide-up" style={{ animationDelay: '80ms' }}>
            Instala tu servidor<br />paso a paso
          </h2>
          <p className="mt-2 text-gray-700 font-medium max-w-lg animate-slide-up" style={{ animationDelay: '160ms' }}>
            Sigue cada etapa para configurar SquirrelMail en tu máquina virtual con Debian/Ubuntu.
          </p>
          {/* Progress dots */}
          <div className="mt-6 flex gap-2 animate-slide-up" style={{ animationDelay: '240ms' }}>
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-700 ease-in-out ${
                  completedSteps.includes(i) ? 'w-14 bg-[#7B2FBE]' : 'w-10 bg-white/60'
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
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <Step
                title={step.title}
                icon={step.icon}
                isActive={activeStep === index}
                isCompleted={completedSteps.includes(index)}
                onClick={() => toggleStep(index)}
              >
                {step.content}
              </Step>
            </div>
          ))}
        </main>

        <footer className="mt-10 text-center text-gray-400 text-sm border-t pt-6 border-gray-200 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="font-medium text-gray-500">Configuración completa. Accede desde tu navegador:</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-[#7B2FBE] text-white px-5 py-2.5 rounded-full font-mono font-semibold text-sm select-all transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#7B2FBE]/40 cursor-pointer">
            http://[TU-IP]/squirrelmail
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
