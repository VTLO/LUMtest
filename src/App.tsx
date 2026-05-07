/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts';
import { 
  LayoutDashboard, 
  Users, 
  Filter, 
  Mail, 
  Zap, 
  ShoppingBag, 
  FileText, 
  BookOpen, 
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Search,
  ChevronRight,
  Trash2,
  Settings,
  BarChart,
  Plus,
  ArrowRight,
  Eye,
  Type as FontIcon,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Smartphone,
  Monitor,
  Share2,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  TrendingUp,
  History,
  Calendar as CalendarIcon,
  Columns as KanbanIcon,
  Play as PlayIcon,
  Code as CodeIcon,
  FileIcon,
  Facebook,
  Instagram,
  Linkedin,
  Moon,
  Sun,
  Star,
  Filter as LucideFilter,
  Shield,
  Download,
  Link as LinkIcon,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { TabType, Form, FormQuestion, FormTemplate } from './types';
import { LEXICON } from './constants';
import { suggestQuestions, getAIAssistantResponse } from './services/aiService';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';

// --- Components ---

interface SidebarItemProps {
  item: { id: TabType; label: string; icon: any }; 
  active: boolean; 
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  active, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 group ${
      active 
        ? 'bg-ink text-paper shadow-lg shadow-ink/10' 
        : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
    }`}
  >
    <div className={`p-1.5 rounded-md transition-colors ${active ? 'bg-gold/20 text-gold' : 'group-hover:bg-gold/10 group-hover:text-gold'}`}>
      <item.icon size={16} strokeWidth={active ? 2.5 : 1.5} />
    </div>
    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${active ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
    {active && <motion.div layoutId="sidebar-active" className="ml-auto w-1 h-1 bg-gold rounded-full" />}
  </button>
);

const Dashboard = ({ setActiveTab, setActiveSubTab }: { setActiveTab: (t: TabType) => void, setActiveSubTab: (t: string | null) => void }) => (
  <div className="p-12 space-y-12 max-w-7xl mx-auto">
    <header className="flex justify-between items-end border-b border-ink/10 pb-8">
      <div className="space-y-1">
        <h1 className="text-5xl font-light tracking-tight text-ink italic">Tableau de Bord</h1>
        <p className="text-ink/50 text-sm font-light uppercase tracking-widest">Aperçu de votre empire numérique</p>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => alert('Lien Signature copié dans le presse-papier')}
          className="px-6 py-2.5 border border-ink text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-paper transition-all flex items-center gap-2"
        >
          <Share2 size={14} /> Partager le Store
        </button>
        <button 
          onClick={() => {
              setActiveTab('settings');
              setActiveSubTab(null);
          }}
          className="px-6 py-2.5 bg-gold text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-gold/20 transition-all"
        >
            Paramètres App
        </button>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[ 
        { label: 'Audience brute', value: '0', icon: Users, color: 'text-gold' },
        { label: 'Chiffre d\'affaires', value: '€0.00', icon: ShoppingBag, color: 'text-ink' },
        { label: 'Total Diffusions', value: '0', icon: Mail, color: 'text-ink' },
        { label: 'Soutien Client', value: '0%', icon: ShieldCheck, color: 'text-gold' },
      ].map((stat, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.6 }}
          className="bg-white dark:bg-zinc-900 p-8 rounded-none border border-ink/10 shadow-sm hover:border-gold/30 transition-all group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`${stat.color} group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={28} strokeWidth={1} />
            </div>
            <span className="text-[10px] font-bold text-ink/40 dark:text-paper/40 uppercase tracking-tighter italic">Vierge</span>
          </div>
          <p className="text-ink/60 dark:text-paper/60 text-[10px] font-bold uppercase tracking-[0.2em]">{stat.label}</p>
          <h3 className="text-3xl font-light text-ink dark:text-paper mt-2 font-serif group-hover:text-gold transition-colors">{stat.value}</h3>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm p-8 rounded-none border border-ink/5 flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-4">
           <Zap className="mx-auto text-ink/10" size={48} />
           <p className="text-ink/30 text-[10px] uppercase tracking-widest font-bold">Aucune activité récente à afficher</p>
        </div>
      </div>
      <div className="bg-ink p-8 flex flex-col justify-between text-paper">
         <div>
            <Sparkles className="text-gold mb-6" size={32} />
            <h4 className="text-2xl font-serif italic mb-4">Conseil Pro du Jour</h4>
            <p className="text-paper/70 font-light leading-relaxed text-sm">"L'élégance n'est pas de se faire remarquer, mais de se faire retenir." Simplifiez vos formulaires pour augmenter la conversion.</p>
         </div>
         <button 
            onClick={() => setActiveTab('lexicon')}
            className="mt-8 text-xs font-bold uppercase tracking-widest text-gold hover:text-white transition-colors flex items-center gap-2"
         >
            Découvrir le Lexique <ChevronRight size={14}/>
         </button>
      </div>
    </div>
  </div>
);

const FormBuilder = () => {
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'responses' | 'settings'>('questions');
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);
  const [form, setForm] = useState<Form>({
    id: '1',
    title: 'Nouveau Formulaire',
    description: '',
    questions: [],
    responses: [],
    settings: { collectEmails: true, limitToOneResponse: false, showProgressBar: true },
    status: 'draft'
  });

  const [topic, setTopic] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const formTemplates: FormTemplate[] = [
    {
      id: 't1',
      title: 'Sondage de Satisfaction',
      description: 'Mesurez le bonheur de vos clients après un achat.',
      questions: [
        { id: 'q1', type: 'poll', title: 'Recommanderiez-vous nos services ?', required: true, options: ['Oui', 'Peut-être', 'Non'] },
        { id: 'q2', type: 'long_text', title: 'Que pouvons-nous améliorer ?', required: false }
      ]
    },
    {
      id: 't2',
      title: 'Inscription Newsletter',
      description: 'Capturez des leads qualifiés avec élégance.',
      questions: [
        { id: 'q1', type: 'short_text', title: 'Votre prénom', required: true },
        { id: 'q2', type: 'email', title: 'Votre meilleure adresse courriel', required: true }
      ]
    },
    {
      id: 't3',
      title: 'Candidature Programme Or',
      description: 'Filtrez vos participants pour vos coachings exclusifs.',
      questions: [
        { id: 'q1', type: 'multiple_choice', title: 'Quel est votre revenu actuel ?', required: true, options: ['0-1k€', '1k-5k€', '5k€+'] },
        { id: 'q2', type: 'short_text', title: 'Votre objectif principal', required: true }
      ]
    },
    {
      id: 't4',
      title: 'Feedback Événement',
      description: 'Récupérez les impressions de vos invités après une soirée.',
      questions: [
        { id: 'q1', type: 'poll', title: 'Note globale', required: true, options: ['Exceptionnel', 'Très bien', 'Correct'] },
        { id: 'q2', type: 'poll', title: 'Le lieu vous a-t-il plu ?', required: true, options: ['Magnifique', 'Bien', 'Décevant'] }
      ]
    },
    {
      id: 't5',
      title: 'Inscription Newsletter Prestige',
      description: 'Développez votre base de contacts avec un formulaire de capture élégant.',
      questions: [
        { id: 'q1', type: 'short_text', title: 'Votre Prénom', required: true },
        { id: 'q2', type: 'email', title: 'Votre meilleure adresse mail', required: true },
        { id: 'q3', type: 'checkbox', title: 'Centres d\'intérêt', required: false, options: ['Stratégie Digitale', 'Luxe & Immobilier', 'Coaching Haute Performance'] }
      ]
    }
  ];

  const applyTemplate = (template: FormTemplate) => {
    setForm({
      ...form,
      title: template.title,
      description: template.description,
      questions: template.questions.map(q => ({ ...q, id: Math.random().toString() }))
    });
  };

  const addQuestion = (type: FormQuestion['type'] = 'short_text') => {
    const newQ: FormQuestion = {
      id: Date.now().toString(),
      type,
      title: type === 'poll' ? 'Sondage de satisfaction instantané' : 'Nouvelle Question de l\'Audit',
      required: false,
      options: type === 'multiple_choice' || type === 'checkbox' || type === 'poll' ? ['D\'accord', 'Pas d\'accord'] : undefined,
      results: type === 'poll' ? { 'D\'accord': 65, 'Pas d\'accord': 35 } : undefined
    };
    setForm({ ...form, questions: [...form.questions, newQ] });
  };

  const handlePublish = () => {
    setShowValidation(true);
    setTimeout(() => setShowValidation(false), 3000);
  };

  const handleSuggest = async () => {
    if (!topic) return;
    setIsSuggesting(true);
    const suggestions = await suggestQuestions(topic);
    if (suggestions.length > 0) {
      const newQs = suggestions.map((s: any) => ({
        id: Math.random().toString(),
        type: s.type,
        title: s.title,
        required: false,
        options: s.type === 'multiple_choice' ? ['Option A', 'Option B'] : undefined
      }));
      setForm({ ...form, questions: [...form.questions, ...newQs] });
    }
    setIsSuggesting(false);
  };

  const setQuestions = (newQuestions: FormQuestion[]) => {
    setForm({ ...form, questions: newQuestions });
  };

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (q: FormQuestion, value: string) => {
    if (q.required && !value) return "Ce champ est obligatoire";
    if (q.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "L'adresse courriel est invalide";
    return "";
  };

  const handleResponseChange = (qId: string, value: string) => {
    const newResponses = { ...responses, [qId]: value };
    setResponses(newResponses);
    
    // Clear error on change
    if (errors[qId]) {
      const newErrors = { ...errors };
      delete newErrors[qId];
      setErrors(newErrors);
    }
  };

  const handleLiveSubmit = async () => {
    const newErrors: Record<string, string> = {};
    form.questions.forEach(q => {
      const error = validateField(q, responses[q.id] || "");
      if (error) newErrors[q.id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Visual feedback for error
      const firstErrorId = Object.keys(newErrors)[0];
      const el = document.getElementById(`q-${firstErrorId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      try {
        // Find email and name fields to save a contact
        let email = "";
        let name = "Prospect (Formulaire)";
        form.questions.forEach(q => {
          if (q.type === 'email' && responses[q.id]) email = responses[q.id];
          if (q.type === 'short_text' && responses[q.id] && q.title.toLowerCase().includes('prénom')) name = responses[q.id];
        });

        if (email) {
          const contactRef = doc(collection(db, 'contacts'));
          await setDoc(contactRef, {
            name: name,
            email: email,
            status: "Prospect",
            value: "€0",
            date: new Date().toLocaleDateString('fr-FR'),
            createdAt: serverTimestamp()
          });
        }
        alert('Félicitations. Votre audit Signature a été transmis avec succès. (Un e-mail d\'alerte simulé a été envoyé à lumelia.contact.bijouterie@gmail.com)');
        setResponses({});
        setErrors({});
        localStorage.removeItem(`form_draft_${form.id}`);
      } catch (e: any) {
        console.error(e);
        alert('Erreur lors de la soumission: ' + e.message);
      }
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(`form_draft_${form.id}`, JSON.stringify(responses));
    alert('Brouillon sauvegardé. Vos réponses sont en sécurité.');
  };

  const loadDraft = () => {
    const saved = localStorage.getItem(`form_draft_${form.id}`);
    if (saved) {
      setResponses(JSON.parse(saved));
      alert('Brouillon restauré.');
    }
  };

  return (
    <div className="h-full flex flex-col bg-paper">
      {/* Form Header */}
      <div className="bg-white border-b border-ink/5 px-12">
        <div className="max-w-5xl mx-auto py-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-ink text-white rounded-none rotate-3 hover:rotate-0 transition-transform duration-500">
              <FileText size={24} />
            </div>
            <div className="space-y-1">
                <input 
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="text-2xl font-serif italic font-bold text-ink bg-transparent focus:outline-none"
                />
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.3em]">Module de Collecte Directe</p>
                  <button 
                    onClick={() => setForm({ ...form, status: form.status === 'draft' ? 'published' : 'draft' })}
                    className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest transition-all ${
                      form.status === 'draft' ? 'bg-gold/10 text-gold' : 'bg-green-500/10 text-green-500'
                    }`}
                  >
                    {form.status === 'draft' ? 'Brouillon' : 'Publié'}
                  </button>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-ink/5 p-1 rounded-none mr-4">
              <button 
                onClick={() => setIsPreviewMobile(false)}
                className={`p-2 transition-all ${!isPreviewMobile ? 'bg-white shadow-sm text-ink' : 'text-ink/30'}`}
              >
                <Monitor size={16} />
              </button>
              <button 
                onClick={() => setIsPreviewMobile(true)}
                className={`p-2 transition-all ${isPreviewMobile ? 'bg-white shadow-sm text-ink' : 'text-ink/30'}`}
              >
                <Smartphone size={16} />
              </button>
            </div>
            <button className="p-3 hover:bg-gold/10 rounded-full text-ink/40 hover:text-gold transition-all" title="Aperçu"><Eye size={20} /></button>
            <div className="hidden lg:flex items-center gap-4 bg-paper/50 px-4 py-2 border border-ink/5 group relative mr-2">
              <LinkIcon size={12} className="text-gold" />
              <span className="text-[10px] font-mono text-ink/40 tracking-tighter overflow-hidden max-w-[150px] whitespace-nowrap">
                https://empire.prestige/s/{form.id}
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://empire.prestige/s/${form.id}`);
                  alert('Lien de Signature copié dans le presse-papier.');
                }}
                className="p-1.5 hover:bg-gold hover:text-white transition-all"
                title="Copier le lien public"
              >
                <Download size={14} />
              </button>
            </div>
            <button 
              onClick={handlePublish}
              className="px-10 py-3 bg-ink text-paper text-xs font-bold uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              {showValidation ? <CheckCircle2 size={16} className="text-gold animate-bounce" /> : 'Publier'}
            </button>
          </div>
        </div>
        
        {/* Form Sub-Tabs */}
        <div className="flex justify-center border-t border-ink/5">
          <div className="flex gap-4">
            {[
              { id: 'questions', label: 'Architecture' },
              { id: 'responses', label: 'Analytique' },
              { id: 'settings', label: 'Configuration' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                  activeSubTab === tab.id ? 'text-gold' : 'text-ink/30 hover:text-ink/60'
                }`}
              >
                {tab.label}
                {activeSubTab === tab.id && (
                  <motion.div layoutId="subtab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-12 pb-32 px-4 shadow-inner relative">
        <AnimatePresence>
          {showValidation && (
             <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white border border-gold p-4 shadow-2xl flex items-center gap-3"
             >
                <CheckCircle2 className="text-gold" size={20} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Publication réussie. Formulaire en ligne.</span>
             </motion.div>
          )}
        </AnimatePresence>

        <div className={`mx-auto transition-all duration-500 ${isPreviewMobile ? 'max-w-[375px] border-[8px] border-ink rounded-[3rem] h-[667px] overflow-y-auto bg-white shadow-2xl' : 'max-w-3xl'}`}>
          {isPreviewMobile && <div className="h-6 w-32 bg-ink mx-auto rounded-b-2xl mb-4"></div>}
          
          {/* Progress Bar Display */}
          {form.questions.length > 0 && (
            <div className="px-10 pt-4">
               <div className="flex justify-between text-[8px] font-bold uppercase tracking-[0.2em] mb-2 text-ink/30">
                  <span>Progression de la soumission</span>
                  <span>0%</span>
               </div>
               <div className="w-full h-[1px] bg-ink/5 overflow-hidden">
                  <div className="w-0 h-full bg-gold transition-all duration-1000"></div>
               </div>
            </div>
          )}

          <div className={`${isPreviewMobile ? 'p-4' : 'space-y-10'}`}>
            <AnimatePresence mode="wait">
              {activeSubTab === 'questions' && (
                <motion.div key="q" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                  
                  {/* Form Templates Suggestions */}
                  {!isPreviewMobile && (
                    <div className="grid grid-cols-3 gap-6">
                       {formTemplates.map(template => (
                         <button 
                            key={template.id}
                            onClick={() => applyTemplate(template)}
                            className="bg-white border border-ink/5 p-6 text-left hover:border-gold transition-all group"
                         >
                            <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">{template.title}</h4>
                            <p className="text-[9px] text-ink/40 leading-relaxed italic">{template.description}</p>
                         </button>
                       ))}
                    </div>
                  )}

                  {/* IA Suggestions Header */}
                  {!isPreviewMobile && (
                    <div className="bg-zinc-900 border border-gold/20 p-10 relative overflow-hidden shadow-2xl group mb-8">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-3xl -mr-48 -mt-48 transition-all group-hover:bg-gold/10"></div>
                      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                <Sparkles className="text-gold animate-pulse" size={32} />
                            </div>
                            <div>
                                <span className="font-serif italic text-2xl text-paper block">Architecte AI</span>
                                <span className="text-[9px] font-bold text-gold uppercase tracking-[0.3em]">Signature Intelligence</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full border-b border-paper/10 focus-within:border-gold transition-colors">
                            <input 
                                placeholder="Quel est l'objectif de cet audit ? (ex: Luxe, Immobilier, Coaching...)" 
                                className="w-full py-3 bg-transparent outline-none text-md italic font-light tracking-wide text-paper placeholder:text-paper/20"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                            />
                        </div>
                        <button 
                            disabled={isSuggesting}
                            onClick={handleSuggest}
                            className="whitespace-nowrap px-12 py-4 bg-gold text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-gold/20"
                        >
                            {isSuggesting ? 'Codage en cours...' : 'Structurer avec AI'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Form Templates Suggestions (Only if no questions yet) */}
                  {form.questions.length === 0 && !isPreviewMobile && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-[1px] bg-ink/5"></div>
                        <h4 className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.4em]">Bibliothèque de Modèles</h4>
                        <div className="flex-1 h-[1px] bg-ink/5"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-8">
                        {formTemplates.map(template => (
                          <motion.button 
                              key={template.id}
                              whileHover={{ y: -5 }}
                              onClick={() => applyTemplate(template)}
                              className="bg-white border border-ink/5 p-8 text-left hover:border-gold transition-all group shadow-sm hover:shadow-xl relative overflow-hidden"
                          >
                              <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-45">
                                <Zap size={32} />
                              </div>
                              <h4 className="text-[11px] font-bold text-ink uppercase tracking-widest mb-2 group-hover:text-gold transition-colors">{template.title}</h4>
                              <p className="text-[9px] text-ink/40 leading-relaxed italic mb-6">{template.description}</p>
                              <div className="flex items-center gap-2 text-[8px] font-bold text-gold uppercase tracking-tighter">
                                 Utiliser le modèle <ArrowRight size={10} />
                              </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main Card */}
                  <div className="bg-white border-l-8 border-ink p-10 space-y-4 shadow-sm">
                    <input 
                      value={form.title} 
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="text-4xl font-serif font-light italic text-ink w-full outline-none bg-transparent" 
                    />
                    {!isPreviewMobile && <div className="w-20 h-[1px] bg-gold mt-2 mb-6"></div>}
                    <input 
                      value={form.description} 
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Description de la mission..." 
                      className="text-ink/60 font-light text-sm w-full outline-none bg-transparent italic" 
                    />
                    
                    {/* Social Share Section */}
                    {!isPreviewMobile && (
                      <div className="pt-6 border-t border-ink/5 mt-8 flex items-center justify-between">
                         <span className="text-[9px] font-bold text-ink/30 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Share2 size={12} /> Diffusion Stratégique
                         </span>
                         <div className="flex gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                            <Facebook size={16} className="cursor-pointer hover:text-blue-600" />
                            <Instagram size={16} className="cursor-pointer hover:text-pink-600" />
                            <Linkedin size={16} className="cursor-pointer hover:text-blue-800" />
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Questions */}
                  <Reorder.Group axis="y" values={form.questions} onReorder={setQuestions} className="space-y-10">
                    {form.questions.map((q, idx) => (
                      <Reorder.Item 
                        key={q.id} 
                        value={q}
                        id={`q-${q.id}`}
                        className={`bg-white border transition-all group relative ${errors[q.id] ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-ink/5'} hover:border-gold/30 ${isPreviewMobile ? 'p-6 mb-4' : 'p-10'}`}
                        dragListener={!isPreviewMobile}
                      >
                        <div className={`flex ${isPreviewMobile ? 'flex-col' : 'gap-8'}`}>
                          <div className="flex-1 space-y-8">
                            <div className={`flex items-start border-b border-ink/5 pb-6 ${isPreviewMobile ? 'flex-col gap-2' : 'gap-8'}`}>
                              {!isPreviewMobile && (
                                <div className="flex flex-col items-center gap-2 tabular-nums">
                                  <div className="text-2xl font-serif text-ink tracking-tighter opacity-20">0{idx + 1}</div>
                                  <div className="w-4 h-[1px] bg-ink/10"></div>
                                </div>
                              )}
                              <div className="flex-1 w-full">
                                {isPreviewMobile ? (
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">
                                       {q.title} {q.required && <span className="text-red-500">*</span>}
                                     </label>
                                     {q.type === 'short_text' && (
                                       <input 
                                         value={responses[q.id] || ''}
                                         onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                         className={`w-full p-3 bg-paper/50 border ${errors[q.id] ? 'border-red-400' : 'border-ink/5'} outline-none focus:border-gold transition-all text-xs`}
                                         placeholder="Votre réponse..."
                                       />
                                     )}
                                     {q.type === 'email' && (
                                       <input 
                                         type="email"
                                         value={responses[q.id] || ''}
                                         onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                         className={`w-full p-3 bg-paper/50 border ${errors[q.id] ? 'border-red-400' : 'border-ink/5'} outline-none focus:border-gold transition-all text-xs`}
                                         placeholder="exemple@prestige.com"
                                       />
                                     )}
                                     {q.type === 'long_text' && (
                                       <textarea 
                                         value={responses[q.id] || ''}
                                         onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                         className={`w-full p-3 bg-paper/50 border ${errors[q.id] ? 'border-red-400' : 'border-ink/5'} outline-none focus:border-gold transition-all text-xs min-h-[100px]`}
                                         placeholder="Partagez vos pensées..."
                                       />
                                     )}
                                     {(q.type === 'multiple_choice' || q.type === 'poll') && (
                                       <div className="space-y-2">
                                          {q.options?.map((opt, oIdx) => (
                                            <button 
                                              key={oIdx}
                                              onClick={() => handleResponseChange(q.id, opt)}
                                              className={`w-full p-3 text-left text-[10px] uppercase tracking-widest border transition-all ${responses[q.id] === opt ? 'bg-ink text-paper border-ink' : 'bg-paper/50 border-ink/5 hover:border-gold/30'}`}
                                            >
                                              {opt}
                                            </button>
                                          ))}
                                       </div>
                                     )}
                                     {errors[q.id] && (
                                       <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest italic">{errors[q.id]}</p>
                                     )}
                                  </div>
                                ) : (
                                  <input 
                                    value={q.title}
                                    onChange={e => {
                                        const newQs = [...form.questions];
                                        newQs[idx].title = e.target.value;
                                        setForm({ ...form, questions: newQs });
                                    }}
                                    className={`bg-transparent font-serif italic text-ink w-full outline-none placeholder:text-ink/10 ${isPreviewMobile ? 'text-lg' : 'text-xl'}`}
                                    placeholder="Énoncez votre question ici..."
                                  />
                                )}
                                {!isPreviewMobile && q.required && <span className="text-red-400 text-[10px] font-bold">* Champ requis</span>}
                              </div>
                              {!isPreviewMobile && (
                                <select 
                                  value={q.type}
                                  onChange={e => {
                                      const newQs = [...form.questions];
                                      newQs[idx].type = e.target.value as any;
                                      setForm({ ...form, questions: newQs });
                                  }}
                                  className="py-1 border-b border-ink/10 text-[10px] font-bold uppercase tracking-widest bg-transparent outline-none focus:border-gold transition-colors"
                                >
                                  <option value="short_text">Texte Concis</option>
                                  <option value="long_text">Analyse Libre</option>
                                  <option value="email">Courriel (Vérifié)</option>
                                  <option value="multiple_choice">Sélection Unique</option>
                                  <option value="checkbox">Multi-Sélection</option>
                                  <option value="poll">Sondage Express</option>
                                  <option value="custom">Champ Personnalisé</option>
                                  <option value="image">Illustration</option>
                                  <option value="video">Séquence Vidéo</option>
                                </select>
                              )}
                            </div>

                          {q.type === 'poll' && (
                            <div className="space-y-6 mt-8 bg-paper p-8 border border-ink/5 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-2 opacity-5"><BarChart size={64}/></div>
                              <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Aperçu des Résultats (Mode Admin)</p>
                              <div className="space-y-4">
                                {q.options?.map((opt, oIdx) => {
                                   const percentage = q.results?.[opt] || 0;
                                   return (
                                     <div key={oIdx} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                           <span>{opt}</span>
                                           <span className="text-gold tabular-nums">{percentage}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-ink/5 overflow-hidden">
                                           <motion.div 
                                              initial={{ width: 0 }}
                                              animate={{ width: `${percentage}%` }}
                                              className="h-full bg-gold"
                                           />
                                        </div>
                                     </div>
                                   );
                                })}
                              </div>
                            </div>
                          )}

                          {q.type === 'image' && (
                               <div className="w-full aspect-[21/9] bg-paper flex items-center justify-center text-ink/10 border border-ink/5 hover:border-gold/20 transition-all overflow-hidden grayscale hover:grayscale-0">
                                  <ImageIcon size={64} strokeWidth={0.5} />
                               </div>
                          )}

                          {q.type === 'video' && (
                               <div className="w-full aspect-[21/9] bg-ink flex items-center justify-center text-paper border border-ink shadow-2xl relative overflow-hidden">
                                  <Video size={64} strokeWidth={0.5} />
                                  <div className="absolute inset-0 bg-gold/5 blur-3xl"></div>
                               </div>
                          )}

                          {(q.type === 'multiple_choice' || q.type === 'checkbox') && (
                            <div className="space-y-4 max-w-lg">
                              {q.options?.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-4 group/opt">
                                  <div className={`w-2 h-2 border border-ink/20 group-hover/opt:border-gold transition-all ${q.type === 'checkbox' ? '' : 'rounded-full'}`} />
                                  <input 
                                    value={opt} 
                                    onChange={e => {
                                      const newQs = [...form.questions];
                                      newQs[idx].options![oIdx] = e.target.value;
                                      setForm({ ...form, questions: newQs });
                                    }}
                                    className="flex-1 outline-none text-xs font-medium text-ink/60 uppercase tracking-widest border-b border-transparent focus:border-gold transition-all p-1 bg-transparent" 
                                  />
                                  {!isPreviewMobile && (
                                    <button onClick={() => {
                                        const newQs = [...form.questions];
                                        newQs[idx].options!.splice(oIdx, 1);
                                        setForm({ ...form, questions: newQs });
                                    }} className="text-ink/10 hover:text-red-500 transition-colors opacity-0 group-hover/opt:opacity-100"><X size={14} /></button>
                                  )}
                                </div>
                              ))}
                              {!isPreviewMobile && (
                                <button 
                                    onClick={() => {
                                        const newQs = [...form.questions];
                                        newQs[idx].options = [...(newQs[idx].options || []), `Concept ${newQs[idx].options!.length + 1}`];
                                        setForm({ ...form, questions: newQs });
                                    }}
                                    className="text-[10px] text-gold hover:text-ink font-bold uppercase tracking-widest transition-all mt-4 ml-6"
                                >
                                    + Ajouter une alternative
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {!isPreviewMobile && (
                        <div className="mt-12 pt-6 border-t border-ink/5 flex justify-between items-center">
                            <div className="flex items-center gap-8">
                                <button 
                                    onClick={() => {
                                        const newQs = [...form.questions];
                                        newQs[idx].required = !newQs[idx].required;
                                        setForm({ ...form, questions: newQs });
                                    }}
                                    className={`flex items-center gap-3 px-4 py-2 border transition-all ${
                                        q.required 
                                        ? 'bg-ink text-paper border-ink shadow-lg shadow-ink/20' 
                                        : 'bg-transparent text-ink/30 border-ink/10 hover:border-gold hover:text-gold'
                                    }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${q.required ? 'bg-gold animate-pulse' : 'bg-ink/20'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Réponse Obligatoire</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="p-2 text-ink/20 hover:text-ink transition-colors cursor-grab" title="Déplacer"><Menu size={16} /></button>
                                <button onClick={() => {
                                    const newQs = [...form.questions];
                                    newQs.splice(idx, 1);
                                    setForm({ ...form, questions: newQs });
                                }} className="p-2 text-ink/20 hover:text-red-600 transition-all" title="Supprimer"><Trash2 size={16} /></button>
                            </div>
                        </div>
                      )}
                    </Reorder.Item>
                  ))}
                  </Reorder.Group>

                  {/* Mobile Preview Submit button Mock */}
                  {isPreviewMobile && form.questions.length > 0 && (
                    <div className="px-6 pb-12 space-y-4">
                       {Object.keys(errors).length > 0 && (
                         <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center animate-bounce">
                           {Object.keys(errors).length} champ(s) nécessite(nt) votre attention
                         </div>
                       )}
                       <div className="flex gap-4">
                         <button 
                          onClick={handleSaveDraft}
                          className="flex-1 py-4 border border-ink/10 text-ink/40 text-[9px] font-bold uppercase tracking-[0.2em] hover:border-ink hover:text-ink transition-all"
                         >
                           Sauver Brouillon
                         </button>
                         <button 
                          onClick={loadDraft}
                          className="flex-1 py-4 border border-gold/20 text-gold text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-gold/5 transition-all"
                         >
                           Charger Brouillon
                         </button>
                       </div>
                       <button 
                        onClick={handleLiveSubmit}
                        className="w-full py-4 bg-gold text-white text-xs font-bold uppercase tracking-[0.3em] shadow-xl shadow-gold/20 hover:brightness-110 active:scale-95 transition-all"
                       >
                         Envoyer ma réponse Signée
                       </button>
                    </div>
                  )}

                  {/* Floating Action Menu Refined */}
                  {!isPreviewMobile && (
                    <div className="fixed bottom-12 right-12 flex flex-col gap-6">
                        <div className="flex flex-col gap-1 bg-ink p-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10">
                          <button onClick={() => addQuestion()} className="p-5 bg-gold text-white hover:brightness-110 active:scale-95 transition-all outline-none" title="Nouvelle Question"><Plus size={24} /></button>
                          <button onClick={() => addQuestion('poll')} className="p-4 text-paper/40 hover:text-paper hover:bg-white/5 transition-all outline-none" title="Sondage"><BarChart size={18} /></button>
                          <button onClick={() => addQuestion('image')} className="p-4 text-paper/40 hover:text-paper hover:bg-white/5 transition-all outline-none" title="Espace Image"><ImageIcon size={18} /></button>
                          <button onClick={() => addQuestion('video')} className="p-4 text-paper/40 hover:text-paper hover:bg-white/5 transition-all outline-none" title="Espace Vidéo"><Video size={18} /></button>
                        </div>
                    </div>
                  )}
                </motion.div>
              )}

            {activeSubTab === 'responses' && (
                <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {[
                        { label: 'Soumissions Totales', value: '128', sub: '+12% ce mois', icon: Users, color: 'text-gold' },
                        { label: 'Taux de Complétion', value: '84%', sub: 'Excellente performance', icon: Zap, color: 'text-ink' },
                        { label: 'Temps Moyen', value: '1m 24s', sub: 'Engagement fluide', icon: Clock, color: 'text-ink' },
                        { label: 'Points de Rebond', value: '4%', sub: 'Rétention haute', icon: AlertCircle, color: 'text-gold' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 border border-ink/5 shadow-sm group hover:border-gold/30 transition-all">
                           <div className="flex justify-between items-start mb-4">
                              <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">{stat.label}</p>
                              <stat.icon size={14} className={`${stat.color}/30 group-hover:${stat.color} transition-colors`} />
                           </div>
                           <h4 className="text-3xl font-serif italic text-ink">{stat.value}</h4>
                           <p className="text-[8px] font-bold text-gold uppercase tracking-widest mt-2">{stat.sub}</p>
                        </div>
                      ))}
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="bg-white p-10 border border-ink/5 shadow-sm">
                         <h3 className="text-xl font-serif italic mb-8 flex items-center gap-3">
                           <BarChart className="text-gold" size={20} />
                           Répartition des Réponses
                         </h3>
                         <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                               <PieChart>
                                  <Pie
                                     data={[
                                        { name: 'Elite', value: 45 },
                                        { name: 'Premium', value: 35 },
                                        { name: 'Standard', value: 20 },
                                     ]}
                                     cx="50%"
                                     cy="50%"
                                     innerRadius={60}
                                     outerRadius={80}
                                     paddingAngle={5}
                                     dataKey="value"
                                  >
                                     <Cell fill="#D4AF37" />
                                     <Cell fill="#1A1A1A" />
                                     <Cell fill="#A5A5A5" />
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{ background: '#1A1A1A', border: 'none', color: '#FFF', fontSize: '10px', textTransform: 'uppercase' }}
                                    itemStyle={{ color: '#D4AF37' }}
                                  />
                               </PieChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="mt-6 flex justify-center gap-8">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-gold" /> <span className="text-[8px] font-bold uppercase tracking-widest">Elite (45%)</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-ink" /> <span className="text-[8px] font-bold uppercase tracking-widest">Premium (35%)</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-400" /> <span className="text-[8px] font-bold uppercase tracking-widest">Standard (20%)</span></div>
                         </div>
                      </div>

                      <div className="bg-white p-10 border border-ink/5 shadow-sm">
                         <h3 className="text-xl font-serif italic mb-8 flex items-center gap-3">
                           <Monitor className="text-gold" size={20} />
                           Engagement Hebdomadaire
                         </h3>
                         <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                               <AreaChart data={[
                                  { day: 'Lun', views: 400, conv: 240 },
                                  { day: 'Mar', views: 300, conv: 139 },
                                  { day: 'Mer', views: 200, conv: 980 },
                                  { day: 'Jeu', views: 278, conv: 390 },
                                  { day: 'Ven', views: 189, conv: 480 },
                                  { day: 'Sam', views: 239, conv: 380 },
                                  { day: 'Dim', views: 349, conv: 430 },
                               ]}>
                                  <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                  <YAxis hide />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="views" stroke="#D4AF37" fillOpacity={1} fill="url(#colorViews)" />
                               </AreaChart>
                            </ResponsiveContainer>
                         </div>
                      </div>
                   </div>

                   <div className="bg-zinc-900 p-12 text-paper shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                         <LucideFilter className="absolute -right-20 -bottom-20 rotate-12" size={300} />
                      </div>
                      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-6">
                            <h3 className="text-2xl font-serif italic text-gold">Données Géographiques Respondents</h3>
                            <div className="space-y-4">
                               {[
                                 { country: 'France', percentage: 65, city: 'Paris, Lyon, Marseille' },
                                 { country: 'Belgique', percentage: 15, city: 'Bruxelles, Anvers' },
                                 { country: 'Suisse', percentage: 12, city: 'Genève, Lausanne' },
                                 { country: 'Canada', percentage: 8, city: 'Montréal, Québec' },
                               ].map((geo, i) => (
                                 <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                       <span>{geo.country} <span className="text-paper/30 ml-2 font-light italic">({geo.city})</span></span>
                                       <span className="text-gold tabular-nums">{geo.percentage}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-paper/10 overflow-hidden">
                                       <motion.div 
                                          initial={{ width: 0 }}
                                          whileInView={{ width: `${geo.percentage}%` }}
                                          className="h-full bg-gold"
                                       />
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                            <div className="bg-white/5 border border-white/10 p-8 flex flex-col justify-center text-center space-y-4">
                            <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Insights Signature</p>
                            <p className="text-sm font-light italic leading-relaxed">"Votre audience est majoritairement européenne. Le pic d'activité est enregistré le mercredi soir à 21h00 CET."</p>
                            <button 
                                onClick={() => alert('Génération du rapport PDF en cours...')}
                                className="text-[9px] font-bold uppercase tracking-widest text-paper/40 hover:text-white transition-colors"
                            >
                                Générer un rapport complet PDF
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-10 border border-ink/5 shadow-sm">
                      <div className="flex justify-between items-center mb-10 border-b border-ink/5 pb-6">
                         <h3 className="text-xl font-serif italic">Flux des Dernières Réponses</h3>
                         <button className="text-[9px] font-bold text-gold uppercase tracking-widest border border-gold/20 px-4 py-2 hover:bg-gold hover:text-white transition-all">Exporter CSV</button>
                      </div>
                      <div className="space-y-6">
                        {[
                          { name: 'Jean D.', email: 'jean@luxury.fr', date: 'Il y a 10 min', status: 'Nouveau' },
                          { name: 'Sarah M.', email: 'sarah@coach.com', date: 'Il y a 2h', status: 'Traité' },
                          { name: 'Marc L.', email: 'marc@immobilier.be', date: 'Hier', status: 'Traité' },
                        ].map((resp, i) => (
                          <div key={i} className="flex justify-between items-center p-4 hover:bg-paper transition-all group">
                             <div className="flex gap-6 items-center">
                                <div className="w-12 h-12 bg-ink/5 flex items-center justify-center font-serif italic text-xl border border-ink/5">{resp.name[0]}</div>
                                <div>
                                   <p className="text-sm font-serif italic text-ink">{resp.name}</p>
                                   <p className="text-[9px] text-ink/30 font-bold uppercase tracking-widest">{resp.email}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[9px] text-ink/30 font-bold uppercase tracking-widest mb-1">{resp.date}</p>
                                <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 ${resp.status === 'Nouveau' ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'bg-ink/5 text-ink/30'}`}>{resp.status}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeSubTab === 'settings' && (
                <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-12">
                   <div className="bg-white p-12 border border-ink/5 shadow-sm space-y-10">
                      <h3 className="text-2xl font-serif italic border-b border-ink/5 pb-6">Règles de Collecte</h3>
                      <div className="space-y-8">
                         {[
                           { key: 'collectEmails', label: 'Capture Automatique du Courriel', desc: 'Identifie vos visiteurs dès l\'ouverture.' },
                           { key: 'limitToOneResponse', label: 'Exclusivité de Réponse', desc: 'Une seule soumission par identifiant unique.' },
                           { key: 'showProgressBar', label: 'Barre de Progression Active', desc: 'Encouragez la complétion par l\'aspect visuel.' },
                         ].map(setting => (
                           <div key={setting.key} className="flex justify-between items-start">
                              <div className="space-y-1">
                                 <p className="text-sm font-medium text-ink">{setting.label}</p>
                                 <p className="text-[10px] text-ink/40 font-light italic">{setting.desc}</p>
                              </div>
                              <button 
                                onClick={() => setForm({ ...form, settings: { ...form.settings, [setting.key]: !(form.settings as any)[setting.key] } })}
                                className={`w-12 h-6 rounded-full relative transition-all ${ (form.settings as any)[setting.key] ? 'bg-gold' : 'bg-ink/10' }`}
                              >
                                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ (form.settings as any)[setting.key] ? 'right-1' : 'left-1' }`} />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-zinc-900 p-12 text-paper shadow-2xl space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Shield size={100} strokeWidth={0.5} />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-serif italic text-gold">Conformité RGPD Excellence</h3>
                        <p className="text-paper/40 text-[10px] uppercase tracking-[0.3em] mb-8 mt-2">Standard de Protection Européen</p>
                        
                        <div className="flex items-center gap-6 bg-paper/5 p-6 border border-paper/10">
                           <input type="checkbox" className="w-5 h-5 accent-gold border-gold" defaultChecked />
                           <p className="text-[10px] text-paper/70 font-light leading-relaxed italic">
                             En activant ce module, vous garantissez que chaque soumission inclut un consentement explicite. Vos clients pourront demander l'effacement de leurs traces via l'onglet <strong>Confidentialité</strong> de votre plateforme.
                           </p>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
  );
};

const Lexicon = () => (
  <div className="p-16 max-w-6xl mx-auto space-y-16">
    <div className="text-center space-y-6">
      <div className="inline-flex p-4 bg-ink text-paper rounded-none mb-4 rotate-12">
        <BookOpen size={36} strokeWidth={1} />
      </div>
      <h1 className="text-5xl font-light italic text-ink tracking-tight">Lexique Signature</h1>
      <p className="text-lg text-ink/40 max-w-xl mx-auto font-light leading-relaxed uppercase tracking-widest text-xs">Une nomenclature technologique exclusive pour vos ambitions les plus hautes.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {Object.entries(LEXICON).map(([key, value], idx) => (
        <motion.div 
           key={key}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: idx * 0.05 }}
           className="bg-white p-10 rounded-none border border-ink/5 hover:border-gold/20 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 -translate-y-10 translate-x-10 rotate-45 group-hover:bg-gold/10 transition-colors"></div>
          <div className="flex gap-8 items-start">
            <div className="text-gold group-hover:scale-110 transition-transform duration-500 shrink-0">
                {key === 'dashboard' && <LayoutDashboard size={28} strokeWidth={1}/>}
                {key === 'contacts' && <Users size={28} strokeWidth={1}/>}
                {key === 'funnels' && <Filter size={28} strokeWidth={1}/>}
                {key === 'emails' && <Mail size={28} strokeWidth={1}/>}
                {key === 'automations' && <Zap size={28} strokeWidth={1}/>}
                {key === 'sales' && <ShoppingBag size={28} strokeWidth={1}/>}
                {key === 'forms' && <FileText size={28} strokeWidth={1}/>}
                {key === 'privacy' && <ShieldCheck size={28} strokeWidth={1}/>}
                {key === 'sorting' && <Tag size={28} strokeWidth={1}/>}
                {key === 'social' && <Share2 size={28} strokeWidth={1}/>}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-ink uppercase tracking-[0.2em]">{value.title}</h3>
              <p className="text-ink/60 leading-relaxed font-light text-sm italic">{value.description}</p>
              <div className="w-12 h-[1px] bg-gold/30 group-hover:w-full transition-all duration-700"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const GDPRSection = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<null | 'success'>(null);

    const handleDelete = async () => {
        if (!email) return;
        try {
            // Check if contact exists
            const q = query(collection(db, 'contacts'), where('email', '==', email));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                snapshot.forEach(async (docSnap) => {
                    await deleteDoc(doc(db, 'contacts', docSnap.id));
                });
            }
            setStatus('success');
            setTimeout(() => setStatus(null), 3000);
            setEmail('');
        } catch (e) {
            console.error("Error deleting contact:", e);
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="p-20 max-w-4xl mx-auto space-y-20 font-serif">
            <div className="space-y-4 text-center">
                <h1 className="text-5xl font-light italic text-ink tracking-tight">Confidentialité de Prestige</h1>
                <p className="text-ink/40 font-light text-xs uppercase tracking-[0.3em]">Engagement d'Excellence et Conformité Européenne</p>
            </div>

            <div className="space-y-16">
                <div className="bg-white border-l-4 border-gold p-12 space-y-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShieldCheck size={120} strokeWidth={0.5} />
                    </div>
                    <h2 className="text-3xl font-light italic text-ink flex items-center gap-4">
                        Éthique des Données
                    </h2>
                    <ul className="space-y-6 text-ink/70 font-sans text-sm tracking-wide leading-loose">
                        <li className="flex gap-4">
                            <span className="text-gold font-bold">I.</span> 
                            <span>Souveraineté Totale : Vos données sont votre patrimoine. Nous ne les échangeons jamais contre des actifs tiers.</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-gold font-bold">II.</span> 
                            <span>Discrétion Absolue : Seule votre autorité administrative possède un droit de regard sur votre écosystème.</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-gold font-bold">III.</span> 
                            <span>Droit à l'Oubli Immédiat : La suppression est un acte de liberté fondamentale traité sans délai.</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-ink p-16 text-paper space-y-10 relative">
                    <div>
                        <h3 className="text-2xl font-light italic text-paper tracking-tight">Protocole de Suppression de Contact</h3>
                        <p className="text-paper/40 text-[10px] uppercase tracking-[0.2em] mt-2">Effacement définitif de l'empreinte numérique</p>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="relative">
                            <input 
                              placeholder="IDENTIFIANT@DOMAIN.PRO" 
                              className={`w-full bg-transparent border-b py-4 text-xs font-bold uppercase tracking-widest outline-none transition-all text-paper placeholder:text-paper/10 ${
                                  email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-red-500' : 'border-paper/10 focus:border-gold'
                              }`}
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleDelete()}
                              />
                            {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                                <span className="absolute right-0 top-4 text-[8px] text-red-500 font-bold uppercase tracking-widest">Email Invalide</span>
                            )}
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <button 
                            onClick={handleDelete}
                            disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                            className="flex-1 px-12 py-4 bg-gold text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-2xl disabled:opacity-30"
                            >
                                Exécuter l'effacement
                            </button>
                            <button 
                            className="px-12 py-4 border border-paper/20 hover:border-gold text-paper text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                            onClick={() => alert('Compilation de l\'archive de portabilité en cours. Vous recevrez un lien par courriel.')}
                            >
                                <Download size={14} /> Télécharger mes données
                            </button>
                        </div>
                    </div>
                    {status === 'success' && (
                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-gold font-bold text-xs uppercase tracking-widest mt-6">
                             Action confirmée : Données révoquées selon le standard RGPD.
                        </motion.p>
                    )}
                </div>
            </div>
        </div>
    );
};

const AIAssistant = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<{role: 'u'|'a', text: string}[]>([
        { role: 'a', text: 'Bienvenue au Concierge Digital. Je suis votre guide exclusif. L\'Édition Conciergerie est mon service premium : nous gérons votre technique pour que vous restiez dans votre zone de génie.' }
    ]);
    const [loading, setLoading] = useState(false);

    const suggestActions = [
        "C'est quoi la Conciergerie ?",
        "Comment créer un tunnel ?",
        "Optimiser mes formulaires",
        "Vérifier mon audience"
    ];

    const handleSend = async (text?: string) => {
        const uMsg = text || query;
        if (!uMsg.trim()) return;
        
        setMessages(prev => [...prev, { role: 'u', text: uMsg }]);
        setQuery('');
        setLoading(true);

        const response = await getAIAssistantResponse(uMsg);
        setMessages(prev => [...prev, { role: 'a', text: response }]);
        setLoading(false);
    };

    return (
        <div className="w-80 border-l border-ink/5 bg-white flex flex-col hidden xl:flex shadow-2xl">
             <div className="p-8 border-b border-ink/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-ink text-gold rounded-full ring-4 ring-gold/5">
                        <Sparkles size={18} />
                    </div>
                    <span className="font-serif italic font-bold text-ink text-lg tracking-tight">Concierge IA</span>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                 {messages.map((m, idx) => (
                     <div key={idx} className={`p-4 rounded-none border ${m.role === 'u' ? 'bg-ink text-paper border-ink italic ml-4' : 'bg-transparent text-ink border-ink/10 mr-4 font-serif leading-relaxed'}`}>
                         {m.text}
                     </div>
                 ))}
                 {loading && <div className="text-gold italic text-xs animate-pulse font-serif px-2">Réflexion de votre Concierge...</div>}
                 
                 {!loading && (
                     <div className="flex flex-wrap gap-2 pt-4">
                        {suggestActions.map((action, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSend(action)}
                                className="text-[9px] font-bold uppercase tracking-widest p-2 border border-ink/10 hover:border-gold hover:text-gold transition-all"
                            >
                                {action}
                            </button>
                        ))}
                     </div>
                 )}
             </div>
             <div className="p-6 bg-paper">
                 <div className="relative group">
                    <input 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="POSER UNE QUESTION À VOTRE GUIDE..." 
                        className="w-full pl-0 pr-10 py-4 bg-transparent border-b border-ink/10 outline-none text-[10px] font-bold uppercase tracking-[0.1em] focus:border-gold transition-all"
                    />
                    <button onClick={() => handleSend()} className="absolute right-0 top-3 text-gold hover:text-ink transition-colors">
                        <ArrowRight size={20} />
                    </button>
                 </div>
             </div>
        </div>
    );
};

// --- Main App ---

const EmailSection = () => {
  const campaignTemplates = [
    { title: "Relance Abandon Panier", description: "Envoyé 2h après le départ.", color: "border-red-400" },
    { title: "Séquence de Bienvenue", description: "3 emails sur 5 jours.", color: "border-green-400" },
    { title: "Offre Flash VIP", description: "Diffusion immédiate.", color: "border-gold" },
  ];

  const [sortSource, setSortSource] = useState('All');

  return (
  <div className="p-16 max-w-6xl mx-auto space-y-16">
    <div className="flex justify-between items-end border-b border-ink/10 pb-8">
      <div className="space-y-1">
        <h1 className="text-5xl font-light italic text-ink tracking-tight">Courrier de Prestige</h1>
        <p className="text-ink/40 text-[10px] font-bold uppercase tracking-[0.3em]">Gestion des Diffusions et Brouillons</p>
      </div>
      <div className="flex gap-4">
        <select 
          value={sortSource}
          onChange={(e) => setSortSource(e.target.value)}
          className="bg-paper border border-ink/5 px-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-gold appearance-none cursor-pointer"
        >
          <option value="All">Tout Trier</option>
          <option value="Newsletter">Newsletter</option>
          <option value="Cadeau">Cadeau</option>
        </select>
        <button className="px-10 py-4 bg-ink text-paper text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">Nouvelle Campagne</button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-ink/30 border-b border-ink/5 pb-4">
            <Clock size={14} /> Brouillons en cours de rédaction
          </div>
           <div className="bg-white dark:bg-ink/20 p-20 border-2 border-dashed border-ink/5 flex flex-col items-center justify-center space-y-6">
              <Mail size={48} strokeWidth={0.5} className="text-ink/10" />
              <p className="text-ink/30 text-[10px] uppercase font-bold tracking-[0.3em]">Aucun brouillon de diffusion</p>
              <button className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] underline decoration-gold/20 underline-offset-8">Rédiger votre premier bulletin</button>
           </div>

           <div className="pt-12 space-y-8">
             <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-ink/30 border-b border-ink/5 pb-4">
               <Zap size={14} /> Modèles de Campagnes Stratégiques
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaignTemplates.map((template, i) => (
                  <div key={i} className={`bg-white border-l-4 ${template.color} p-6 shadow-sm hover:scale-[1.02] transition-all cursor-pointer`}>
                      <h4 className="text-ink font-serif italic text-lg">{template.title}</h4>
                      <p className="text-[10px] text-ink/40 uppercase tracking-widest mt-1">{template.description}</p>
                  </div>
                ))}
             </div>
           </div>
      </div>

      <div className="space-y-8">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-ink/30 border-b border-ink/5 pb-4">
            <Tag size={14} /> Segmentation et Tri (Source)
          </div>
          <div className="bg-ink p-8 space-y-6">
              <p className="text-paper/60 text-xs font-light leading-relaxed italic">"Le tri automatique permet de diviser vos contacts selon leur porte d'entrée. Une personne inscrite via 'Cadeau' recevra un discours différent de celle de la 'Newsletter'."</p>
              <div className="space-y-3">
                 {[
                   { label: "Source: Newsletter", count: 842, color: "bg-blue-400" },
                   { label: "Source: Gagne un cadeau", count: 312, color: "bg-gold" },
                   { label: "Source: Sondage", count: 80, color: "bg-green-400" },
                 ].map((seg, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${seg.color}`} />
                           <span className="text-[10px] text-paper/80 font-bold uppercase tracking-widest">{seg.label}</span>
                        </div>
                        <span className="text-[10px] text-paper/30 font-mono tabular-nums">{seg.count}</span>
                    </div>
                 ))}
              </div>
              <button className="w-full py-3 border border-paper/10 text-paper text-[9px] font-bold uppercase tracking-widest hover:border-gold transition-colors">+ Définir un nouveau critère</button>
          </div>
      </div>
    </div>
  </div>
);
};

const navStructure: Record<string, { label: string; icon: any; items: { id: string; label: string }[] }> = {
  crm: {
    label: 'CRM',
    icon: Users,
    items: [
      { id: 'contacts', label: 'Contacts' },
      { id: 'tags', label: 'Étiquettes' },
      { id: 'pipelines', label: 'Pipelines' },
      { id: 'calendar', label: 'Calendrier' },
      { id: 'privilege_card', label: 'Carte Privilège' },
    ]
  },
  site: {
    label: 'Site',
    icon: Filter,
    items: [
      { id: 'website', label: 'Site Web' },
      { id: 'funnels', label: 'Tunnels' },
      { id: 'creator_page', label: 'Page Créateur' },
      { id: 'blogs', label: 'Blogs' },
      { id: 'faq', label: 'FAQ' },
    ]
  },
  emails: {
    label: 'Courriels',
    icon: Mail,
    items: [
      { id: 'newsletters', label: 'Bulletins' },
      { id: 'campaigns', label: 'Campagnes' },
      { id: 'statistics', label: 'Statistiques' },
    ]
  },
  automations: {
    label: 'Automatisation',
    icon: Zap,
    items: [
      { id: 'rules', label: 'Règles' },
      { id: 'workflows', label: 'Workflows' },
    ]
  },
  sales: {
    label: 'Ventes',
    icon: ShoppingBag,
    items: [
      { id: 'orders', label: 'Commandes' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'subscriptions', label: 'Abonnements' },
      { id: 'offer_links', label: 'Liens d\'Offre' },
    ]
  },
  resources: {
    label: 'Actif',
    icon: BookOpen,
    items: [
      { id: 'physical_products', label: 'Pr. Physiques' },
      { id: 'promo_codes', label: 'Code Promo' },
      { id: 'courses', label: 'Formation' },
      { id: 'communities', label: 'Communautés' },
      { id: 'files', label: 'Fichiers' },
    ]
  }
};

const OfferLinkGenerator = () => {
    const [offerName, setOfferName] = useState('');
    const [price, setPrice] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');

    const handleGenerate = () => {
        if (!offerName || !price) return;
        const slug = offerName.toLowerCase().replace(/ /g, '-');
        setGeneratedLink(`https://empire.prestige/checkout/${slug}?p=${price}&ref=lp`);
    };

    return (
        <div className="p-16 max-w-4xl mx-auto space-y-16">
            <div className="space-y-4">
                <h1 className="text-5xl font-light italic text-ink tracking-tight">Générateur de Liens d'Offre</h1>
                <p className="text-ink/40 text-[10px] font-bold uppercase tracking-[0.3em]">Créez des accès directs pour vos actifs de prestige</p>
            </div>

            <div className="bg-white border-l-8 border-gold p-12 space-y-10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">Nom de l'Offre</label>
                        <input 
                            placeholder="Ex: Coaching Excellence 2024"
                            className="w-full bg-transparent border-b border-ink/10 py-3 text-sm italic font-serif outline-none focus:border-gold transition-all"
                            value={offerName}
                            onChange={e => setOfferName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 group relative">
                        <label className="text-[10px] font-bold text-ink/30 uppercase tracking-widest flex justify-between">
                            Tarif (€)
                        </label>
                        <input 
                            placeholder="Ex: 5000"
                            type="number"
                            className="w-full bg-transparent border-b border-ink/10 py-3 text-sm italic font-serif outline-none focus:border-gold transition-all"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                        <button 
                            onClick={handleGenerate}
                            className="absolute right-0 bottom-3 text-[9px] font-bold text-gold uppercase tracking-tighter hover:brightness-125 underline decoration-gold/30"
                        >
                            + Ajouter le prix au lien
                        </button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleGenerate}
                        className="flex-1 px-12 py-5 bg-ink text-paper text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        Générer le Lien de Signature
                    </button>
                    <button 
                        disabled={!generatedLink}
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: offerName,
                                    url: generatedLink
                                });
                            } else {
                                navigator.clipboard.writeText(generatedLink);
                                alert('Lien copié (Partage direct via presse-papier)');
                            }
                        }}
                        className={`px-8 py-5 border ${generatedLink ? 'border-gold text-gold hover:bg-gold/5' : 'border-ink/5 text-ink/20'} text-[10px] font-bold uppercase tracking-[0.3em] transition-all`}
                    >
                        Partager cette offre direct
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {generatedLink && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900 p-12 text-paper space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <LinkIcon size={120} strokeWidth={0.5} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gold/20 flex items-center justify-center border border-gold/40">
                                    <Sparkles className="text-gold" size={20} />
                                </div>
                                <h3 className="text-xl font-serif italic">Lien Prêt à Diffuser</h3>
                            </div>
                            <div className="bg-paper/5 border border-paper/10 p-6 flex justify-between items-center group">
                                <code className="text-xs font-mono text-gold/80 overflow-hidden text-ellipsis whitespace-nowrap mr-4">
                                    {generatedLink}
                                </code>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedLink);
                                        alert('Lien copié.');
                                    }}
                                    className="p-3 bg-gold text-white hover:brightness-110 shadow-lg shadow-gold/20 transition-all shrink-0"
                                >
                                    <Share2 size={16} />
                                </button>
                            </div>
                            <p className="text-[9px] text-paper/30 font-bold uppercase tracking-widest">Le lien inclut automatiquement votre identifiant de Membre Privilège.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Advanced Modules Implementation ---

const ModuleHeader = ({ title, subtitle, actionLabel, onAction, extraActions }: { title: string, subtitle: string, actionLabel?: string, onAction?: () => void, extraActions?: React.ReactNode }) => (
    <header className="flex justify-between items-end border-b border-ink/10 pb-8 mb-12">
        <div className="space-y-1">
            <h1 className="text-5xl font-light italic text-ink tracking-tight">{title}</h1>
            <p className="text-ink/40 text-[10px] font-bold uppercase tracking-[0.3em]">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
            {extraActions}
            {actionLabel && (
                <button 
                    onClick={onAction}
                    className="px-10 py-4 bg-ink text-paper text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus size={14} /> {actionLabel}
                </button>
            )}
        </div>
    </header>
);

const ContactsManager = () => {
    const [contacts, setContacts] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'contacts'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setContacts(data);
        }, (error) => {
            console.error("Firestore error:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
            try {
                await deleteDoc(doc(db, 'contacts', id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const exportToCSV = () => {
        const headers = ["ID", "Name", "Email", "Status", "Value", "Date"];
        const csvContent = [
            headers.join(","),
            ...contacts.map(c => [c.id, `"${c.name}"`, `"${c.email}"`, `"${c.status}"`, `"${c.value}"`, `"${c.date}"`].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "contacts_export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-16 max-w-7xl mx-auto">
            <ModuleHeader 
                title="Répertoire Élite" 
                subtitle="Base de données réelle synchronisée (Automatisé)" 
                actionLabel="Inscrire un Contact Manuellement"
                onAction={() => {
                   const email = prompt("Adresse courriel du contact :");
                   if (email) {
                      setDoc(doc(collection(db, 'contacts')), {
                         name: "Nouveau Contact",
                         email: email,
                         status: "Prospect",
                         value: "€0",
                         date: new Date().toLocaleDateString('fr-FR'),
                         createdAt: serverTimestamp()
                      });
                   }
                }}
                extraActions={
                    <button 
                        onClick={exportToCSV}
                        className="px-6 py-4 border border-ink/10 text-ink text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-paper transition-all flex items-center gap-2"
                    >
                        Export CSV
                    </button>
                }
            />
            <div className="bg-white border border-ink/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-paper border-b border-ink/5">
                        <tr>
                            {["Identité", "Statut", "Valeur Totale", "Dernier Contact", "Actions"].map(h => (
                                <th key={h} className="p-6 text-[9px] font-bold text-ink/30 uppercase tracking-widest">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                        {contacts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-ink/40 text-xs italic font-serif">Aucun contact trouvé. Partagez votre formulaire.</td>
                            </tr>
                        )}
                        {contacts.map(c => (
                            <tr key={c.id} className="group hover:bg-paper/50 transition-colors">
                                <td className="p-6">
                                    <p className="font-serif italic text-ink">{c.name}</p>
                                    <p className="text-[10px] text-ink/40 font-bold uppercase tracking-tighter">{c.email}</p>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${c.status === 'VIP' ? 'bg-gold/10 text-gold' : 'bg-ink/5 text-ink/30'}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="p-6 text-sm font-light text-ink tabular-nums">{c.value}</td>
                                <td className="p-6 text-[10px] text-ink/30 font-bold">{c.date}</td>
                                <td className="p-6 flex items-center gap-4 text-gold cursor-pointer">
                                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                    <button onClick={(e) => handleDelete(c.id, e)} className="text-ink/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"><Trash2 size={14}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PipelineManager = () => {
    const columns = [
        { id: 'lead', title: 'Intentions', icon: Sparkles, count: 0 },
        { id: 'meeting', title: 'Consultations', icon: Clock, count: 0 },
        { id: 'negotiation', title: 'Propositions', icon: FileText, count: 0 },
        { id: 'won', title: 'Signatures', icon: CheckCircle2, count: 0 },
    ];

    return (
        <div className="p-16 max-w-7xl mx-auto">
            <ModuleHeader title="Pipelines de Signature" subtitle="Orchestration visuelle de vos flux de vente" actionLabel="Créer un Deal" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {columns.map(col => (
                    <div key={col.id} className="space-y-6">
                        <div className="flex justify-between items-center bg-white border-l-4 border-gold p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <col.icon size={14} className="text-gold" />
                                <h3 className="text-[10px] font-bold text-ink uppercase tracking-widest">{col.title}</h3>
                            </div>
                            <span className="text-[10px] font-mono text-ink/20 font-bold italic">{col.count}</span>
                        </div>
                        <div className="bg-paper/30 border border-dashed border-ink/5 rounded-none min-h-[500px] p-2 space-y-4">
                            {/* Empty Pipeline Column */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MarketingAnalytics = () => (
    <div className="p-16 max-w-7xl mx-auto space-y-12">
        <ModuleHeader title="Analytique Profonde" subtitle="Décodage de l'engagement et santé de votre écosystème" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2 bg-white p-12 border border-ink/5 shadow-sm space-y-8">
                <h3 className="text-xl font-serif italic flex items-center gap-3">
                    <TrendingUp className="text-gold" size={20} />
                    Dynamique de Croissance
                </h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { date: 'Mars', count: 0 },
                            { date: 'Avril', count: 0 },
                            { date: 'Mai', count: 0 },
                            { date: 'Juin', count: 0 },
                        ]}>
                            <XAxis dataKey="date" axisLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                            <YAxis hide />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.05} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-ink text-paper p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                    <TrendingUp size={200} />
                </div>
                <div className="space-y-6 relative z-10">
                    <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Score de Signature</p>
                    <h4 className="text-7xl font-serif italic">N/A</h4>
                    <p className="text-xs text-paper/40 italic leading-relaxed">"Votre écosystème est encore vierge. Démarrez l'acquisition pour construire des métriques."</p>
                </div>
                <button className="text-[9px] font-bold text-white uppercase tracking-widest border border-white/20 p-4 hover:bg-gold hover:border-gold transition-all">Consulter l'Audit Complet</button>
            </div>
        </div>

        <div className="bg-white p-12 border border-ink/5 shadow-sm space-y-8 mt-12 group hover:border-gold/30 transition-all">
            <div className="flex justify-between items-end">
                <h3 className="text-xl font-serif italic flex items-center gap-3 text-ink">
                    <AlertCircle className="text-red-500/80" size={20} />
                    Rapport d'Anomalies & Erreurs Techniques
                </h3>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">Taux de Succès Actuel</p>
                    <p className="text-2xl font-serif italic text-ink">100%</p>
                </div>
            </div>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={[
                        { day: 'Lun', errors: 0 },
                        { day: 'Mar', errors: 0 },
                        { day: 'Mer', errors: 0 },
                        { day: 'Jeu', errors: 0 },
                        { day: 'Ven', errors: 0 },
                        { day: 'Sam', errors: 0 },
                        { day: 'Dim', errors: 0 },
                    ]}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                        <YAxis hide />
                        <Tooltip 
                           cursor={{fill: '#000', opacity: 0.02}}
                           contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FFF', fontSize: '12px' }} 
                        />
                        <Bar 
                           dataKey="errors" 
                           fill="#ef4444" 
                           radius={[2, 2, 0, 0]} 
                           fillOpacity={0.8}
                        />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-ink/50 italic font-light pt-4 border-t border-ink/5">
                Aucune anomalie détectée sur la plateforme.
            </p>
        </div>
    </div>
);

const OrdersManager = () => {
    const orders: any[] = [];

    return (
        <div className="p-16 max-w-7xl mx-auto">
            <ModuleHeader title="Flux de Commandes" subtitle="Suivi chirurgical de vos transactions sortantes" />
            <div className="bg-white border border-ink/5">
                {orders.length === 0 ? (
                    <div className="p-12 text-center text-ink/40 text-[10px] font-serif italic border-b border-ink/5">
                        Aucune commande enregistrée
                    </div>
                ) : (
                    orders.map((order, i) => (
                        <div key={i} className="p-8 flex justify-between items-center hover:bg-paper transition-all group border-b border-ink/5 last:border-0">
                        <div className="flex gap-10 items-center">
                            <div className="text-[10px] font-mono font-bold text-ink/20">{order.id}</div>
                            <div>
                                <p className="font-serif italic text-ink">{order.client}</p>
                                <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{order.offer}</p>
                            </div>
                        </div>
                        <div className="flex gap-16 items-center">
                            <div className="text-right">
                                <p className="text-sm font-light tabular-nums">{order.price}</p>
                                <p className="text-[8px] text-ink/30 font-bold uppercase tracking-tighter">{order.date}</p>
                            </div>
                            <div className={`px-4 py-1 text-[8px] font-bold uppercase tracking-widest ${order.status === 'Accordé' ? 'bg-gold text-white' : 'bg-ink text-paper'}`}>
                                {order.status}
                            </div>
                        </div>
                    </div>
                ))
                )}
            </div>
        </div>
    );
};

const SubscriptionsManager = () => (
    <div className="p-16 max-w-7xl mx-auto space-y-12">
        <ModuleHeader title="Revenus Récurrents" subtitle="Socle de stabilité de votre empire digital" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-l-4 border-gold p-10 shadow-sm space-y-4">
                <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">MRR (Mensuel)</p>
                <h4 className="text-4xl font-serif italic text-ink">€0</h4>
                <div className="flex items-center gap-2 text-ink/30">
                    <TrendingUp size={12} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">-</span>
                </div>
            </div>
            <div className="bg-white border-l-4 border-ink p-10 shadow-sm space-y-4">
                <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">Abonnés Actifs</p>
                <h4 className="text-4xl font-serif italic text-ink">0</h4>
                <p className="text-[8px] text-ink/30 font-bold uppercase tracking-widest">Churn Rate: 0.0%</p>
            </div>
            <div className="bg-ink p-10 shadow-2xl flex flex-col justify-center text-center space-y-4">
                <p className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]">Signature LTV</p>
                <p className="text-paper text-2xl font-serif italic">€0 / Client</p>
            </div>
        </div>
    </div>
);

const AutomationManager = () => {
    const rules: any[] = [];

    return (
        <div className="p-16 max-w-7xl mx-auto">
            <ModuleHeader title="Moteurs d'Automatisme" subtitle="La technologie au service de votre temps" actionLabel="Nouvelle Règle" />
            <div className="space-y-6">
                {rules.length === 0 && (
                    <div className="p-12 text-center text-ink/40 text-[10px] font-serif italic border border-ink/5">
                        Aucune règle configurée
                    </div>
                )}
                {rules.map(rule => (
                    <div key={rule.id} className="bg-white p-8 border border-ink/5 flex items-center justify-between group hover:border-gold/30 transition-all">
                        <div className="flex gap-12 items-center">
                            <div className={`p-4 ${rule.status ? 'bg-gold/10 text-gold' : 'bg-ink/5 text-ink/20'} transition-all`}>
                                <Zap size={20} strokeWidth={1} />
                            </div>
                            <div className="flex items-center gap-8">
                                <div>
                                    <p className="text-[8px] font-bold text-ink/30 uppercase tracking-widest mb-1">Si l'événement survient</p>
                                    <p className="text-sm font-serif italic text-ink">{rule.trigger}</p>
                                </div>
                                <ArrowRight size={16} className="text-ink/10" />
                                <div>
                                    <p className="text-[8px] font-bold text-ink/30 uppercase tracking-widest mb-1">Alors exécuter</p>
                                    <p className="text-sm font-serif italic text-ink">{rule.action}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                             <div className={`p-1.5 rounded-full ${rule.status ? 'bg-green-500' : 'bg-ink/10'}`}></div>
                             <button className="text-[9px] font-bold text-ink/20 hover:text-red-500 transition-colors uppercase tracking-widest">Configurer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TagsManager = () => (
    <div className="p-16 max-w-5xl mx-auto space-y-12">
        <ModuleHeader title="Segmentation par Étiquette" subtitle="Organisez votre empire par comportements" actionLabel="Créer un Tag" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {([] as string[]).map(tag => (
                <div key={tag} className="p-6 bg-white border border-ink/5 flex justify-between items-center group hover:bg-gold hover:text-white transition-all cursor-pointer">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                    <Tag size={12} className="text-gold group-hover:text-white" />
                </div>
            ))}
        </div>
    </div>
);

const CalendarManager = () => (
    <div className="p-16 max-w-7xl mx-auto space-y-12">
        <ModuleHeader title="Synchronisation Temporelle" subtitle="Gestion de vos sessions de coaching de haut vol" actionLabel="Nouvelle Disponibilité" />
        <div className="bg-white border border-ink/5 p-10 grid grid-cols-7 gap-px bg-ink/5">
            {["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"].map(d => (
                <div key={d} className="bg-paper p-4 text-[9px] font-bold text-ink/30 text-center tracking-widest uppercase">{d}</div>
            ))}
            {Array.from({length: 31}).map((_, i) => (
                <div key={i} className="bg-white min-h-[120px] p-4 border border-ink/5 hover:bg-paper transition-all relative group cursor-pointer">
                    <span className="text-xs font-serif italic text-ink/20">{i+1}</span>
                    {i === 12 && (
                        <div className="mt-4 p-2 bg-gold/10 border-l-2 border-gold space-y-1">
                            <p className="text-[8px] font-bold text-gold uppercase tracking-tighter">Coaching VIP</p>
                            <p className="text-[7px] text-gold/60 font-medium">14:00 - 15:30</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const TransactionsManager = () => (
    <div className="p-16 max-w-7xl mx-auto">
        <ModuleHeader title="Mouvements de Fonds" subtitle="Historique technique de vos flux de trésorerie" />
        <div className="space-y-4">
            <div className="bg-white p-12 text-center border border-ink/5">
                <span className="text-[10px] font-serif text-ink/40 italic">Aucune transaction enregistrée</span>
            </div>
            {([] as any[]).map((t, i) => (
                <div key={i} className="bg-white p-6 border border-ink/5 flex justify-between items-center group">
                    <div className="flex items-center gap-8">
                        <History size={16} className="text-ink/10" />
                        <div>
                            <p className="text-[10px] font-mono text-ink/20">{t.ref}</p>
                            <p className="text-xs font-serif italic">{t.type} via Stripe Connect</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-light text-ink tabular-nums">{t.val}</p>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-gold">Transaction Réussie</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const WorkflowsManager = () => (
    <div className="p-16 max-w-7xl mx-auto">
        <ModuleHeader 
            title="Workflows Automatisés" 
            subtitle="Cartographie de vos séquences d'actions" 
            actionLabel="Créer un Workflow"
            onAction={() => alert("L'éditeur de workflow sera bientôt disponible.")}
        />
        <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-12 border border-ink/5 text-center">
                <span className="text-[10px] font-serif text-ink/40 italic">Aucun workflow configuré</span>
            </div>
        </div>
    </div>
);

const ProductsManager = () => (
    <div className="p-16 max-w-7xl mx-auto space-y-12">
        <ModuleHeader title="Objets de Désir" subtitle="Gestion de vos actifs physiques Haut de Gamme" actionLabel="Ajouter un Objet" />
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-3 bg-white p-12 text-center border border-ink/5">
                <span className="text-[10px] font-serif text-ink/40 italic">Aucun objet ajouté</span>
            </div>
            {([] as any[]).map((p, i) => (
                <div key={i} className="bg-white border border-ink/5 p-8 text-center space-y-6 group hover:border-gold transition-all">
                    <div className="aspect-square bg-paper flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                        <ShoppingBag size={48} strokeWidth={0.5} className="text-ink/10 group-hover:text-gold" />
                    </div>
                    <div>
                        <h4 className="text-lg font-serif italic text-ink">{p.name}</h4>
                        <p className="text-[9px] font-bold text-gold uppercase tracking-[0.3em] mt-2">{p.stock} UNITÉS EN RÉSERVE</p>
                        <p className="text-xl font-light mt-4 tabular-nums">{p.price}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const PromoCodesManager = () => (
    <div className="p-16 max-w-4xl mx-auto space-y-12">
        <ModuleHeader title="Privilèges Limités" subtitle="Codes de réduction et accès exclusifs" actionLabel="Créer un Code" />
        <div className="space-y-6">
            <div className="bg-ink/5 p-12 text-center">
                <span className="text-[10px] font-serif text-ink/40 italic">Aucun code promo actif</span>
            </div>
            {([] as any[]).map(c => (
                <div key={c.code} className="bg-ink p-8 flex justify-between items-center text-paper border border-white/5">
                    <div>
                        <code className="text-2xl font-mono text-gold">{c.code}</code>
                        <p className="text-[10px] font-bold text-paper/30 uppercase tracking-widest mt-2">Type: {c.type}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-serif italic text-paper/10">{c.usage}</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-paper/40">Utilisations</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CoursesManager = () => (
    <div className="p-16 max-w-7xl mx-auto space-y-12">
        <ModuleHeader title="Espaces de Savoir" subtitle="Hébergement de vos académies en ligne" actionLabel="Nouveau Module" />
        <div className="grid grid-cols-2 gap-12">
            <div className="col-span-2 bg-white p-12 text-center border border-ink/5">
                <span className="text-[10px] font-serif text-ink/40 italic">Aucune formation créée</span>
            </div>
            {([] as any[]).map((course, i) => (
                <div key={i} className="bg-white border border-ink/5 p-10 flex gap-8 group hover:border-gold transition-all">
                    <div className="w-24 h-24 bg-paper flex items-center justify-center border border-ink/5 group-hover:bg-gold/5 transition-colors">
                        <PlayIcon size={24} className="text-ink/10 group-hover:text-gold" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h4 className="text-xl font-serif italic text-ink">{course.name}</h4>
                            <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">{course.lessons} Leçons Vidéo</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={`text-[8px] font-bold px-2 py-0.5 uppercase tracking-widest ${course.status === 'Actif' ? 'bg-green-500/10 text-green-500' : 'bg-ink/5 text-ink/30'}`}>{course.status}</span>
                            <button className="text-[9px] font-bold text-gold uppercase tracking-widest">Éditer le pack</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const FilesManager = () => {
    const files: any[] = [];

    return (
        <div className="p-16 max-w-7xl mx-auto space-y-12">
            <ModuleHeader title="Coffre-fort d'Actifs" subtitle="Stockage sécurisé de vos documents et médias" actionLabel="Téléverser" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {files.length === 0 && (
                    <div className="col-span-4 bg-white p-12 text-center border border-ink/5">
                        <span className="text-[10px] font-serif text-ink/40 italic">Aucun fichier téléversé</span>
                    </div>
                )}
                {files.map((file, i) => (
                    <div key={i} className="bg-white border border-ink/5 p-6 space-y-6 group hover:shadow-xl transition-all">
                        <div className="aspect-square bg-paper flex items-center justify-center text-ink/10 group-hover:text-gold transition-all">
                            <FileIcon size={48} strokeWidth={1} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-ink overflow-hidden text-ellipsis whitespace-nowrap">{file.name}</p>
                            <div className="flex justify-between mt-2">
                                <span className="text-[9px] font-bold text-ink/20 uppercase tracking-widest">{file.type}</span>
                                <span className="text-[9px] font-mono text-ink/20">{file.size}</span>
                            </div>
                        </div>
                        <button className="w-full py-2 bg-ink/5 text-ink text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition-all">Télécharger</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WebsiteManager = () => (
    <div className="p-16 max-w-7xl mx-auto space-y-12">
        <ModuleHeader title="Architecture de Marque" subtitle="Édition de votre vitrine numérique principale" actionLabel="Publier les Modifications" />
        <div className="bg-zinc-900 aspect-video w-full flex items-center justify-center text-paper border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent opacity-50"></div>
            <div className="text-center space-y-6 relative z-10">
                <Sparkles size={48} className="text-gold mx-auto mb-4" />
                <h2 className="text-4xl font-serif italic">Aperçu Live du Site</h2>
                <div className="flex justify-center gap-4">
                    <button className="px-8 py-3 bg-paper text-ink text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition-all">Éditeur Visuel</button>
                    <button className="px-8 py-3 border border-white/20 text-paper text-[10px] font-bold uppercase tracking-widest hover:border-gold transition-all">Paramètres SEO</button>
                </div>
            </div>
        </div>
    </div>
);

const FunnelsManager = () => (
    <div className="p-16 max-w-7xl mx-auto space-y-12">
        <ModuleHeader title="Tunnels de Conversion" subtitle="Processus automatisés pour transformer l'intérêt en engagement" actionLabel="Nouveau Tunnel" />
        <div className="space-y-8">
            <div className="bg-white p-12 text-center border border-ink/5">
                <span className="text-[10px] font-serif text-ink/40 italic">Aucun tunnel de vente (funnel)</span>
            </div>
            {([] as any[]).map((f, i) => (
                <div key={i} className="bg-white p-10 border border-ink/5 flex justify-between items-center group hover:border-gold/30 transition-all">
                    <div className="flex gap-12 items-center">
                        <div className="w-16 h-16 bg-gold/10 text-gold flex items-center justify-center">
                            <Filter size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl font-serif italic text-ink">{f.name}</h4>
                            <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">{f.steps} ÉTAPES DE SIGNATURE</p>
                        </div>
                    </div>
                    <div className="flex gap-16 items-center">
                        <div className="text-center">
                            <p className="text-lg font-light text-ink tabular-nums">{f.visits}</p>
                            <p className="text-[8px] text-ink/30 font-bold uppercase tracking-widest">Visites</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-light text-gold tabular-nums">{f.conv}</p>
                            <p className="text-[8px] text-gold/60 font-bold uppercase tracking-widest">Conv.</p>
                        </div>
                        <button className="px-6 py-3 border border-gold/20 text-gold text-[9px] font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition-all">Éditer le parcours</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CreatorPageManager = () => (
    <div className="p-16 max-w-4xl mx-auto space-y-12">
        <ModuleHeader title="Identité Publique" subtitle="Votre page de liens et philosophie centralisée" actionLabel="Mettre à Jour" />
        <div className="bg-white border border-ink/5 p-12 text-center space-y-10">
            <div className="w-24 h-24 bg-ink mx-auto text-paper flex items-center justify-center font-serif text-3xl italic ring-8 ring-paper ring-offset-4 ring-offset-gold/20">LP</div>
            <div>
                <h2 className="text-2xl font-serif italic">Lucile Poiret</h2>
                <p className="text-ink/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Architecte de Systèmes de Prestige</p>
            </div>
            <div className="space-y-4 max-w-xs mx-auto">
                <div className="p-4 border border-ink/10 text-[10px] font-bold uppercase tracking-widest hover:bg-ink hover:text-paper transition-all cursor-pointer">Rejoindre le Mastermind</div>
                <div className="p-4 border border-ink/10 text-[10px] font-bold uppercase tracking-widest hover:bg-ink hover:text-paper transition-all cursor-pointer">Mon Livre Signature</div>
                <div className="p-4 border border-ink/10 text-[10px] font-bold uppercase tracking-widest hover:bg-ink hover:text-paper transition-all cursor-pointer">Audit Instantané</div>
            </div>
        </div>
    </div>
);

const BlogsManager = () => (
    <div className="p-16 max-w-7xl mx-auto space-y-12">
        <ModuleHeader title="Pensée Littéraire" subtitle="Articles et réflexions pour établir votre autorité" actionLabel="Écrire une Note" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="col-span-2 bg-white p-12 text-center border border-ink/5">
                <span className="text-[10px] font-serif text-ink/40 italic">Aucun article publié</span>
            </div>
            {([] as any[]).map((post, i) => (
                <div key={i} className="bg-white border border-ink/5 p-10 space-y-6 group hover:border-gold transition-all">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-gold uppercase tracking-widest bg-gold/5 px-3 py-1">{post.cat}</span>
                        <span className="text-[8px] font-bold text-ink/20 uppercase tracking-widest">{post.date}</span>
                    </div>
                    <h3 className="text-2xl font-serif italic text-ink group-hover:text-gold transition-colors">{post.title}</h3>
                    <p className="text-xs text-ink/40 font-light leading-relaxed italic">"Une exploration profonde de la psychologie humaine appliquée aux interfaces de luxe..."</p>
                    <button className="flex items-center gap-2 text-[9px] font-bold text-ink uppercase tracking-widest group-hover:gap-4 transition-all">Lire et Éditer <ArrowRight size={12} /></button>
                </div>
            ))}
        </div>
    </div>
);

const FAQManager = () => (
    <div className="p-16 max-w-5xl mx-auto space-y-12">
        <ModuleHeader title="Base de Connaissances" subtitle="Guidez vos visiteurs pour limiter le support" actionLabel="Créer un Article FAQ" />
        <div className="space-y-4">
            <div className="bg-white p-12 text-center border border-ink/5">
                <span className="text-[10px] font-serif text-ink/40 italic">La FAQ est vide</span>
            </div>
            {([] as any[]).map((faq, i) => (
                <div key={i} className="bg-white border border-ink/5 p-8 flex flex-col group hover:border-gold/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">{faq.cat}</span>
                        <button className="text-[9px] font-bold text-gold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Éditer (Notion Sync)</button>
                    </div>
                    <p className="text-xl font-serif italic text-ink mb-4">{faq.q}</p>
                    <p className="text-sm font-light text-ink/60">{faq.a}</p>
                </div>
            ))}
        </div>
    </div>
);

const PrivilegeCardManager = () => (
    <div className="p-16 max-w-6xl mx-auto space-y-12">
        <ModuleHeader title="Carte Privilège" subtitle="Fidélité sélective : récompense conditionnelle pour l'élite" actionLabel="Nouvelle Campagne" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white border border-ink/5 p-12 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Star size={120} strokeWidth={0.5} />
                </div>
                <div className="relative z-10 space-y-2">
                    <h3 className="text-2xl font-serif italic text-gold">Paramétrage de la Carte</h3>
                    <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">Offerte dès 100€ d'achat - Validité 1 an</p>
                </div>
                <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">Questionnaire Profilage</label>
                        <div className="bg-paper p-4 text-xs font-serif italic text-ink/60 border border-ink/5 flex items-center justify-between">
                            Date d'anniversaire requise
                            <CheckCircle2 size={14} className="text-gold" />
                        </div>
                        <div className="bg-paper p-4 text-xs font-serif italic text-ink/60 border border-ink/5 flex items-center justify-between">
                            Objectif Principal (Coaché/Étudiant)
                            <CheckCircle2 size={14} className="text-gold" />
                        </div>
                        <button className="text-[9px] text-gold font-bold uppercase tracking-widest mt-2 underline decoration-gold/30">Modifier Formulaire</button>
                    </div>
                    
                    <div className="pt-4 flex justify-between items-center border-t border-ink/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Abonnement Exclusif ?</span>
                        <div className="w-12 h-6 bg-gold/20 flex items-center p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-gold rounded-none"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-ink p-10 text-paper text-center space-y-6 relative group">
                    <div className="w-20 h-20 mx-auto border border-gold/40 flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
                        <div className="w-16 h-16 border border-gold/20 flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500 delay-100">
                            <Star size={24} className="text-gold" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-3xl font-serif italic mb-2">Carte Numérique</h4>
                        <p className="text-[10px] font-bold text-paper/40 uppercase tracking-widest">Aperçu Client Wallet</p>
                    </div>
                    <button className="px-8 py-3 bg-paper text-ink text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-all">Envoyer Test</button>
                </div>

                <div className="bg-white border-l-4 border-gold p-6 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest mb-1">Membres Actifs</p>
                        <p className="text-2xl font-serif italic text-ink">0</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest mb-1">Passages en caisse &gt; 100€</p>
                        <p className="text-2xl font-serif italic text-ink">--%</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    if (!['dashboard', 'forms', 'lexicon', 'privacy', 'settings'].includes(tab)) {
      if(navStructure[tab]) setActiveSubTab(navStructure[tab].items[0].id);
    } else {
      setActiveSubTab(null);
    }
  };

  return (
    <div className="flex h-screen bg-paper text-ink font-sans selection:bg-gold/20">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col bg-white border-r border-ink/5 overflow-hidden relative z-50 shadow-2xl"
          >
            <div className="p-8 border-b border-ink/5 flex items-center gap-4">
                <div className="w-10 h-10 bg-gold grid place-items-center rounded-none rotate-45 shadow-lg shadow-gold/20">
                    <ShoppingBag className="-rotate-45 text-white" size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-serif italic text-ink tracking-tight">Presence</h2>
                    <p className="text-[9px] font-bold text-ink/30 uppercase tracking-[0.3em]">Signature OS</p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
               <SidebarItem 
                 item={{ id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard }}
                 active={activeTab === 'dashboard'}
                 onClick={() => handleTabClick('dashboard')}
               />

               <div className="pt-6 pb-2 text-[9px] font-bold text-ink/20 uppercase tracking-[0.3em] px-4">Gestion Écosystème</div>
               
               {Object.entries(navStructure).map(([id, config]) => (
                  <div key={id} className="space-y-1">
                     <SidebarItem 
                        item={{ id: id as TabType, label: config.label, icon: config.icon }}
                        active={activeTab === id}
                        onClick={() => handleTabClick(id as TabType)}
                     />
                     {activeTab === id && (
                        <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           className="pl-12 space-y-1 overflow-hidden"
                        >
                           {config.items.map(subItem => (
                              <button
                                 key={subItem.id}
                                 onClick={() => setActiveSubTab(subItem.id)}
                                 className={`w-full text-left py-2 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                                    activeSubTab === subItem.id ? 'text-gold' : 'text-ink/40 hover:text-ink'
                                 }`}
                              >
                                 {subItem.label}
                              </button>
                           ))}
                        </motion.div>
                     )}
                  </div>
               ))}

               <div className="pt-6 pb-2 text-[9px] font-bold text-ink/20 uppercase tracking-[0.3em] px-4">Outils & Support</div>
               
               <SidebarItem 
                 item={{ id: 'forms', label: 'Formulaires IA', icon: FileText }}
                 active={activeTab === 'forms'}
                 onClick={() => handleTabClick('forms')}
               />
               <SidebarItem 
                 item={{ id: 'lexicon', label: 'Lexique', icon: BookOpen }}
                 active={activeTab === 'lexicon'}
                 onClick={() => handleTabClick('lexicon')}
               />
               <SidebarItem 
                 item={{ id: 'privacy', label: 'Confidentialité', icon: ShieldCheck }}
                 active={activeTab === 'privacy'}
                 onClick={() => handleTabClick('privacy')}
               />

               <div className="mt-auto pt-6">
                 <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink/40 hover:bg-gold/5 hover:text-gold transition-all group"
                 >
                   <div className="p-1.5 rounded-md bg-transparent group-hover:bg-gold/10">
                     {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                   </div>
                   <span className="text-[10px] uppercase tracking-widest font-bold">Thème {isDarkMode ? 'Clair' : 'Sombre'}</span>
                 </button>
               </div>
            </nav>

            <div className="p-8 border-t border-ink/5">
                <div className="bg-white border border-ink/5 p-6 rounded-none relative overflow-hidden group cursor-pointer text-center">
                    <p className="text-[9px] font-bold text-gold mb-1 uppercase tracking-widest">Édition Conciergerie</p>
                    <p className="text-[10px] font-medium text-ink/60 leading-relaxed italic">Service de prestige activé</p>
                </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-paper/80 backdrop-blur-xl border-b border-ink/5 h-20 flex items-center px-10 justify-between shrink-0">
          <div className="flex items-center gap-6">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-ink text-paper rounded-none hover:rotate-90 transition-transform duration-500">
                <Menu size={18} />
              </button>
            )}
            <div className="relative group">
              <Search className="absolute left-0 top-3 text-ink/30 transition-colors group-focus-within:text-gold" size={14} />
              <input 
                placeholder="RECHERCHER DANS L'ARCHIVE..." 
                className="bg-transparent border-b border-ink/10 focus:border-gold lg:w-80 pl-6 pr-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] outline-none transition-all placeholder:text-ink/20" 
              />
            </div>
          </div>
                  <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-ink/60 hover:text-gold transition-colors"
              >
                <Bell size={20} />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-80 bg-white border border-ink/5 shadow-2xl z-50"
                  >
                    <div className="p-4 border-b border-ink/5">
                      <p className="text-[10px] font-bold text-ink uppercase tracking-widest">Centre de Notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-ink/5">
                        <div className="p-12 text-center text-ink/40 text-[10px] font-serif italic">
                            Aucune notification
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-serif italic text-ink">Lucile Poiret</span>
                <span className="text-[9px] font-bold text-gold uppercase tracking-[0.2em] mt-0.5">Membre Privilège</span>
            </div>
            <div className="w-12 h-12 bg-white border border-ink/5 shadow-2xl flex items-center justify-center text-ink font-serif italic text-xl hover:bg-ink hover:text-paper transition-all cursor-pointer ring-8 ring-paper">
              LP
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (activeSubTab || '')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} setActiveSubTab={setActiveSubTab} />}
              {activeTab === 'emails' && activeSubTab === 'newsletters' && <EmailSection />}
              {activeTab === 'forms' && <FormBuilder />}
              {activeTab === 'lexicon' && <Lexicon />}
              {activeTab === 'privacy' && <GDPRSection />}
              {activeTab === 'sales' && activeSubTab === 'offer_links' && <OfferLinkGenerator />}
              
              {/* CRM Modules */}
              {activeTab === 'crm' && activeSubTab === 'contacts' && <ContactsManager />}
              {activeTab === 'crm' && activeSubTab === 'pipelines' && <PipelineManager />}
              {activeTab === 'crm' && activeSubTab === 'tags' && <TagsManager />}
              {activeTab === 'crm' && activeSubTab === 'calendar' && <CalendarManager />}
              {activeTab === 'crm' && activeSubTab === 'privilege_card' && <PrivilegeCardManager />}

              {/* Marketing Modules */}
              {activeTab === 'emails' && activeSubTab === 'campaigns' && <EmailSection />}
              {activeTab === 'emails' && activeSubTab === 'statistics' && <MarketingAnalytics />}

              {/* Sales Modules */}
              {activeTab === 'sales' && activeSubTab === 'orders' && <OrdersManager />}
              {activeTab === 'sales' && activeSubTab === 'subscriptions' && <SubscriptionsManager />}
              {activeTab === 'sales' && activeSubTab === 'transactions' && <TransactionsManager />}

              {/* Automation Modules */}
              {activeTab === 'automations' && activeSubTab === 'rules' && <AutomationManager />}
              {activeTab === 'automations' && activeSubTab === 'workflows' && <WorkflowsManager />}
              
              {/* Site Modules */}
              {activeTab === 'site' && activeSubTab === 'website' && <WebsiteManager />}
              {activeTab === 'site' && activeSubTab === 'funnels' && <FunnelsManager />}
              {activeTab === 'site' && activeSubTab === 'creator_page' && <CreatorPageManager />}
              {activeTab === 'site' && activeSubTab === 'blogs' && <BlogsManager />}
              {activeTab === 'site' && activeSubTab === 'faq' && <FAQManager />}

              {/* Resources Modules */}
              {activeTab === 'resources' && activeSubTab === 'physical_products' && <ProductsManager />}
              {activeTab === 'resources' && activeSubTab === 'promo_codes' && <PromoCodesManager />}
              {activeTab === 'resources' && activeSubTab === 'courses' && <CoursesManager />}
              {activeTab === 'resources' && activeSubTab === 'files' && <FilesManager />}

              {activeTab === 'settings' && (
                <div className="p-20 text-center flex flex-col items-center">
                   <div className="w-40 h-40 bg-white border border-ink/5 rounded-none flex items-center justify-center text-ink shadow-2xl rotate-3 mb-10">
                       <Settings size={64} strokeWidth={1} className="-rotate-3" />
                   </div>
                   <div className="space-y-4 mb-16">
                       <h2 className="text-5xl font-light italic text-ink tracking-tight">Paramètres Système</h2>
                       <p className="text-ink/40 max-w-sm mx-auto font-light text-[10px] uppercase tracking-[0.3em] leading-loose">
                        Centre de contrôle technique pour orienter votre écosystème
                       </p>
                   </div>
                   
                   <div className="w-full max-w-4xl text-left grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-white p-8 border border-ink/5 shadow-sm space-y-6">
                           <h3 className="text-lg font-serif italic text-ink border-b border-ink/5 pb-4">Thématisation de la Marque</h3>
                           <p className="text-xs text-ink/60 leading-relaxed font-light mb-4">La modification des thèmes s'applique globalement à l'ensemble de votre vitrine web, de vos formulaires de signature, et pages de paiement générées par le logiciel.</p>
                           <div className="space-y-4">
                               <div className="flex gap-4">
                                   <button 
                                      onClick={() => setIsDarkMode(true)}
                                      className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${isDarkMode ? 'bg-ink text-paper border border-ink shadow-lg' : 'bg-white text-ink border border-ink/10 hover:border-gold'}`}>
                                      Thème Sombre (Atelier LUXE)
                                   </button>
                                   <button 
                                      onClick={() => setIsDarkMode(false)}
                                      className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${!isDarkMode ? 'bg-ink text-paper border border-ink shadow-lg' : 'bg-white text-ink border border-ink/10 hover:border-gold'}`}>
                                      Thème Clair (Minimaliste)
                                   </button>
                               </div>
                               <div>
                                    <label className="text-[10px] font-bold text-ink/40 uppercase tracking-widest block mb-2">Couleur Primaire (Accent)</label>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-gold rounded-full border border-ink/10 cursor-pointer hover:scale-110 transition-transform"></div>
                                        <div className="w-8 h-8 bg-ink rounded-full border border-ink/10 cursor-pointer hover:scale-110 transition-transform"></div>
                                        <div className="w-8 h-8 bg-blue-900 rounded-full border border-ink/10 cursor-pointer hover:scale-110 transition-transform"></div>
                                        <div className="w-8 h-8 border border-dashed border-ink/20 rounded-full cursor-pointer hover:border-gold flex items-center justify-center transition-colors"><Plus size={12} className="text-ink/40"/></div>
                                    </div>
                               </div>
                           </div>
                       </div>

                       <div className="bg-white p-8 border border-ink/5 shadow-sm space-y-6">
                           <h3 className="text-lg font-serif italic text-ink border-b border-ink/5 pb-4">Formulaires Internes</h3>
                           <div className="space-y-4">
                               <p className="text-xs text-ink/60 font-light leading-relaxed">
                                   Vous utilisez l'outil de création de formulaires natif. Cela garantit une intégration parfaite avec la base de données, l'interface utilisateur, la conformité RGPD, et évitera les doublons.
                               </p>
                               <div className="flex items-center justify-between bg-ink/5 p-4">
                                  <div>
                                     <p className="text-sm font-bold text-ink">Formulaires Natifs</p>
                                     <p className="text-[10px] text-ink/40 mt-1 uppercase tracking-widest">État : Actif</p>
                                  </div>
                                  <div className="w-8 h-4 bg-gold flex items-center p-1 rounded-full">
                                      <div className="w-2 h-2 bg-white rounded-full translate-x-4"></div>
                                  </div>
                               </div>
                           </div>
                       </div>
                   </div>
                </div>
              )}

              {/* Fallback for other modules - EXCLUSIVE Logic */}
              {activeSubTab && !['newsletters', 'contacts', 'courses', 'files', 'offer_links', 'pipelines', 'tags', 'calendar', 'campaigns', 'statistics', 'orders', 'subscriptions', 'transactions', 'rules', 'physical_products', 'promo_codes', 'website', 'funnels', 'creator_page', 'blogs', 'workflows', 'faq', 'privilege_card'].includes(activeSubTab) && (
                <div className="p-20 text-center space-y-10 flex flex-col items-center">
                   <div className="w-40 h-40 bg-white border border-ink/5 rounded-none flex items-center justify-center text-gold shadow-2xl rotate-3">
                       <Zap size={64} strokeWidth={1} className="-rotate-3" />
                   </div>
                   <div className="space-y-4">
                       <h2 className="text-5xl font-light italic text-ink tracking-tight">
                        {LEXICON[activeSubTab]?.title || LEXICON[activeTab]?.title || activeSubTab}
                       </h2>
                       <p className="text-ink/40 max-w-sm mx-auto font-light text-[10px] uppercase tracking-[0.3em] leading-loose">
                        {LEXICON[activeSubTab]?.description || LEXICON[activeTab]?.description || "Module en cours de déploiement pour votre Signature OS."}
                       </p>
                   </div>
                   <button 
                    onClick={() => alert(`Initialisation du module ${activeSubTab} en cours...`)}
                    className="px-12 py-5 bg-ink text-paper text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4 group"
                   >
                       Initialiser le module {activeSubTab}
                       <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-gold" />
                   </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}
