import React from 'react';
import { FaVideo, FaUserShield, FaClock, FaStethoscope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <span className="text-2xl font-bold tracking-tight text-green-800">Teleconsult</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="#features" className="hover:text-green-600 transition">Services</a>
          <a href="#how-it-works" className="hover:text-green-600 transition">Comment ça marche</a>
        </div>
        <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition shadow-md">
          Connexion
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="px-8 py-16 md:py-24 flex flex-col md:flex-row items-center max-w-7xl mx-auto gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Votre santé, <br /> 
            <span className="text-green-600">en un clic.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Consultez des médecins qualifiés depuis chez vous. Simple, sécurisé et disponible 24h/24. Prenez rendez-vous et démarrez votre consultation vidéo instantanément.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/register" className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition transform hover:-translate-y-1">
              Commencer maintenant
            </Link>
            <Link to="/login" className="border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition">
              En savoir plus
            </Link>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
              ))}
            </div>
            <span>+500 médecins déjà inscrits</span>
          </div>
        </div>
        <div className="flex-1 relative">
           <div className="absolute -z-10 top-0 right-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-50"></div>
           <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Téléconsultation" 
            className="rounded-3xl shadow-2xl border-8 border-white transform md:rotate-2 hover:rotate-0 transition duration-500"
           />
        </div>
      </header>

      {/* --- FEATURES --- */}
      <section id="features" className="bg-gray-50 py-20 px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Teleconsult ?</h2>
          <p className="text-gray-500">Une plateforme conçue pour faciliter le parcours de soin.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <FeatureCard 
            icon={<FaVideo className="text-green-600 text-2xl"/>} 
            title="Vidéo HD" 
            description="Une qualité vidéo fluide avec Agora pour des diagnostics précis sans interruptions." 
          />
          <FeatureCard 
            icon={<FaUserShield className="text-green-600 text-2xl"/>} 
            title="Confidentialité" 
            description="Vos données médicales sont cryptées et protégées. Nous respectons le secret médical." 
          />
          <FeatureCard 
            icon={<FaClock className="text-green-600 text-2xl"/>} 
            title="Gain de temps" 
            description="Fini les salles d'attente. Consultez votre médecin au moment qui vous convient le mieux." 
          />
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-8 text-center bg-green-600 text-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold">Prêt à consulter un spécialiste ?</h2>
          <h1 className="text-green-100 text-xl mb-2">Inscrivez-vous gratuitement et prenez votre premier rendez-vous en moins de 2 minutes.</h1>
          <div>            
                <Link to="/register" className="bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                    Créer un compte maintenant
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 group">
    <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;