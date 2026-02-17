
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { identityData } from './data';
import { SectionType, IdentityRecord, BrandFile, BrandText, BrandLink } from './types';
import { 
  Palette, 
  Phone, 
  Mail, 
  Search, 
  Copy,
  CheckCircle,
  User,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  FileIcon,
  Upload,
  Trash2,
  Download,
  Plus,
  Edit3,
  X,
  Quote,
  Video,
  Eye,
  ExternalLink,
  Link as LinkIcon,
  Share2,
  FolderOpen,
  ArrowRightLeft,
  ChevronDown,
  Lock,
  Unlock,
  AlertCircle,
  Maximize2,
  Save,
  DownloadCloud,
  UploadCloud
} from 'lucide-react';

const ADMIN_PASSWORD = 'Royah2025';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionType | 'الكل'>('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // --- Admin State ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  
  // --- Data Persistence States ---
  const [files, setFiles] = useState<BrandFile[]>(() => {
    const saved = localStorage.getItem('royah_files');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', name: 'شعار الجمعية - النسخة الرسمية.png', size: '2.4 MB', type: 'image/png', uploadDate: '2024-03-15', category: 'الهوية البصرية' },
      { id: 'f2', name: 'دليل استخدام الهوية البصرية.pdf', size: '15.8 MB', type: 'application/pdf', uploadDate: '2024-03-10', category: 'الهوية البصرية' },
      { id: 'f3', name: 'اللائحة الأساسية للجمعية.pdf', size: '1.2 MB', type: 'application/pdf', uploadDate: '2024-01-05', category: 'المستندات القانونية' },
    ];
  });

  const [visualAssets, setVisualAssets] = useState<BrandFile[]>(() => {
    const saved = localStorage.getItem('royah_assets');
    return saved ? JSON.parse(saved) : [];
  });

  const [links, setLinks] = useState<BrandLink[]>(() => {
    const saved = localStorage.getItem('royah_links');
    return saved ? JSON.parse(saved) : [
      { id: 'l1', label: 'الموقع الرسمي للجمعية', url: 'https://royah.org.sa', category: 'روابط عامة' },
      { id: 'l2', label: 'بوابة المستفيدين', url: 'https://portal.royah.org.sa', category: 'خدمات' },
      { id: 'l3', label: 'منصة التطوع', url: 'https://nvp.gov.sa', category: 'تطوع' },
    ];
  });

  const [texts, setTexts] = useState<BrandText[]>(() => {
    const saved = localStorage.getItem('royah_texts');
    return saved ? JSON.parse(saved) : [
      { id: 't1', label: 'الرؤية', content: 'الريادة في تقديم الخدمات الاجتماعية النوعية والمستدامة.', category: 'الهوية اللفظية' },
      { id: 't2', label: 'الرسالة', content: 'تمكين المجتمع من خلال برامج تنموية فاعلة وشراكات استراتيجية تحقق الأثر الاجتماعي المنشود.', category: 'الهوية اللفظية' },
      { id: 't3', label: 'شعار الجمعية (Slogan)', content: 'رؤية طموحة لمجتمع واعد', category: 'الهوية اللفظية' },
    ];
  });

  // --- Sync to LocalStorage ---
  useEffect(() => { localStorage.setItem('royah_files', JSON.stringify(files)); }, [files]);
  useEffect(() => { localStorage.setItem('royah_assets', JSON.stringify(visualAssets)); }, [visualAssets]);
  useEffect(() => { localStorage.setItem('royah_links', JSON.stringify(links)); }, [links]);
  useEffect(() => { localStorage.setItem('royah_texts', JSON.stringify(texts)); }, [texts]);

  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
  const [isRenameCategoryModalOpen, setIsRenameCategoryModalOpen] = useState(false);
  const [isMoveFileModalOpen, setIsMoveFileModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  
  const [targetCategory, setTargetCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedFilesToUpload, setSelectedFilesToUpload] = useState<FileList | null>(null);
  const [fileToMove, setFileToMove] = useState<BrandFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const assetInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('تم النسخ إلى الحافظة');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsAuthModalOpen(false);
      setPasswordInput('');
      setAuthError(false);
      showToast('مرحباً بك في وضع المسؤول');
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 500);
    }
  };

  const exportConfig = () => {
    const data = { files, visualAssets, links, texts, version: '2025.1', exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Royah_Identity_Backup_${new Date().toLocaleDateString()}.json`;
    link.click();
    showToast('تم تصدير نسخة احتياطية بنجاح');
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.files) setFiles(data.files);
        if (data.visualAssets) setVisualAssets(data.visualAssets);
        if (data.links) setLinks(data.links);
        if (data.texts) setTexts(data.texts);
        showToast('تم استيراد البيانات بنجاح');
      } catch (err) {
        showToast('خطأ في قراءة ملف البيانات', 'error');
      }
    };
    reader.readAsText(file);
  };

  const getTint = (hex: string, factor: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const newR = Math.round(r + (255 - r) * (1 - factor));
    const newG = Math.round(g + (255 - g) * (1 - factor));
    const newB = Math.round(b + (255 - b) * (1 - factor));
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`.toUpperCase();
  };

  const processFiles = (uploadedFiles: FileList, category: string): Promise<BrandFile[]> => {
    return Promise.all(Array.from(uploadedFiles).map(file => {
      return new Promise<BrandFile>((resolve) => {
        const objectUrl = URL.createObjectURL(file);
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
              type: file.type,
              uploadDate: new Date().toISOString().split('T')[0],
              category: category,
              preview: e.target?.result as string
            });
          };
          reader.readAsDataURL(file);
        } else {
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            type: file.type,
            uploadDate: new Date().toISOString().split('T')[0],
            category: category,
            preview: objectUrl
          });
        }
      });
    }));
  };

  // --- Filtering Logic ---
  const existingCategories = useMemo(() => Array.from(new Set(files.map(f => f.category))), [files]);

  const filteredData = useMemo(() => {
    return identityData.filter(item => {
      const matchesTab = activeTab === 'الكل' || item.section === activeTab;
      const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.value.includes(searchTerm) ||
                          (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  const filteredFiles = useMemo(() => {
    if (activeTab !== 'الكل' && activeTab !== SectionType.FILES) return [];
    return files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [files, activeTab, searchTerm]);

  const filesByCategory = useMemo(() => {
    const groups: { [key: string]: BrandFile[] } = {};
    filteredFiles.forEach(file => {
      if (!groups[file.category]) groups[file.category] = [];
      groups[file.category].push(file);
    });
    return groups;
  }, [filteredFiles]);

  const filteredAssets = useMemo(() => {
    if (activeTab !== 'الكل' && activeTab !== SectionType.VISUAL_ASSETS) return [];
    return visualAssets.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [visualAssets, activeTab, searchTerm]);

  const filteredTexts = useMemo(() => {
    if (activeTab !== 'الكل' && activeTab !== SectionType.TEXT_BANK) return [];
    return texts.filter(t => t.label.toLowerCase().includes(searchTerm.toLowerCase()) || t.content.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [texts, activeTab, searchTerm]);

  const filteredLinks = useMemo(() => {
    if (activeTab !== 'الكل' && activeTab !== SectionType.LINKS) return [];
    return links.filter(l => l.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [links, activeTab, searchTerm]);

  // --- Sub-Components ---
  const ColorSection = ({ items }: { items: IdentityRecord[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
      {items.map((item) => (
        <div key={item.id} className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
          <div onClick={() => handleCopy(item.id, item.hex)} className="h-28 w-full cursor-pointer relative overflow-hidden group-hover:brightness-105 transition-all duration-500" style={{ backgroundColor: item.hex }}>
            <div className={`absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${copiedId === item.id ? 'opacity-100' : 'opacity-0'}`}>
               <CheckCircle className="text-white" size={24} />
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xs font-bold text-[#2B556F] truncate mb-0.5">{item.label}</h3>
            <span className="font-mono text-[10px] text-[#5898B1] tracking-wider uppercase font-medium">{item.hex}</span>
            <div className="mt-3 flex h-6 w-full rounded-xl overflow-hidden shadow-inner border border-gray-50">
              {[1, 0.8, 0.6, 0.4, 0.2].map((factor, idx) => {
                const tintHex = getTint(item.hex, factor);
                const tintId = `${item.id}-tint-${idx}`;
                return (
                  <div key={tintId} onClick={(e) => { e.stopPropagation(); handleCopy(tintId, tintHex); }} className="flex-1 cursor-pointer relative group/tint transition-transform hover:scale-y-110" style={{ backgroundColor: tintHex }}>
                    {copiedId === tintId && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center"><CheckCircle size={10} className="text-green-600" /></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ContactSection = ({ items }: { items: IdentityRecord[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#B24686] group-hover:bg-[#B24686] group-hover:text-white transition-all">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#2B556F] text-lg">{item.label}</h3>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">نشط</span>
            </div>
          </div>
          <div className="space-y-3">
             <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white border border-transparent hover:border-gray-200 transition-all group/item" onClick={() => handleCopy(item.id + '-p', item.value)}>
                <div className="flex items-center gap-3">
                   <Phone size={16} className="text-[#5898B1]" />
                   <span className="font-bold text-[#2B556F]">{item.value}</span>
                </div>
                <div className={`p-1.5 rounded-lg transition-all ${copiedId === item.id + '-p' ? 'bg-green-50 text-green-600' : 'bg-white text-gray-300 group-hover/item:text-[#B24686] shadow-sm'}`}>
                   {copiedId === item.id + '-p' ? <CheckCircle size={14} /> : <Copy size={14} />}
                </div>
             </div>
             {item.email && (
               <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white border border-transparent hover:border-gray-200 transition-all group/item" onClick={() => handleCopy(item.id + '-e', item.email!)}>
                  <div className="flex items-center gap-3 overflow-hidden">
                     <Mail size={16} className="text-[#5898B1]" />
                     <span className="font-bold text-[#2B556F] truncate text-sm">{item.email}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${copiedId === item.id + '-e' ? 'bg-green-50 text-green-600' : 'bg-white text-gray-300 group-hover/item:text-[#B24686] shadow-sm'}`}>
                     {copiedId === item.id + '-e' ? <CheckCircle size={14} /> : <Copy size={14} />}
                  </div>
               </div>
             )}
          </div>
        </div>
      ))}
    </div>
  );

  const VisualAssetsSection = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-8 border border-white/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-[#B24686] rounded-2xl flex items-center justify-center text-white shadow-lg"><ImageIcon size={28} /></div>
             <div>
                <h3 className="text-xl font-black text-[#2B556F]">مكتبة الأصول البصرية</h3>
                <p className="text-xs font-bold text-gray-400">الشعارات، الصور، والرموز الخاصة بالجمعية.</p>
             </div>
          </div>
          {isAdmin && (
            <button onClick={() => assetInputRef.current?.click()} className="px-8 py-4 bg-[#B24686] text-white rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-lg active:scale-95">
              <Plus size={20} /> إضافة أصول جديدة
              <input type="file" ref={assetInputRef} hidden multiple accept="image/*" onChange={async (e) => {
                  if(e.target.files) {
                    const newAssets = await processFiles(e.target.files, 'أصول بصرية');
                    setVisualAssets(prev => [...newAssets, ...prev]);
                    showToast('تمت إضافة الصور بنجاح');
                  }
              }} />
            </button>
          )}
      </div>

      {filteredAssets.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-white/30">
          <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">لا توجد صور حالياً. {isAdmin && 'اضغط على الزر أعلاه للبدء.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map(asset => (
            <div key={asset.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 group relative">
              <div className="h-56 bg-gray-50 relative flex items-center justify-center overflow-hidden">
                 {asset.preview ? (
                   <img src={asset.preview} className="w-full h-full object-cover p-2 rounded-[28px] group-hover:scale-110 transition-transform duration-700" alt={asset.name} />
                 ) : (
                   <FileIcon size={40} className="text-gray-200" />
                 )}
                 <div className="absolute inset-0 bg-[#2B556F]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button onClick={() => setPreviewImage(asset.preview!)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2B556F] shadow-lg hover:bg-[#B24686] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"><Maximize2 size={20} /></button>
                    {isAdmin && <button onClick={() => { setVisualAssets(prev => prev.filter(a => a.id !== asset.id)); showToast('تم الحذف'); }} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300" style={{ transitionDelay: '50ms' }}><Trash2 size={20} /></button>}
                 </div>
              </div>
              <div className="p-5">
                <h4 className="font-black text-xs text-[#2B556F] truncate mb-1">{asset.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400">{asset.size}</span>
                  <span className="text-[10px] font-black text-[#5898B1] uppercase">{asset.type.split('/')[1] || 'IMG'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const LinksSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLinks.map(link => (
        <div key={link.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 group hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#5898B1] group-hover:bg-[#5898B1] group-hover:text-white transition-all"><LinkIcon size={24} /></div>
              {isAdmin && <button onClick={() => setLinks(prev => prev.filter(l => l.id !== link.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>}
            </div>
            <h4 className="font-black text-[#2B556F] text-lg mb-2">{link.label}</h4>
            <p className="text-xs text-gray-400 truncate font-bold mb-6">{link.url}</p>
          </div>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-gray-50 text-[#2B556F] rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-[#B24686] hover:text-white transition-all shadow-sm">زيارة الرابط <ExternalLink size={14} /></a>
        </div>
      ))}
      {isAdmin && (
        <button onClick={() => setIsLinkModalOpen(true)} className="py-6 border-2 border-dashed border-gray-200 rounded-[32px] text-gray-400 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"><Plus size={20} /> إضافة رابط</button>
      )}
    </div>
  );

  const FilesSection = () => (
    <div className="space-y-10">
       <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-8 border border-white/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-[#5898B1] rounded-2xl flex items-center justify-center text-white shadow-lg"><FileText size={28} /></div>
             <div>
                <h3 className="text-xl font-black text-[#2B556F]">إدارة الملفات</h3>
                <p className="text-xs font-bold text-gray-400">تحكم كامل في الأقسام والملفات.</p>
             </div>
          </div>
          {isAdmin && <button onClick={() => setIsUploadFileModalOpen(true)} className="px-8 py-4 bg-[#2B556F] text-white rounded-2xl font-black flex items-center gap-3 hover:bg-[#B24686] transition-all shadow-lg"><Upload size={20} /> رفع ملف جديد</button>}
       </div>

       {(Object.entries(filesByCategory) as [string, BrandFile[]][]).map(([category, items]) => (
         <div key={category} className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-4 group/header">
               <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#5898B1]"><FolderOpen size={20} /></div>
               <div className="flex items-center gap-2">
                 <h3 className="text-lg font-black text-[#2B556F]">{category}</h3>
                 {isAdmin && <button onClick={() => { setTargetCategory(category); setNewCategoryName(category); setIsRenameCategoryModalOpen(true); }} className="p-1.5 rounded-lg bg-white/50 text-gray-400 hover:text-[#B24686] hover:bg-white opacity-0 group-hover/header:opacity-100 transition-all shadow-sm"><Edit3 size={14} /></button>}
               </div>
               <span className="mr-auto px-4 py-1.5 bg-white text-[#5898B1] rounded-full text-[10px] font-black border border-gray-100">{items.length} ملفات</span>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-right">
                  <thead className="bg-white border-b border-gray-50">
                     <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">اسم الملف</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">التاريخ</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">الحجم</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">الإجراءات</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {items.map(file => (
                       <tr key={file.id} className="hover:bg-gray-50/30 transition-all group/row">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <div className="text-[#5898B1]">{file.type.includes('pdf') ? <FileText size={18} /> : <ImageIcon size={18} />}</div>
                                <span className="font-bold text-[#2B556F]">{file.name}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-xs font-bold text-gray-400 text-center">{file.uploadDate}</td>
                          <td className="px-8 py-5 text-xs font-bold text-[#5898B1] text-center">{file.size}</td>
                          <td className="px-8 py-5">
                             <div className="flex gap-2 justify-end">
                                {isAdmin && <button onClick={() => { setFileToMove(file); setTargetCategory(file.category); setIsMoveFileModalOpen(true); }} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#5898B1] hover:text-white transition-all shadow-sm"><ArrowRightLeft size={14} /></button>}
                                <button onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = file.preview || '#';
                                  link.download = file.name;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#2B556F] hover:bg-[#5898B1] hover:text-white transition-all shadow-sm"><Download size={14} /></button>
                                {isAdmin && <button onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><Trash2 size={14} /></button>}
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
       ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-2xl shadow-2xl font-black text-sm flex items-center gap-3 animate-in slide-in-from-top duration-300 ${toast.type === 'success' ? 'bg-[#2B556F] text-white' : 'bg-red-500 text-white'}`}>
           {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
           {toast.message}
        </div>
      )}

      <header className="header-modern relative mb-10 overflow-hidden rounded-[40px] p-6 md:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-black leading-tight tracking-tight title-glow font-square text-3d-modern whitespace-nowrap overflow-hidden text-ellipsis">
              الهوية البصرية لجمعية رؤية التنموية
            </h1>
            <p className="text-xs md:text-sm font-bold text-white/90 mt-3 max-w-xl opacity-80">
              نطوّر الأدوات ونبسّط الإجراءات لنمنح فريقنا تجربة عمل أسرع وأسهل وأكثر فاعلية
            </p>
          </div>
          <div className="relative group hidden md:block">
             <div className="w-36 h-36 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[48px] flex items-center justify-center transform rotate-6 hover:rotate-0 transition-all duration-700 shadow-xl">
                <Palette size={56} className="text-white opacity-90 filter drop-shadow-xl" />
             </div>
          </div>
        </div>
      </header>

      <div className="glass-panel sticky top-4 z-30 mb-10 p-2.5 rounded-[28px] shadow-xl flex flex-col lg:flex-row gap-4 items-center justify-between border-white/40 ring-1 ring-black/5">
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
            <button onClick={() => isAdmin ? setIsAdmin(false) : setIsAuthModalOpen(true)} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isAdmin ? 'bg-[#B24686] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`} title={isAdmin ? "قفل التعديل" : "تفعيل وضع المسؤول"}>
              {isAdmin ? <Unlock size={18} /> : <Lock size={18} />}
            </button>
            {isAdmin && (
              <>
                <button onClick={exportConfig} className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#2B556F] transition-all" title="تصدير قاعدة البيانات">
                  <DownloadCloud size={18} />
                </button>
                <button onClick={() => importInputRef.current?.click()} className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#5898B1] transition-all" title="استيراد قاعدة البيانات">
                  <UploadCloud size={18} />
                  <input type="file" ref={importInputRef} hidden accept=".json" onChange={importConfig} />
                </button>
              </>
            )}
          </div>
          <nav className="flex items-center bg-gray-100/50 p-1 rounded-[22px] overflow-x-auto no-scrollbar">
            {['الكل', SectionType.COLORS, SectionType.CONTACT, SectionType.TEXT_BANK, SectionType.VISUAL_ASSETS, SectionType.LINKS, SectionType.FILES].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2.5 rounded-[18px] font-black text-[11px] transition-all duration-500 whitespace-nowrap ${activeTab === tab ? 'bg-white text-[#B24686] shadow-md scale-105' : 'text-gray-400 hover:text-[#2B556F]'}`}>{tab}</button>
            ))}
          </nav>
        </div>
        <div className="relative w-full lg:w-[320px] group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5898B1]" size={16} />
          <input type="text" placeholder="ابحث هنا..." className="w-full bg-white/60 focus:bg-white border-2 border-transparent focus:border-[#B24686]/10 rounded-[20px] py-2.5 pr-11 pl-5 outline-none font-bold text-sm shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <main className="space-y-20">
        {(activeTab === 'الكل' || activeTab === SectionType.COLORS) && <ColorSection items={filteredData.filter(i => i.section === SectionType.COLORS)} />}
        {(activeTab === 'الكل' || activeTab === SectionType.CONTACT) && <ContactSection items={filteredData.filter(i => i.section === SectionType.CONTACT)} />}
        
        {(activeTab === 'الكل' || activeTab === SectionType.TEXT_BANK) && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTexts.map(text => (
                <div key={text.id} className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 group transition-all hover:shadow-2xl relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#B24686]"><Quote size={20} /></div>
                      <h4 className="font-black text-lg text-[#2B556F]">{text.label}</h4>
                    </div>
                    {isAdmin && <button onClick={() => { setTexts(prev => prev.filter(t => t.id !== text.id)); showToast('تم الحذف'); }} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>}
                  </div>
                  <div onClick={() => handleCopy(text.id, text.content)} className="font-main bg-gray-50/70 p-5 rounded-[24px] text-base font-medium text-gray-700 leading-relaxed border-2 border-dashed border-gray-100 transition-all cursor-pointer hover:bg-white relative">
                    {text.content}
                  </div>
                </div>
              ))}
            </div>
            {isAdmin && <button onClick={() => setIsTextModalOpen(true)} className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[32px] text-gray-400 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"><Plus size={20} /> إضافة نص جديد</button>}
          </div>
        )}

        {(activeTab === 'الكل' || activeTab === SectionType.VISUAL_ASSETS) && <VisualAssetsSection />}
        {(activeTab === 'الكل' || activeTab === SectionType.LINKS) && <LinksSection />}
        {(activeTab === 'الكل' || activeTab === SectionType.FILES) && <FilesSection />}
      </main>

      {/* --- AUTH MODAL --- */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setIsAuthModalOpen(false)} />
          <div className={`relative bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl transition-all duration-300 ${authError ? 'animate-shake' : 'animate-in zoom-in'}`}>
             <div className="w-16 h-16 bg-[#B24686]/10 rounded-[24px] flex items-center justify-center text-[#B24686] mx-auto mb-6">
                <Lock size={32} />
             </div>
             <h2 className="text-2xl font-black text-[#2B556F] text-center mb-2">منطقة المسؤولين</h2>
             <p className="text-gray-400 text-center text-sm font-bold mb-8">يرجى إدخال كلمة المرور للوصول لصلاحيات التعديل</p>
             <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div className="relative">
                   <input 
                      type="password" 
                      autoFocus
                      placeholder="كلمة المرور..." 
                      className={`w-full p-5 rounded-[20px] bg-gray-50 border-2 outline-none font-bold text-center transition-all ${authError ? 'border-red-400 text-red-500' : 'border-transparent focus:border-[#B24686]/20'}`}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                   />
                </div>
                <div className="flex gap-4 pt-4">
                   <button type="submit" className="flex-1 py-5 bg-[#B24686] text-white rounded-[20px] font-black shadow-lg hover:shadow-xl transition-all active:scale-95">دخول</button>
                   <button type="button" onClick={() => setIsAuthModalOpen(false)} className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-[20px] font-black">إلغاء</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* --- ALL OTHER MODALS --- */}
      {isUploadFileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsUploadFileModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-xl font-black text-[#2B556F] mb-6">رفع ملف جديد</h2>
            <div className="space-y-5">
              <div className="w-full py-8 border-2 border-dashed border-gray-200 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all" onClick={() => fileInputRef.current?.click()}>
                 <Upload size={32} className="text-[#5898B1] mb-2" />
                 <span className="font-bold text-gray-400 text-sm">{selectedFilesToUpload ? `${selectedFilesToUpload.length} ملفات مختارة` : 'اختر الملفات'}</span>
                 <input type="file" ref={fileInputRef} hidden multiple onChange={(e) => setSelectedFilesToUpload(e.target.files)} />
              </div>
              <div className="relative">
                 <select className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#B24686]/20 outline-none font-bold appearance-none text-sm" value={targetCategory} onChange={(e) => setTargetCategory(e.target.value)}>
                    <option value="">-- اختر قسم --</option>
                    {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="NEW">قسم جديد...</option>
                 </select>
                 <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {targetCategory === 'NEW' && <input type="text" placeholder="اسم القسم الجديد..." className="w-full p-4 rounded-xl bg-gray-50 border-2 border-[#B24686]/20 outline-none font-bold text-sm" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />}
              <div className="flex gap-4 pt-2">
                <button onClick={async () => {
                   if (selectedFilesToUpload && targetCategory) {
                      const cat = targetCategory === 'NEW' ? newCategoryName : targetCategory;
                      const newFiles = await processFiles(selectedFilesToUpload, cat);
                      setFiles(prev => [...newFiles, ...prev]);
                      setIsUploadFileModalOpen(false);
                      setSelectedFilesToUpload(null);
                      setTargetCategory('');
                      showToast('تم رفع الملفات بنجاح');
                   }
                }} className="flex-1 py-4 bg-[#B24686] text-white rounded-xl font-black shadow-lg disabled:opacity-50">تأكيد الرفع</button>
                <button onClick={() => setIsUploadFileModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-xl font-black">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRenameCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsRenameCategoryModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-xl font-black text-[#2B556F] mb-6">تعديل اسم القسم</h2>
            <div className="space-y-5">
              <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 border-2 border-[#B24686]/20 outline-none font-bold text-sm" placeholder="اسم القسم الجديد..." />
              <div className="flex gap-4 pt-2">
                <button onClick={() => {
                   setFiles(prev => prev.map(f => f.category === targetCategory ? { ...f, category: newCategoryName } : f));
                   setIsRenameCategoryModalOpen(false);
                   showToast('تم تحديث القسم');
                }} className="flex-1 py-4 bg-[#B24686] text-white rounded-xl font-black shadow-lg">حفظ</button>
                <button onClick={() => setIsRenameCategoryModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-xl font-black">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMoveFileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMoveFileModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-xl font-black text-[#2B556F] mb-6">نقل الملف</h2>
            <div className="space-y-5">
               <select className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#B24686]/20 outline-none font-bold appearance-none text-sm" value={targetCategory} onChange={(e) => setTargetCategory(e.target.value)}>
                   {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   <option value="NEW">قسم جديد...</option>
                </select>
                {targetCategory === 'NEW' && <input type="text" placeholder="اسم القسم الجديد..." className="w-full p-4 rounded-xl bg-gray-50 border-2 border-[#B24686]/20 outline-none font-bold text-sm" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />}
              <div className="flex gap-4 pt-2">
                <button onClick={() => {
                   const cat = targetCategory === 'NEW' ? newCategoryName : targetCategory;
                   setFiles(prev => prev.map(f => f.id === fileToMove?.id ? { ...f, category: cat } : f));
                   setIsMoveFileModalOpen(false);
                   showToast('تم نقل الملف بنجاح');
                }} className="flex-1 py-4 bg-[#5898B1] text-white rounded-xl font-black shadow-lg">تأكيد</button>
                <button onClick={() => setIsMoveFileModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-xl font-black">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsLinkModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-xl font-black text-[#2B556F] mb-6">إضافة رابط جديد</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              setLinks(prev => [{ id: Math.random().toString(36).substr(2, 9), label: fd.get('label') as string, url: fd.get('url') as string, category: 'عام' }, ...prev]);
              setIsLinkModalOpen(false);
              showToast('تمت إضافة الرابط');
            }} className="space-y-5">
              <input name="label" required placeholder="اسم الرابط..." className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#B24686]/20 outline-none font-bold text-sm" />
              <input name="url" required placeholder="URL..." className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#B24686]/20 outline-none font-bold text-sm" />
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 py-4 bg-[#B24686] text-white rounded-xl font-black shadow-lg">حفظ</button>
                <button type="button" onClick={() => setIsLinkModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-xl font-black">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTextModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsTextModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-xl font-black text-[#2B556F] mb-6">إضافة نص جديد</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              setTexts(prev => [{ id: Math.random().toString(36).substr(2, 9), label: fd.get('label') as string, content: fd.get('content') as string, category: 'عام' }, ...prev]);
              setIsTextModalOpen(false);
              showToast('تمت إضافة النص');
            }} className="space-y-5">
              <input name="label" required placeholder="عنوان النص..." className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#B24686]/20 outline-none font-bold text-sm" />
              <textarea name="content" required rows={4} placeholder="المحتوى..." className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#B24686]/20 outline-none font-bold text-sm resize-none" />
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 py-4 bg-[#B24686] text-white rounded-xl font-black shadow-lg">حفظ</button>
                <button type="button" onClick={() => setIsTextModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-xl font-black">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setPreviewImage(null)} />
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl animate-in zoom-in duration-300">
             <img src={previewImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl" alt="Preview" />
             <button onClick={() => setPreviewImage(null)} className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"><X size={24} /></button>
          </div>
        </div>
      )}

      <footer className="mt-32 py-16 border-t border-gray-100/50 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/30 opacity-50 -z-10"></div>
        <div className="inline-block relative group">
          <p className="footer-phrase text-lg md:text-xl font-black uppercase tracking-[0.4em] transition-all duration-700">
            جمعية رؤية التنموية الأهلية النسائية بالبكيرية
          </p>
          <div className="mt-4 text-sm md:text-base font-black text-[#D1A7C7] tracking-wide">تحياتي لكم.. أفراح</div>
          <div className="mt-6 flex justify-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#B24686] animate-bounce shadow-sm" style={{ animationDelay: '0s' }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#2B556F] animate-bounce shadow-sm" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#5898B1] animate-bounce shadow-sm" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        <div className="mt-8 text-[9px] font-black text-gray-300 tracking-widest uppercase opacity-40">جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</div>
      </footer>

      <style>{`
        .footer-phrase {
          background: linear-gradient(
            to right, 
            #B24686 20%, 
            #2B556F 40%, 
            #5898B1 60%, 
            #B24686 80%
          );
          background-size: 200% auto;
          color: #000;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 5s linear infinite;
        }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default App;
