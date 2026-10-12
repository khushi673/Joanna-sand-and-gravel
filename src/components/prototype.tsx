'use client';

import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Building2, Check, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Clock3, Construction,
  ExternalLink, Eye, Filter, HardHat, LayoutDashboard, List, LogOut, Mail,
  MapPin, Menu, MessageSquare, Package, Phone, Plus, Search, Send, Settings2,
  ShieldCheck, SlidersHorizontal, Star, Truck, X, Trash2, Pencil, Grid2X2,
  MoreHorizontal, CheckCircle2, AlertCircle, Image as ImageIcon, Users, Save,
} from 'lucide-react';
import {
  banners as seedBanners, categories as seedCategories, initialEnquiries,
  initialReviews, initialTestimonials, locations as seedLocations, products as seedProducts,
  Banner, Category, Enquiry, Location, Product, Review, Testimonial,
} from '@/data/mock';

type View = 'home' | 'materials' | 'locations' | 'delivery' | 'about' | 'contact' | 'reviews' | 'product';
type Toast = { message: string; tone: 'success' | 'error' } | null;
type Props = { children: ReactNode };

const photo = (id: string, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const stars = (value: number) => Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill={i < Math.round(value) ? 'currentColor' : 'none'} />);
const categoryLabel = (id: string, categories: Category[]) => categories.find((item) => item.id === id)?.name ?? id;
const initialSiteContent = { about: 'Construction is personal. Every yard, road, home, and business begins with people showing up and doing the work right. We are proud to be part of that story across Texas.', mission: 'Supply dependable construction materials with honest guidance and service that keeps projects moving.', vision: 'Be the Texas materials partner builders turn to, job after job, generation after generation.', values: 'Safety in every load. Integrity in every conversation. Pride in the work we do together.', serviceArea: 'Approximately 60 miles from each supply location. Actual availability varies by material and project.' };

function AppButton({ children, variant = 'primary', onClick, type = 'button', className = '', disabled = false }: {
  children: ReactNode; variant?: 'primary' | 'outline' | 'quiet' | 'danger'; onClick?: () => void;
  type?: 'button' | 'submit'; className?: string; disabled?: boolean;
}) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`button button-${variant} ${className}`}>{children}</button>;
}

function TextField({ label, value, onChange, type = 'text', required = false, placeholder = '', as = 'input', rows = 4, children }: {
  label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean;
  placeholder?: string; as?: 'input' | 'textarea' | 'select'; rows?: number; children?: ReactNode;
}) {
  const props = { value, required, placeholder, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(event.target.value), 'aria-label': label };
  return <label className="field"><span>{label}{required && <b> *</b>}</span>{as === 'textarea' ? <textarea {...props} rows={rows} /> : as === 'select' ? <select {...props}><option value="">Choose an option</option>{children ?? <><option>Material recommendation</option><option>Delivery</option><option>General question</option><option>Feedback</option><option>Complaint</option></>}</select> : <input {...props} type={type} />}</label>;
}

export default function Prototype({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(seedProducts[0]);
  const [products, setProducts] = useState(seedProducts);
  const [categories, setCategories] = useState(seedCategories);
  const [locations, setLocations] = useState(seedLocations);
  const [banners, setBanners] = useState(seedBanners);
  const [reviews, setReviews] = useState(initialReviews);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [siteContent, setSiteContent] = useState(initialSiteContent);
  const [toast, setToast] = useState<Toast>(null);
  const [admin, setAdmin] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('jps-prototype-data');
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      if (data.products) setProducts(data.products);
      if (data.categories) setCategories(data.categories);
      if (data.locations) setLocations(data.locations);
      if (data.banners) setBanners(data.banners);
      if (data.reviews) setReviews(data.reviews);
      if (data.testimonials) setTestimonials(data.testimonials);
      if (data.enquiries) setEnquiries(data.enquiries);
      if (data.siteContent) setSiteContent(data.siteContent);
      if (localStorage.getItem('jps-admin') === 'true') setAdmin(true);
    } catch { localStorage.removeItem('jps-prototype-data'); }
  }, []);

  useEffect(() => {
    localStorage.setItem('jps-prototype-data', JSON.stringify({ products, categories, locations, banners, reviews, testimonials, enquiries, siteContent }));
  }, [products, categories, locations, banners, reviews, testimonials, enquiries, siteContent]);

  useEffect(() => {
    if (toast) {
      const timeout = window.setTimeout(() => setToast(null), 3400);
      return () => window.clearTimeout(timeout);
    }
  }, [toast]);

  useEffect(() => {
    const count = Math.max(1, banners.filter((item) => item.active).length);
    const interval = window.setInterval(() => setSliderIndex((index) => (index + 1) % count), 6500);
    return () => window.clearInterval(interval);
  }, [banners]);

  const shared = { products, setProducts, categories, setCategories, locations, setLocations, banners, setBanners, reviews, setReviews, testimonials, setTestimonials, enquiries, setEnquiries, setToast };
  if (pathname.startsWith('/admin')) return <AdminExperience {...shared} siteContent={siteContent} setSiteContent={setSiteContent} toast={toast} admin={admin} setAdmin={setAdmin} router={router} />;

  if (pathname === '/mobile-preview') return <>
    <CustomerExperience {...shared} siteContent={siteContent} view={view} setView={setView} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} sliderIndex={sliderIndex} setSliderIndex={setSliderIndex} />
    {toast && <ToastMessage toast={toast} />}
    {children}
  </>;

  return <>
    <div className="customer-preview">
      <div className="customer-device">
        <iframe title="Joanna Sand & Gravel mobile app preview" src="/mobile-preview" />
      </div>
    </div>
    {children}
  </>;
}

function ToastMessage({ toast }: { toast: Exclude<Toast, null> }) {
  return <div className={`toast toast-${toast.tone}`} role="status"><span>{toast.tone === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}</span>{toast.message}</div>;
}

function CustomerExperience({ products, categories, locations, banners, reviews, testimonials, enquiries, setEnquiries, setReviews, setToast, siteContent, view, setView, selectedProduct, setSelectedProduct, sliderIndex, setSliderIndex }: any) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [materialPage, setMaterialPage] = useState(1);
  const [listMode, setListMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeLocation, setActiveLocation] = useState(locations[0]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [contact, setContact] = useState({ name: '', email: '', phone: '', subject: '', type: '', message: '' });
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const activeBanners = banners.filter((item: Banner) => item.active);
  const currentBanner = activeBanners[sliderIndex % Math.max(1, activeBanners.length)] ?? banners[0];
  const filteredProducts = useMemo(() => products.filter((product: Product) => {
    const textMatch = `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    const categoryMatch = category === 'all' || product.category === category;
    const materialMatch = materialFilter === 'all' || product.size.toLowerCase().includes(materialFilter);
    return textMatch && categoryMatch && materialMatch;
  }), [products, query, category, materialFilter]);
  const materialPageSize = 12;
  const materialPageCount = Math.max(1, Math.ceil(filteredProducts.length / materialPageSize));
  const visibleProducts = filteredProducts.slice((materialPage - 1) * materialPageSize, materialPage * materialPageSize);

  useEffect(() => { setMaterialPage(1); }, [query, category, materialFilter]);
  useEffect(() => { setMaterialPage((page) => Math.min(page, materialPageCount)); }, [materialPageCount]);

  const navigate = (next: View) => { setView(next); setMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const submitEnquiry = (event: FormEvent<HTMLFormElement>, typeOverride?: string) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const entry: Enquiry = { id: `EN-${1050 + enquiries.length}`, ...contact, type: typeOverride ?? contact.type, status: 'New', date: 'Oct 12, 2026' };
    setEnquiries((current: Enquiry[]) => [entry, ...current]);
    setContact({ name: '', email: '', phone: '', subject: '', type: '', message: '' });
    setToast({ tone: 'success', message: 'Your enquiry is ready. Our team will be in touch.' });
  };
  const handleReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) { setToast({ tone: 'error', message: 'Add your name and review before submitting.' }); return; }
    setReviews((current: Review[]) => [{ id: `rv-${Date.now()}`, productId: selectedProduct.id, author: reviewName, rating: reviewRating, text: reviewText, date: 'Oct 12, 2026', status: 'Pending' }, ...current]);
    setReviewName(''); setReviewText(''); setReviewFormOpen(false);
    setToast({ tone: 'success', message: 'Thanks. Your review has been submitted for moderation.' });
  };

  return <div className="customer-app">
    <aside className="customer-sidebar">
      <button className="brand customer-sidebar-brand" onClick={() => navigate('home')} aria-label="Joanna Sand and Gravel home"><span className="brand-mark"><Construction size={21} strokeWidth={2.4} /></span><span><strong>JOANNA</strong><small>PERUZZI-SCHAEFER · SAND & GRAVEL</small></span></button>
      <span className="customer-sidebar-label">WORKSPACE</span>
      <nav className="customer-sidebar-nav" aria-label="Customer app navigation">
        {([['home', 'Home', <Building2 key="home" />], ['materials', 'Materials', <Package key="materials" />], ['locations', 'Locations', <MapPin key="locations" />], ['contact', 'Contact', <MessageSquare key="contact" />]] as [View, string, ReactNode][]).map(([id, label, icon]) => <button key={id} className={view === id || (id === 'materials' && view === 'product') ? 'active' : ''} onClick={() => navigate(id)}>{icon}<span>{label}</span>{id === 'materials' && <small>{products.length}</small>}</button>)}
      </nav>
      <span className="customer-sidebar-label secondary-label">MORE</span>
      <nav className="customer-sidebar-nav" aria-label="More customer pages">
        {([['delivery', 'Delivery', <Truck key="delivery" />], ['about', 'Our company', <CircleHelp key="about" />], ['reviews', 'Customer stories', <Star key="reviews" />]] as [View, string, ReactNode][]).map(([id, label, icon]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => navigate(id)}>{icon}<span>{label}</span></button>)}
      </nav>
      <div className="customer-sidebar-bottom"><span className="service-status"><i /> Texas service network</span><small>Five sample locations · Approx. 60-mile service areas</small><button onClick={() => { localStorage.removeItem('jps-admin'); window.location.href = '/admin'; }}><ShieldCheck size={15} /> Admin panel <ArrowUp size={13} /></button></div>
    </aside>
    <div className="customer-workspace">
    <div className="announcement"><span>Serving Texas builders since day one</span><a onClick={() => navigate('locations')}>Five locations across Texas <ArrowRight size={13} /></a></div>
    <header className="customer-header">
      <div className="workspace-title"><span>JOANNA PERUZZI-SCHAEFER · CUSTOMER APP</span><strong>{view === 'home' ? 'Overview' : view === 'product' ? selectedProduct.name : ({ materials: 'Materials', locations: 'Locations', delivery: 'Delivery information', about: 'Our company', contact: 'Contact', reviews: 'Customer stories' } as Record<string, string>)[view]}</strong></div>
      <button className="brand" onClick={() => navigate('home')} aria-label="Joanna Sand and Gravel home"><span className="brand-mark"><Construction size={21} strokeWidth={2.4} /></span><span><strong>JOANNA</strong><small>PERUZZI-SCHAEFER · SAND & GRAVEL</small></span></button>
      <nav className="desktop-nav" aria-label="Main navigation">
        {([['home', 'Home'], ['materials', 'Materials'], ['locations', 'Locations'], ['delivery', 'Delivery'], ['about', 'Our Company']] as [View, string][]).map(([id, label]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => navigate(id)}>{label}</button>)}
      </nav>
      <div className="header-actions"><button className="admin-link" onClick={() => { localStorage.removeItem('jps-admin'); window.location.href = '/admin'; }}><ShieldCheck size={15} /> Admin</button><AppButton onClick={() => navigate('contact')}>Talk to our team <ArrowRight size={15} /></AppButton><button className="mobile-menu-button" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button></div>
      {mobileMenu && <div className="mobile-menu">{([['home', 'Home'], ['materials', 'Explore materials'], ['locations', 'Our locations'], ['delivery', 'Delivery information'], ['about', 'Our company'], ['reviews', 'Customer stories'], ['contact', 'Contact us']] as [View, string][]).map(([id, label]) => <button key={id} onClick={() => navigate(id)}>{label}<ArrowRight size={15} /></button>)}</div>}
    </header>
    <main>
      {view === 'home' && <HomeView currentBanner={currentBanner} banners={activeBanners} sliderIndex={sliderIndex} setSliderIndex={setSliderIndex} navigate={navigate} testimonials={testimonials} siteContent={siteContent} materialsCount={products.length} />}
      {view === 'materials' && <MaterialsView products={visibleProducts} totalProducts={filteredProducts.length} page={materialPage} pageSize={materialPageSize} onPageChange={setMaterialPage} categories={categories} query={query} setQuery={setQuery} category={category} setCategory={setCategory} materialFilter={materialFilter} setMaterialFilter={setMaterialFilter} listMode={listMode} setListMode={setListMode} onSelect={(product: Product) => { setSelectedProduct(product); navigate('product'); }} />}
      {view === 'product' && <ProductView product={selectedProduct} categories={categories} reviews={reviews.filter((item: Review) => item.productId === selectedProduct.id && item.status !== 'Rejected')} reviewFormOpen={reviewFormOpen} setReviewFormOpen={setReviewFormOpen} rating={reviewRating} setRating={setReviewRating} reviewText={reviewText} setReviewText={setReviewText} reviewName={reviewName} setReviewName={setReviewName} handleReview={handleReview} navigate={navigate} />}
      {view === 'locations' && <LocationsView locations={locations} active={activeLocation} setActive={setActiveLocation} navigate={navigate} />}
      {view === 'delivery' && <DeliveryView navigate={navigate} contact={contact} setContact={setContact} submitEnquiry={submitEnquiry} />}
      {view === 'about' && <AboutView testimonials={testimonials} navigate={navigate} siteContent={siteContent} />}
      {view === 'reviews' && <TestimonialsView testimonials={testimonials} navigate={navigate} />}
      {view === 'contact' && <ContactView contact={contact} setContact={setContact} submitEnquiry={submitEnquiry} locations={locations} />}
    </main>
    <Footer navigate={navigate} />
    </div>
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{([['home', 'Home', <Building2 key="i" />], ['materials', 'Materials', <Package key="i" />], ['locations', 'Locations', <MapPin key="i" />], ['contact', 'Contact', <MessageSquare key="i" />]] as [View, string, ReactNode][]).map(([id, label, icon]) => <button key={id} className={view === id || (id === 'materials' && view === 'product') ? 'active' : ''} onClick={() => navigate(id)}>{icon}<span>{label}</span></button>)}</nav>
  </div>;
}

function HomeView({ currentBanner, banners, sliderIndex, setSliderIndex, navigate, testimonials, siteContent, materialsCount }: any) {
  return <>
    <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(17,19,19,.84) 0%, rgba(17,19,19,.54) 47%, rgba(17,19,19,.10) 100%), url('${photo(currentBanner.image)}')` }}>
      <div className="hero-content"><div className="eyebrow"><span /> {currentBanner.eyebrow}</div><h1>{currentBanner.headline}</h1><p>Materials you can count on. People who know the work. Delivery that keeps your Texas project moving.</p><div className="hero-actions"><AppButton onClick={() => navigate('materials')}>Explore materials <ArrowRight size={16} /></AppButton><button className="hero-secondary" onClick={() => navigate('locations')}><MapPin size={16} /> Find a location</button></div><div className="hero-trust"><span><b>74+</b> material options</span><i /><span><b>5</b> Texas locations</span><i /><span><b>10+</b> dump trucks</span></div></div>
      <div className="hero-controls"><span>0{sliderIndex + 1} <i /> 0{banners.length}</span><button aria-label="Previous banner" onClick={() => setSliderIndex((sliderIndex + banners.length - 1) % banners.length)}><ChevronLeft /></button><button aria-label="Next banner" onClick={() => setSliderIndex((sliderIndex + 1) % banners.length)}><ChevronRight /></button></div>
    </section>
    <section className="home-quick"><div><span className="section-kicker">Here for the whole job</span><h2>Good work starts<br />with solid ground.</h2></div><div className="quick-links"><button onClick={() => navigate('materials')}><span className="quick-icon"><Package /></span><strong>Explore materials</strong><small>Find the right fit for your project</small><ArrowRight /></button><button onClick={() => navigate('locations')}><span className="quick-icon"><MapPin /></span><strong>Our locations</strong><small>Five local Texas supply points</small><ArrowRight /></button><button onClick={() => navigate('contact')}><span className="quick-icon"><MessageSquare /></span><strong>Contact our team</strong><small>Real answers from people who know</small><ArrowRight /></button></div></section>
    <section className="intro-band"><div className="intro-photo" style={{ backgroundImage: `url('${photo('photo-1504917595217-d4dc5ebe6122', 1100)}')` }}><span>From the quarry to your jobsite</span></div><div className="intro-copy"><span className="section-kicker">Rooted in Texas</span><h2>We know what it takes to get the job done.</h2><p>{siteContent.about}</p><AppButton variant="outline" onClick={() => navigate('about')}>Get to know us <ArrowRight size={15} /></AppButton></div></section>
    <section className="values-section"><div className="section-heading"><span className="section-kicker">How we show up</span><h2>Our foundation is more than material.</h2></div><div className="values-grid"><article><span>01</span><h3>Our mission</h3><p>{siteContent.mission}</p></article><article><span>02</span><h3>Our vision</h3><p>{siteContent.vision}</p></article><article><span>03</span><h3>Our values</h3><p>{siteContent.values}</p></article></div></section>
    <section className="fleet-strip"><div className="fleet-icon"><Truck size={38} /></div><div><span className="section-kicker">A fleet built for the haul</span><h2>10+ dump trucks. Five Texas locations. One dependable team.</h2></div><AppButton variant="outline" onClick={() => navigate('delivery')}>Delivery information <ArrowRight size={15} /></AppButton></section>
    <section className="testimonial-section"><div className="section-heading"><span className="section-kicker">Good word travels</span><h2>Trusted by the people doing the work.</h2></div><div className="testimonial-grid">{testimonials.filter((item: Testimonial) => item.featured && item.status === 'Approved').slice(0, 2).map((item: Testimonial) => <article key={item.id} className="testimonial-card"><div className="stars">{stars(5)}</div><blockquote>“{item.text}”</blockquote><div className="testimonial-author"><span>{item.author.split(' ').map((part: string) => part[0]).join('')}</span><div><strong>{item.author}</strong><small>{item.company}</small></div></div></article>)}</div><button className="text-link" onClick={() => navigate('reviews')}>Read more customer stories <ArrowRight size={15} /></button></section>
    <ContactCta navigate={navigate} />
  </>;
}

function MaterialsView({ products, totalProducts, page, pageSize, onPageChange, categories, query, setQuery, category, setCategory, materialFilter, setMaterialFilter, listMode, setListMode, onSelect }: any) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount = Number(category !== 'all') + Number(materialFilter !== 'all');
  return <div className="page-wrap"><div className="page-intro"><span className="section-kicker">Materials catalog</span><h1>Find the right ground<br className="desktop-only" /> for your next project.</h1><p>Explore our range of sand, gravel, stone, base, and fill materials. Need a recommendation? Our team is happy to help.</p></div>
    <div className="catalog-toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search materials..." aria-label="Search materials" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}</label><div className={`toolbar-actions ${filtersOpen ? 'filters-open' : ''}`}><button className="mobile-filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} /><span>Filters{activeFilterCount > 0 && <b>{activeFilterCount}</b>}</span><ChevronDown size={15} /></button><div className="filter-controls"><label className="select-wrap"><Filter size={15} /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{categories.map((item: Category) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown size={14} /></label><label className="select-wrap"><SlidersHorizontal size={15} /><select value={materialFilter} onChange={(event) => setMaterialFilter(event.target.value)} aria-label="Filter by size"><option value="all">Any size</option><option value="fine">Fine</option><option value="3/8">3/8 in.</option><option value="1/2">1/2–3/4 in.</option><option value="3/4">3/4 in.</option><option value="1–2">1–2 in.</option></select><ChevronDown size={14} /></label><button className="mobile-filter-done" onClick={() => setFiltersOpen(false)}>Done</button></div><div className="view-switch"><button className={!listMode ? 'selected' : ''} aria-label="Grid view" onClick={() => setListMode(false)}><Grid2X2 size={17} /></button><button className={listMode ? 'selected' : ''} aria-label="List view" onClick={() => setListMode(true)}><List size={18} /></button></div></div></div>
    <div className="catalog-result"><span>{totalProducts ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalProducts)} of ${totalProducts} materials` : '0 materials'}</span><span>Showing sample catalog · No prices displayed</span></div>
    {products.length ? <div className={listMode ? 'product-grid list-mode' : 'product-grid'}>{products.map((product: Product) => <button key={product.id} className="material-card" onClick={() => onSelect(product)}><span className="material-image" style={{ backgroundImage: `url('${product.image}')` }}><span className="material-category">{categoryLabel(product.category, categories)}</span><span className="material-card-arrow"><ArrowUp size={15} /></span></span><span className="material-card-copy"><strong>{product.name}</strong><span>{product.description}</span><small>Typical size · {product.size}</small></span></button>)}</div> : <div className="empty-state"><Package size={28} /><h3>No materials match those filters.</h3><p>Try another search or clear the selected category.</p><AppButton variant="outline" onClick={() => { setQuery(''); setCategory('all'); setMaterialFilter('all'); }}>Clear filters</AppButton></div>}
    {totalProducts > pageSize && <Pagination page={page} pageSize={pageSize} totalItems={totalProducts} onPageChange={onPageChange} label="materials" />}
  </div>;
}

function Pagination({ page, pageSize, totalItems, onPageChange, label }: { page: number; pageSize: number; totalItems: number; onPageChange: (page: number) => void; label: string }) {
  const pageCount = Math.ceil(totalItems / pageSize);
  if (pageCount <= 1) return null;
  return <nav className="pagination" aria-label={`${label} pages`}>
    <span className="pagination-summary">Page {page} of {pageCount}</span>
    <div className="pagination-controls">
      <button className="pagination-arrow" aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={16} /><span>Previous</span></button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} className={`pagination-number ${page === number ? 'active' : ''}`} aria-label={`Page ${number}`} aria-current={page === number ? 'page' : undefined} onClick={() => onPageChange(number)}>{number}</button>)}
      <button className="pagination-arrow" aria-label="Next page" disabled={page === pageCount} onClick={() => onPageChange(page + 1)}><span>Next</span><ChevronRight size={16} /></button>
    </div>
  </nav>;
}

function ProductView({ product, categories, reviews, reviewFormOpen, setReviewFormOpen, rating, setRating, reviewText, setReviewText, reviewName, setReviewName, handleReview, navigate }: any) {
  const [imageIndex, setImageIndex] = useState(0);
  const galleryImages = [product.image, photo('photo-1516937941344-00b4e0337589', 1000), photo('photo-1518709268805-4e9042af9f23', 1000)];
  return <div className="page-wrap product-detail"><button className="back-link" onClick={() => navigate('materials')}><ArrowLeft size={16} /> All materials</button><div className="product-detail-grid"><div className="product-gallery"><div className="product-main-image" style={{ backgroundImage: `url('${galleryImages[imageIndex]}')` }}><span>{categoryLabel(product.category, categories)}</span></div><div className="gallery-thumbs">{galleryImages.map((image: string, index: number) => <button key={image} className={imageIndex === index ? 'selected' : ''} style={{ backgroundImage: `url('${image}')` }} aria-label={`Material photo ${index + 1}`} onClick={() => setImageIndex(index)} />)}</div></div><div className="product-info"><span className="section-kicker">{categoryLabel(product.category, categories)}</span><h1>{product.name}</h1><div className="product-rating"><span className="stars">{stars(product.rating)}</span><b>{product.rating}</b><span>({product.reviewCount} reviews)</span></div><p>{product.description}</p><div className="spec-list"><div><span>Typical aggregate size</span><strong>{product.size}</strong></div><div><span>Appearance</span><strong>{product.color}</strong></div><div><span>Category</span><strong>{categoryLabel(product.category, categories)}</strong></div><div><span>Typical applications</span><strong>{product.uses.join(' · ')}</strong></div></div><div className="product-cta"><AppButton onClick={() => navigate('contact')}>Request information <ArrowRight size={15} /></AppButton><small>Specifications may vary by source. Ask our team for project-specific guidance.</small></div></div></div>
    <section className="product-reviews"><div className="section-heading inline"><div><span className="section-kicker">From the jobsite</span><h2>Customer reviews</h2></div><AppButton variant="outline" onClick={() => setReviewFormOpen(!reviewFormOpen)}><Plus size={15} /> Write a review</AppButton></div>{reviewFormOpen && <form className="review-form" onSubmit={handleReview}><h3>Share your experience</h3><TextField label="Your name" value={reviewName} onChange={setReviewName} required placeholder="Name or initials" /><fieldset className="rating-input"><legend>Your rating *</legend>{[1, 2, 3, 4, 5].map((number) => <button key={number} type="button" aria-label={`${number} stars`} onClick={() => setRating(number)}><Star size={21} fill={number <= rating ? 'currentColor' : 'none'} /></button>)}</fieldset><TextField label="Your review" value={reviewText} onChange={setReviewText} required as="textarea" placeholder="What should other customers know?" /><AppButton type="submit"><Send size={15} /> Submit review</AppButton></form>}
      {reviews.length ? <div className="review-list">{reviews.map((item: Review) => <article key={item.id} className="review-item"><div className="review-top"><strong>{item.author}</strong><span className="stars">{stars(item.rating)}</span></div><p>{item.text}</p><small>{item.date} · {item.status === 'Pending' ? 'Awaiting moderation' : 'Verified customer'}</small></article>)}</div> : <div className="empty-state compact"><MessageSquare size={23} /><h3>No reviews yet</h3><p>Be the first to share feedback on this material.</p></div>}</section>
  </div>;
}

function LocationsView({ locations, active, setActive, navigate }: any) {
  return <div className="page-wrap"><div className="page-intro compact-intro"><span className="section-kicker">Close to the work</span><h1>Five Texas locations.<br />One dependable partner.</h1><p>Sample locations shown for demonstration only. Typical service area extends approximately 60 miles from each location; coverage varies by material and project.</p></div><div className="locations-layout"><div className="location-list">{locations.map((location: Location) => <button key={location.id} className={`location-row ${active.id === location.id ? 'selected' : ''}`} onClick={() => setActive(location)}><span className="location-pin"><MapPin size={18} /></span><span><strong>{location.name}</strong><small>{location.address}<br />{location.city}</small><small><Clock3 size={13} /> {location.hours}</small></span><ChevronRight size={18} /></button>)}</div><div className="map-panel"><div className="map-topline"><span><MapPin size={15} /> TEXAS SERVICE NETWORK</span><small>Illustrative map · Sample locations</small></div><div className="texas-map"><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-shape" /><div className="map-label label-dallas">DALLAS</div><div className="map-label label-austin">AUSTIN</div><div className="map-label label-houston">HOUSTON</div><div className="map-label label-san">SAN ANTONIO</div>{locations.map((location: Location, index: number) => <button key={location.id} aria-label={location.city} className={`map-marker ${active.id === location.id ? 'active' : ''}`} style={{ left: `${location.x}%`, top: `${location.y}%` }} onClick={() => setActive(location)}><span>{index + 1}</span></button>)}</div><div className="map-selected"><div><span className="section-kicker">Selected sample location</span><h3>{active.name}</h3><p>{active.address}, {active.city}</p></div><div className="map-actions"><button className="icon-text-button" onClick={() => window.alert(`Sample directions for ${active.city}. Map routing is not connected in this prototype.`)}><ExternalLink size={14} /> Get directions</button><button className="icon-text-button" onClick={() => navigate('contact')}><Phone size={14} /> Contact location</button></div></div></div></div><div className="location-note"><CircleHelp size={19} /><span><strong>Planning a delivery?</strong> Service is generally available within about 60 miles of a yard. Tell us where your project is and our team can confirm coverage.</span><button className="text-link" onClick={() => navigate('delivery')}>Delivery details <ArrowRight size={14} /></button></div></div>;
}

function DeliveryView({ navigate, contact, setContact, submitEnquiry }: any) {
  return <div className="page-wrap"><div className="delivery-hero"><div><span className="section-kicker">Dependable from dispatch</span><h1>A fleet that keeps<br />your project moving.</h1><p>With 10+ dump trucks and five Texas supply points, we work with your team to coordinate material delivery around the realities of your site and schedule.</p><AppButton onClick={() => document.getElementById('delivery-form')?.scrollIntoView({ behavior: 'smooth' })}>Ask about delivery <ArrowDown size={15} /></AppButton></div><div className="delivery-image" style={{ backgroundImage: `url('${photo('photo-1504917595217-d4dc5ebe6122', 1200)}')` }}><span><Truck size={17} /> 10+ dump trucks</span></div></div><div className="delivery-facts"><article><span>01</span><Truck /><h3>10+ dump trucks</h3><p>A working fleet ready to move bulk materials across our Texas service network.</p></article><article><span>02</span><MapPin /><h3>About 60 miles</h3><p>Typical coverage radiates from each yard, with actual availability confirmed per project.</p></article><article><span>03</span><Clock3 /><h3>Built around your site</h3><p>Our team coordinates access, timing, material, and delivery details with you.</p></article></div><div className="delivery-form-section" id="delivery-form"><div><span className="section-kicker">Let's talk logistics</span><h2>Tell us where you're building.</h2><p>Share a few details and our team can help you understand the next steps. This demo stores requests locally only.</p><button className="text-link" onClick={() => navigate('locations')}>See sample service locations <ArrowRight size={14} /></button></div><form className="contact-form" onSubmit={(event) => submitEnquiry(event, 'Delivery')}><TextField label="Your name" value={contact.name} onChange={(value) => setContact({ ...contact, name: value })} required /><TextField label="Email address" type="email" value={contact.email} onChange={(value) => setContact({ ...contact, email: value })} required /><TextField label="Project location" value={contact.subject} onChange={(value) => setContact({ ...contact, subject: value })} required placeholder="City or ZIP code" /><TextField label="What are you planning?" value={contact.message} onChange={(value) => setContact({ ...contact, message: value })} as="textarea" required placeholder="Material, approximate timing, site access..." /><AppButton type="submit">Request delivery information <ArrowRight size={15} /></AppButton><small>Submitting does not schedule or track a delivery.</small></form></div></div>;
}

function AboutView({ testimonials, navigate, siteContent }: any) {
  return <div className="page-wrap"><div className="about-hero"><span className="section-kicker">Our company</span><h1>Grounded in the work.<br />Here for the people.</h1><p>{siteContent.about}</p></div><div className="about-image" style={{ backgroundImage: `url('${photo('photo-1504307651254-35680f356dfd')}')` }}><span>Texas materials. Texas work ethic.</span></div><section className="values-section about-values"><div className="section-heading"><span className="section-kicker">What guides us</span><h2>Practical values, lived every day.</h2></div><div className="values-grid"><article><span>01</span><h3>Mission</h3><p>{siteContent.mission}</p></article><article><span>02</span><h3>Vision</h3><p>{siteContent.vision}</p></article><article><span>03</span><h3>Core values</h3><p>{siteContent.values}</p></article></div></section><div className="team-section"><div><span className="section-kicker">The people behind the load</span><h2>Good work takes a good team.</h2><p>From the yard to dispatch to the jobsite, our people bring hands-on experience, local knowledge, and pride in doing things right.</p><AppButton variant="outline" onClick={() => navigate('contact')}>Meet our team <ArrowRight size={15} /></AppButton></div><div className="team-collage"><div style={{ backgroundImage: `url('${photo('photo-1560250097-0b93528c311a', 500)}')` }}><strong>Operations</strong><small>Keeping every yard moving</small></div><div style={{ backgroundImage: `url('${photo('photo-1581091226825-a6a2a5aee158', 500)}')` }}><strong>On the ground</strong><small>Real people. Real projects.</small></div><div style={{ backgroundImage: `url('${photo('photo-1500648767791-00dcc994a43e', 500)}')` }}><strong>Local expertise</strong><small>Here to help you build</small></div></div></div><TestimonialsInline testimonials={testimonials} navigate={navigate} /></div>;
}

function TestimonialsInline({ testimonials, navigate }: any) {
  return <section className="testimonial-section"><div className="section-heading"><span className="section-kicker">The word from the field</span><h2>Built on relationships.</h2></div><div className="testimonial-grid">{testimonials.filter((item: Testimonial) => item.status === 'Approved').slice(0, 2).map((item: Testimonial) => <article key={item.id} className="testimonial-card"><div className="stars">{stars(5)}</div><blockquote>“{item.text}”</blockquote><div className="testimonial-author"><span>{item.author[0]}</span><div><strong>{item.author}</strong><small>{item.company}</small></div></div></article>)}</div><button className="text-link" onClick={() => navigate('reviews')}>More customer stories <ArrowRight size={15} /></button></section>;
}

function TestimonialsView({ testimonials, navigate }: any) {
  const approved = testimonials.filter((item: Testimonial) => item.status === 'Approved');
  return <div className="page-wrap"><div className="page-intro compact-intro"><span className="section-kicker">Reviews & testimonials</span><h1>Good work is worth<br />talking about.</h1><p>Stories from the people building Texas. Product-specific material reviews are listed on each material detail page.</p></div><div className="testimonial-grid testimonial-page-grid">{approved.length ? approved.map((item: Testimonial) => <article key={item.id} className="testimonial-card"><div className="stars">{stars(5)}</div><blockquote>“{item.text}”</blockquote><div className="testimonial-author"><span>{item.author[0]}</span><div><strong>{item.author}</strong><small>{item.company}</small></div></div></article>) : <div className="empty-state">No testimonials are published right now.</div>}</div><div className="review-callout"><div><span className="section-kicker">Have a material in mind?</span><h2>Share feedback on a specific product.</h2></div><AppButton onClick={() => navigate('materials')}>Browse materials <ArrowRight size={15} /></AppButton></div></div>;
}

function ContactView({ contact, setContact, submitEnquiry, locations }: any) {
  return <div className="page-wrap"><div className="contact-page-head"><span className="section-kicker">Contact us</span><h1>Good conversations<br />build good projects.</h1><p>Tell us what you're working on. We'll connect you with the right person on our team.</p></div><div className="contact-layout"><form className="contact-form main-contact-form" onSubmit={submitEnquiry}><div className="form-two-col"><TextField label="Your name" value={contact.name} onChange={(value) => setContact({ ...contact, name: value })} required placeholder="Full name" /><TextField label="Email address" type="email" value={contact.email} onChange={(value) => setContact({ ...contact, email: value })} required placeholder="you@company.com" /><TextField label="Phone number" type="tel" value={contact.phone} onChange={(value) => setContact({ ...contact, phone: value })} placeholder="(555) 010-0000" /><TextField label="Subject" value={contact.subject} onChange={(value) => setContact({ ...contact, subject: value })} required placeholder="How can we help?" /></div><TextField label="Enquiry type" value={contact.type} onChange={(value) => setContact({ ...contact, type: value })} as="select" required /><TextField label="Message" value={contact.message} onChange={(value) => setContact({ ...contact, message: value })} required as="textarea" placeholder="Share a little about your project or feedback..." /><div className="form-submit-row"><small>Sample contact details for this interactive prototype.</small><AppButton type="submit">Send enquiry <Send size={15} /></AppButton></div></form><aside className="contact-aside"><span className="aside-mark"><Construction size={22} /></span><span className="section-kicker">Let's get to work</span><h3>Talk with our team.</h3><p>Our sample locations use placeholder contact details. Submissions are stored in this demo, not delivered to a real inbox.</p><div className="contact-aside-line"><MapPin /><span><strong>Five Texas locations</strong><small>Approximately 60-mile typical service areas</small></span></div><div className="contact-aside-line"><Truck /><span><strong>10+ dump trucks</strong><small>Delivery questions and project coordination</small></span></div><button className="text-link" onClick={() => window.alert(`${locations.length} sample locations are available in the Locations section.`)}>View locations <ArrowRight size={14} /></button></aside></div></div>;
}

function ContactCta({ navigate }: any) {
  return <section className="contact-cta"><div><span className="section-kicker">Let's get your project moving</span><h2>Have a material question?<br />We'd like to help.</h2></div><AppButton onClick={() => navigate('contact')}>Talk to our team <ArrowRight size={15} /></AppButton></section>;
}

function Footer({ navigate }: any) {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><button className="brand" onClick={() => navigate('home')}><span className="brand-mark"><Construction size={20} /></span><span><strong>JOANNA</strong><small>PERUZZI-SCHAEFER · SAND & GRAVEL</small></span></button><p>Quality materials. Reliable delivery.<br />Proud to serve the people building Texas.</p></div><div><strong>Explore</strong><button onClick={() => navigate('materials')}>Materials</button><button onClick={() => navigate('locations')}>Locations</button><button onClick={() => navigate('delivery')}>Delivery</button></div><div><strong>Company</strong><button onClick={() => navigate('about')}>About us</button><button onClick={() => navigate('reviews')}>Customer stories</button><button onClick={() => navigate('contact')}>Contact</button></div><div className="footer-contact"><strong>Here when you need us.</strong><p>Sample company contact details<br />Use the enquiry form to get in touch.</p><button className="text-link" onClick={() => navigate('contact')}>Send an enquiry <ArrowRight size={14} /></button></div></div><div className="footer-bottom"><span>© 2026 Joanna Peruzzi-Schaeper Sand & Gravel</span><span>Serving Texas builders and communities</span></div></footer>;
}

const adminNav = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Filter },
  { id: 'banners', label: 'Banners', icon: ImageIcon },
  { id: 'reviews', label: 'Reviews & testimonials', icon: Star },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'content', label: 'Site content', icon: Settings2 },
  { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
];

function AdminExperience({ products, setProducts, categories, setCategories, locations, setLocations, banners, setBanners, reviews, setReviews, testimonials, setTestimonials, enquiries, setEnquiries, setToast, siteContent, setSiteContent, toast, admin, setAdmin, router }: any) {
  const [section, setSection] = useState('overview');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'product' | 'category' | 'banner' | 'location' | 'enquiry' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loginChoice, setLoginChoice] = useState(false);
  const flash = (message: string, tone: 'success' | 'error' = 'success') => setToast({ message, tone });
  const logout = () => { localStorage.removeItem('jps-admin'); setAdmin(false); setLoginChoice(false); router.replace('/admin'); };
  const signIn = (asAdmin: boolean) => {
    if (!asAdmin) { router.replace('/'); return; }
    localStorage.setItem('jps-admin', 'true'); setAdmin(true); setLoginChoice(true);
  };
  const askDelete = (label: string) => window.confirm(`Delete ${label}? This action cannot be undone.`);
  const openModal = (type: NonNullable<typeof modal>, item: any = null) => { setEditing(item); setModal(type); };
  const closeModal = () => { setModal(null); setEditing(null); };
  const setReviewStatus = (id: string, status: Review['status']) => { setReviews((current: Review[]) => current.map((item: Review) => item.id === id ? { ...item, status } : item)); flash(`Review ${status.toLowerCase()}.`); };

  if (!admin) return <div className="admin-login"><div className="login-panel"><div className="login-brand"><span className="brand-mark"><Construction size={22} /></span><span><strong>JOANNA</strong><small>PERUZZI-SCHAEFER · SAND & GRAVEL</small></span></div><span className="section-kicker">Prototype access</span><h1>Welcome back.</h1><p>Choose a demo experience to continue.</p><div className="login-options"><button onClick={() => signIn(false)}><span><Users size={19} /></span><div><strong>Continue as User</strong><small>Explore the customer-facing experience</small></div><ArrowRight size={17} /></button><button onClick={() => signIn(true)}><span><ShieldCheck size={19} /></span><div><strong>Continue as Admin</strong><small>Manage the prototype dashboard</small></div><ArrowRight size={17} /></button></div><small className="login-note">Demo sign-in only · No password required</small></div><div className="login-image" style={{ backgroundImage: `linear-gradient(0deg, rgba(20,22,22,.50), rgba(20,22,22,.05)), url('${photo('photo-1504917595217-d4dc5ebe6122')}')` }}><span>Good work starts with good ground.</span></div></div>;

  const selectedLabel = adminNav.find((item) => item.id === section)?.label ?? 'Overview';
  return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand"><span className="brand-mark"><Construction size={19} /></span><span><strong>JOANNA</strong><small>ADMIN CONSOLE</small></span></div><div className="admin-workspace"><span className="workspace-dot" /><span><strong>Demo workspace</strong><small>Prototype environment</small></span><ChevronDown size={14} /></div><span className="admin-nav-label">WORKSPACE</span><nav>{adminNav.map(({ id, label, icon: Icon }) => <button key={id} className={section === id ? 'active' : ''} onClick={() => { setSection(id); setSearch(''); setSelectedEnquiry(null); }}><Icon size={17} /><span>{label}</span>{id === 'enquiries' && enquiries.filter((item: Enquiry) => item.status === 'New').length > 0 && <i>{enquiries.filter((item: Enquiry) => item.status === 'New').length}</i>}</button>)}</nav><div className="sidebar-bottom"><div className="admin-user"><span className="user-avatar">JP</span><span><strong>Joanna Admin</strong><small>Administrator</small></span><MoreHorizontal size={17} /></div><button className="logout-button" onClick={logout}><LogOut size={16} /> Sign out</button></div></aside>
    <div className="admin-main"><header className="admin-topbar"><div className="breadcrumb"><span>Admin</span><ChevronRight size={14} /><strong>{selectedLabel}</strong></div><div className="topbar-right"><span className="demo-badge"><span /> Demo mode</span><button className="topbar-user" aria-label="Sign out" onClick={logout}><span className="user-avatar">JP</span><ChevronDown size={14} /></button></div></header><main className="admin-content"><div className="admin-page-head"><div><span className="admin-date">MONDAY, OCTOBER 12, 2026</span><h1>{section === 'overview' ? 'Good morning, Joanna' : selectedLabel}</h1><p>{section === 'overview' ? 'Here’s what’s happening across your materials business.' : `Manage your ${selectedLabel.toLowerCase()} and keep the customer experience up to date.`}</p></div>{['products', 'categories', 'banners', 'locations'].includes(section) && <AppButton onClick={() => openModal(section === 'products' ? 'product' : section === 'categories' ? 'category' : section === 'banners' ? 'banner' : 'location')}><Plus size={15} /> Add {section === 'products' ? 'product' : section === 'categories' ? 'category' : section === 'banners' ? 'banner' : 'location'}</AppButton>}</div>
      {section === 'overview' && <AdminOverview products={products} categories={categories} locations={locations} reviews={reviews} testimonials={testimonials} enquiries={enquiries} setSection={setSection} setSelectedEnquiry={setSelectedEnquiry} />}
      {section === 'products' && <AdminProducts products={products} categories={categories} search={search} setSearch={setSearch} openEdit={(item: Product) => openModal('product', item)} onDelete={(item: Product) => { if (askDelete(`“${item.name}”`)) { setProducts((current: Product[]) => current.filter((entry) => entry.id !== item.id)); flash('Product deleted.'); } }} />}
      {section === 'categories' && <AdminCategories categories={categories} products={products} search={search} setSearch={setSearch} openEdit={(item: Category) => openModal('category', item)} onDelete={(item: Category) => { const used = products.some((product: Product) => product.category === item.id); if (used) { flash('This category is in use. Move its products before deleting.', 'error'); return; } if (askDelete(`“${item.name}”`)) { setCategories((current: Category[]) => current.filter((entry) => entry.id !== item.id)); flash('Category deleted.'); } }} />}
      {section === 'banners' && <AdminBanners banners={banners} setBanners={setBanners} openEdit={(item: Banner) => openModal('banner', item)} flash={flash} />}
      {section === 'reviews' && <AdminReviews reviews={reviews} setReviews={setReviews} products={products} setReviewStatus={setReviewStatus} testimonials={testimonials} setTestimonials={setTestimonials} flash={flash} />}
      {section === 'locations' && <AdminLocations locations={locations} openEdit={(item: Location) => openModal('location', item)} onDelete={(item: Location) => { if (askDelete(`“${item.name}”`)) { setLocations((current: Location[]) => current.filter((entry) => entry.id !== item.id)); flash('Location deleted.'); } }} />}
      {section === 'content' && <AdminContent content={siteContent} setContent={setSiteContent} flash={flash} />}
      {section === 'enquiries' && <AdminEnquiries enquiries={enquiries} search={search} setSearch={setSearch} filterStatus={filterStatus} setFilterStatus={setFilterStatus} selected={selectedEnquiry} setSelected={setSelectedEnquiry} setEnquiries={setEnquiries} />}
    </main></div>
    {modal && <AdminModal type={modal} item={editing} categories={categories} onClose={closeModal} onSave={(value: any) => {
      if (modal === 'product') { setProducts((current: Product[]) => editing ? current.map((entry) => entry.id === editing.id ? { ...entry, ...value } : entry) : [{ ...value, id: `custom-${Date.now()}`, rating: 0, reviewCount: 0, image: value.image || photo('photo-1504307651254-35680f356dfd') }, ...current]); }
      if (modal === 'category') { setCategories((current: Category[]) => editing ? current.map((entry) => entry.id === editing.id ? { ...entry, ...value } : entry) : [...current, { ...value, id: value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }]); }
      if (modal === 'banner') { setBanners((current: Banner[]) => editing ? current.map((entry) => entry.id === editing.id ? { ...entry, ...value } : entry) : [...current, { ...value, id: `bn-${Date.now()}`, active: true }]); }
      if (modal === 'location') { setLocations((current: Location[]) => editing ? current.map((entry) => entry.id === editing.id ? { ...entry, ...value } : entry) : [...current, { ...value, id: `loc-${Date.now()}`, x: 50, y: 50 }]); }
      flash(`${modal[0].toUpperCase()}${modal.slice(1)} saved.`); closeModal();
    }} />}
    {selectedEnquiry && section !== 'enquiries' && <EnquiryDrawer enquiry={selectedEnquiry} setSelected={setSelectedEnquiry} />}
    {toast && <ToastMessage toast={toast} />}
  </div>;
}

function AdminOverview({ products, categories, locations, reviews, testimonials, enquiries, setSection, setSelectedEnquiry }: any) {
  const metrics = [[Package, 'Total materials', products.length, 'Across all product categories'], [Filter, 'Categories', categories.length, 'Material groupings'], [MapPin, 'Locations', locations.length, 'Sample Texas yards'], [Star, 'Pending reviews', reviews.filter((item: Review) => item.status === 'Pending').length, 'Awaiting moderation'], [MessageSquare, 'Testimonials', testimonials.length, 'Customer stories'], [ClipboardList, 'Open enquiries', enquiries.filter((item: Enquiry) => item.status !== 'Resolved').length, 'Need a team response']];
  return <><div className="metric-grid">{metrics.map(([Icon, label, value, detail]: any) => <article className="metric-card" key={label}><div><span>{label}</span><Icon size={17} /></div><strong>{value}</strong><small>{detail}</small></article>)}</div><div className="overview-grid"><section className="admin-panel"><div className="panel-head"><div><h2>Recent enquiries</h2><p>The latest messages from your customers.</p></div><button className="text-link" onClick={() => setSection('enquiries')}>View all <ArrowRight size={14} /></button></div><div className="overview-enquiry-list">{enquiries.slice(0, 4).map((item: Enquiry) => <button key={item.id} onClick={() => { setSelectedEnquiry(item); setSection('enquiries'); }}><span className="enquiry-avatar">{item.name.split(' ').map((part: string) => part[0]).join('')}</span><span className="enquiry-summary"><strong>{item.subject}</strong><small>{item.name} · {item.date}</small></span><StatusBadge status={item.status} /><ChevronRight size={15} /></button>)}</div></section><section className="admin-panel"><div className="panel-head"><div><h2>Needs your attention</h2><p>Items waiting in the queue.</p></div><span className="pending-number">{reviews.filter((item: Review) => item.status === 'Pending').length}</span></div>{reviews.filter((item: Review) => item.status === 'Pending').map((item: Review) => <div key={item.id} className="moderation-item"><div className="moderation-icon"><Star size={17} /></div><div><strong>Product review awaiting moderation</strong><small>{item.author} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></div><button aria-label="Go to reviews" onClick={() => setSection('reviews')}><ArrowRight size={16} /></button></div>)}{!reviews.some((item: Review) => item.status === 'Pending') && <div className="admin-empty"><CheckCircle2 size={20} /> All caught up for now.</div>}</section></div><div className="admin-footer-note"><span className="demo-dot" /> Demo workspace · Changes are saved locally in this browser session.</div></>;
}

function StatusBadge({ status }: { status: string }) { return <span className={`status-badge status-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>; }

function AdminToolbar({ search, setSearch, placeholder = 'Search...' }: any) {
  return <div className="admin-toolbar"><label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} aria-label={placeholder} />{search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={14} /></button>}</label><span className="toolbar-hint"><SlidersHorizontal size={15} /> Filters update instantly</span></div>;
}

function AdminProducts({ products, categories, search, setSearch, openEdit, onDelete }: any) {
  const [cat, setCat] = useState('all');
  const [page, setPage] = useState(1);
  const shown = products.filter((item: Product) => `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase()) && (cat === 'all' || item.category === cat));
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const pageItems = shown.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage(1); }, [search, cat]);
  useEffect(() => { setPage((current) => Math.min(current, pageCount)); }, [pageCount]);
  return <section className="admin-panel data-panel"><AdminToolbar search={search} setSearch={setSearch} placeholder="Search products by name..." /><div className="table-filters"><label className="select-wrap"><Filter size={15} /><select value={cat} onChange={(event) => setCat(event.target.value)}><option value="all">All categories</option>{categories.map((item: Category) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><ChevronDown size={14} /></label><span>{shown.length ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, shown.length)} of ${shown.length}` : `0 of ${products.length}`} materials</span></div><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Material</th><th>Category</th><th>Typical size</th><th>Rating</th><th>Actions</th></tr></thead><tbody>{pageItems.map((item: Product) => <tr key={item.id}><td><div className="table-product"><span style={{ backgroundImage: `url('${item.image}')` }} /><span><strong>{item.name}</strong><small>{item.id}</small></span></div></td><td>{categoryLabel(item.category, categories)}</td><td>{item.size}</td><td><span className="table-rating"><Star size={13} fill="currentColor" /> {item.rating.toFixed(1)}</span></td><td><div className="table-actions"><button aria-label={`Edit ${item.name}`} onClick={() => openEdit(item)}><Pencil size={15} /></button><button aria-label={`Delete ${item.name}`} onClick={() => onDelete(item)}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table>{shown.length === 0 && <div className="admin-empty">No products match your search.</div>}</div>{shown.length > pageSize && <Pagination page={page} pageSize={pageSize} totalItems={shown.length} onPageChange={setPage} label="admin materials" />}</section>;
}

function AdminCategories({ categories, products, search, setSearch, openEdit, onDelete }: any) {
  const shown = categories.filter((item: Category) => item.name.toLowerCase().includes(search.toLowerCase()));
  return <><AdminToolbar search={search} setSearch={setSearch} placeholder="Search categories..." /><div className="category-admin-grid">{shown.map((item: Category) => <article key={item.id} className="category-admin-card"><div className="category-icon"><Package size={19} /></div><div className="category-card-actions"><button aria-label="Edit category" onClick={() => openEdit(item)}><Pencil size={15} /></button><button aria-label="Delete category" onClick={() => onDelete(item)}><Trash2 size={15} /></button></div><h3>{item.name}</h3><p>{item.description}</p><span>{products.filter((product: Product) => product.category === item.id).length} products</span></article>)}</div>{!shown.length && <div className="admin-empty">No categories match your search.</div>}</>;
}

function AdminBanners({ banners, setBanners, openEdit, flash }: any) {
  const move = (index: number, direction: number) => { const copy = [...banners]; const next = index + direction; if (next < 0 || next >= copy.length) return; [copy[index], copy[next]] = [copy[next], copy[index]]; setBanners(copy); flash('Banner order updated.'); };
  return <div className="banner-admin-list">{banners.map((item: Banner, index: number) => <article key={item.id} className="banner-admin-card"><div className="banner-preview" style={{ backgroundImage: `linear-gradient(90deg, rgba(15,16,16,.75), transparent),url('${photo(item.image, 800)}')` }}><span>{item.eyebrow}</span><strong>{item.headline}</strong></div><div className="banner-admin-info"><StatusBadge status={item.active ? 'Active' : 'Inactive'} /><p>{item.id}</p><div className="banner-controls"><button title="Move up" onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp size={15} /></button><button title="Move down" onClick={() => move(index, 1)} disabled={index === banners.length - 1}><ArrowDown size={15} /></button><button title="Edit banner" onClick={() => openEdit(item)}><Pencil size={15} /></button><button onClick={() => { setBanners((current: Banner[]) => current.map((entry) => entry.id === item.id ? { ...entry, active: !entry.active } : entry)); flash(`Banner ${item.active ? 'deactivated' : 'activated'}.`); }}>{item.active ? 'Deactivate' : 'Activate'}</button></div></div></article>)}{banners.length === 0 && <div className="admin-empty">No banners yet. Add a banner to get started.</div>}</div>;
}

function AdminReviews({ reviews, setReviews, products, setReviewStatus, testimonials, setTestimonials, flash }: any) {
  const [tab, setTab] = useState<'reviews' | 'testimonials'>('reviews');
  return <><div className="admin-tabs"><button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>Product reviews <span>{reviews.length}</span></button><button className={tab === 'testimonials' ? 'active' : ''} onClick={() => setTab('testimonials')}>Testimonials <span>{testimonials.length}</span></button></div>{tab === 'reviews' ? <div className="review-admin-list">{reviews.map((item: Review) => <article key={item.id} className="review-admin-card"><div className="review-admin-head"><div><strong>{item.author}</strong><small>{products.find((product: Product) => product.id === item.productId)?.name ?? 'Material'} · {item.date}</small></div><StatusBadge status={item.status} /></div><div className="stars">{stars(item.rating)}</div><p>{item.text}</p><div className="review-admin-actions">{item.status === 'Pending' && <><AppButton variant="outline" onClick={() => setReviewStatus(item.id, 'Approved')}><Check size={14} /> Approve</AppButton><AppButton variant="quiet" onClick={() => setReviewStatus(item.id, 'Rejected')}><X size={14} /> Reject</AppButton></>}<button className="delete-link" onClick={() => { if (window.confirm('Remove this review?')) { setReviews((current: Review[]) => current.filter((entry: Review) => entry.id !== item.id)); flash('Review removed.'); } }}><Trash2 size={14} /> Remove</button></div></article>)}</div> : <div className="review-admin-list">{testimonials.map((item: Testimonial) => <article key={item.id} className="review-admin-card"><div className="review-admin-head"><div><strong>{item.author}</strong><small>{item.company}</small></div><StatusBadge status={item.status} /></div><div className="stars">{stars(5)}</div><p>{item.text}</p><div className="review-admin-actions"><button className={`featured-toggle ${item.featured ? 'on' : ''}`} onClick={() => { setTestimonials((current: Testimonial[]) => current.map((entry: Testimonial) => entry.id === item.id ? { ...entry, featured: !entry.featured } : entry)); flash(`Testimonial ${item.featured ? 'unfeatured' : 'featured'}.`); }}><Star size={14} fill={item.featured ? 'currentColor' : 'none'} /> {item.featured ? 'Featured' : 'Feature'}</button><button className="delete-link" onClick={() => { if (window.confirm('Remove this testimonial?')) { setTestimonials((current: Testimonial[]) => current.filter((entry: Testimonial) => entry.id !== item.id)); flash('Testimonial removed.'); } }}><Trash2 size={14} /> Remove</button></div></article>)}</div>}</>;
}

function AdminLocations({ locations, openEdit, onDelete }: any) {
  return <div className="admin-location-list">{locations.map((item: Location) => <article className="admin-location-card" key={item.id}><span className="admin-location-icon"><MapPin size={19} /></span><div className="admin-location-copy"><span className="section-kicker">Sample Texas location</span><h3>{item.name}</h3><p>{item.address}, {item.city}</p><small><Clock3 size={13} /> {item.hours}</small><small><Phone size={13} /> {item.phone}</small><small><Truck size={13} /> {item.service}</small></div><div className="table-actions"><button aria-label="Edit location" onClick={() => openEdit(item)}><Pencil size={15} /></button><button aria-label="Delete location" onClick={() => onDelete(item)}><Trash2 size={15} /></button></div></article>)}</div>;
}

function AdminContent({ content, setContent, flash }: any) {
  const blocks: [string, string, number][] = [['about', 'About us', 4], ['mission', 'Mission', 3], ['vision', 'Vision', 3], ['values', 'Core values', 3], ['serviceArea', 'Delivery & service area', 4]];
  return <form className="content-editor" onSubmit={(event) => { event.preventDefault(); flash('Site content saved in this demo.'); }}>{blocks.map(([key, label, rows]) => <TextField key={key} label={label} value={content[key]} onChange={(value) => setContent({ ...content, [key]: value })} as="textarea" rows={rows} required />)}<AppButton type="submit"><Save size={15} /> Save content</AppButton></form>;
}

function AdminEnquiries({ enquiries, search, setSearch, filterStatus, setFilterStatus, selected, setSelected, setEnquiries }: any) {
  const [typeFilter, setTypeFilter] = useState('all');
  const types = ['all', ...Array.from(new Set(enquiries.map((item: Enquiry) => item.type))) as string[]];
  const shown = enquiries.filter((item: Enquiry) => `${item.name} ${item.subject} ${item.email} ${item.id}`.toLowerCase().includes(search.toLowerCase()) && (filterStatus === 'all' || item.status === filterStatus) && (typeFilter === 'all' || item.type === typeFilter));
  return <div className="enquiries-layout"><section className="admin-panel enquiry-list-panel"><AdminToolbar search={search} setSearch={setSearch} placeholder="Search enquiries..." /><div className="enquiry-filters"><label className="select-wrap"><Filter size={14} /><select aria-label="Filter status" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}><option value="all">All statuses</option><option>New</option><option>In Progress</option><option>Resolved</option></select><ChevronDown size={14} /></label><label className="select-wrap"><select aria-label="Filter type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>{types.map((type) => <option key={type} value={type}>{type === 'all' ? 'All types' : type}</option>)}</select><ChevronDown size={14} /></label><span>{shown.length} results</span></div><div className="enquiry-rows">{shown.map((item: Enquiry) => <button key={item.id} className={`enquiry-row ${selected?.id === item.id ? 'selected' : ''}`} onClick={() => setSelected(item)}><span className="enquiry-avatar">{item.name.split(' ').map((part: string) => part[0]).join('')}</span><span className="enquiry-row-main"><span><strong>{item.name}</strong><small>{item.date}</small></span><strong>{item.subject}</strong><small>{item.type} · {item.message.slice(0, 75)}{item.message.length > 75 ? '…' : ''}</small><StatusBadge status={item.status} /></span></button>)}{!shown.length && <div className="admin-empty">No enquiries match these filters.</div>}</div></section>{selected ? <EnquiryDrawer enquiry={selected} setSelected={setSelected} setEnquiries={setEnquiries} /> : <aside className="enquiry-placeholder"><MessageSquare size={27} /><strong>Select an enquiry</strong><span>Customer details and message will appear here.</span></aside>}</div>;
}

function EnquiryDrawer({ enquiry, setSelected, setEnquiries }: any) {
  return <aside className="enquiry-detail"><div className="drawer-head"><span className="section-kicker">Enquiry {enquiry.id}</span><button onClick={() => setSelected(null)} aria-label="Close enquiry details"><X size={18} /></button></div><StatusBadge status={enquiry.status} /><h2>{enquiry.subject}</h2><p className="drawer-date">Received {enquiry.date} · {enquiry.type}</p><div className="drawer-customer"><span className="enquiry-avatar">{enquiry.name.split(' ').map((part: string) => part[0]).join('')}</span><div><strong>{enquiry.name}</strong><small>{enquiry.email}</small><small>{enquiry.phone || 'Phone not provided'}</small></div></div><div className="drawer-message"><span>MESSAGE</span><p>{enquiry.message}</p></div><label className="field"><span>Update status</span><select value={enquiry.status} onChange={(event) => { setEnquiries?.((current: Enquiry[]) => current.map((item) => item.id === enquiry.id ? { ...item, status: event.target.value } : item)); setSelected({ ...enquiry, status: event.target.value }); }}><option>New</option><option>In Progress</option><option>Resolved</option></select></label><div className="drawer-actions"><a href={`mailto:${enquiry.email}?subject=${encodeURIComponent(enquiry.subject)}`} className="button button-outline"><Mail size={15} /> Draft email</a><a href={`tel:${enquiry.phone}`} className="button button-quiet"><Phone size={15} /> Call</a></div><small className="drawer-note">Contact actions open your device’s default app. No message is sent by this demo.</small></aside>;
}

function AdminModal({ type, item, categories, onClose, onSave }: any) {
  const title = `${item ? 'Edit' : 'Add'} ${type}`;
  const [form, setForm] = useState<any>(() => ({
    name: item?.name ?? '', category: item?.category ?? categories[0]?.id ?? '', description: item?.description ?? '', size: item?.size ?? '', color: item?.color ?? '', uses: item?.uses?.join(', ') ?? '', image: item?.image ?? '',
    eyebrow: item?.eyebrow ?? '', headline: item?.headline ?? '', address: item?.address ?? '', city: item?.city ?? '', phone: item?.phone ?? '', hours: item?.hours ?? '', service: item?.service ?? '',
  }));
  const update = (key: string, value: string) => setForm({ ...form, [key]: value });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSave(type === 'product' ? { ...form, uses: form.uses.split(',').map((value: string) => value.trim()).filter(Boolean) } : form); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><span className="section-kicker">Workspace management</span><h2 id="modal-title">{title}</h2></div><button onClick={onClose} aria-label="Close"><X size={19} /></button></div><form onSubmit={submit} className="modal-form">
    {type === 'product' && <><TextField label="Material name" value={form.name} onChange={(value) => update('name', value)} required /><TextField label="Category" value={form.category} onChange={(value) => update('category', value)} as="select" required><option /></TextField><TextField label="Description" value={form.description} onChange={(value) => update('description', value)} as="textarea" required /><div className="form-two-col"><TextField label="Typical size" value={form.size} onChange={(value) => update('size', value)} required /><TextField label="Color / appearance" value={form.color} onChange={(value) => update('color', value)} required /></div><TextField label="Applications (comma separated)" value={form.uses} onChange={(value) => update('uses', value)} required placeholder="Driveways, drainage" /><TextField label="Image URL" value={form.image} onChange={(value) => update('image', value)} placeholder="Leave blank to use a sample image" /></>}
    {type === 'category' && <><TextField label="Category name" value={form.name} onChange={(value) => update('name', value)} required /><TextField label="Description" value={form.description} onChange={(value) => update('description', value)} as="textarea" required /></>}
    {type === 'banner' && <><TextField label="Eyebrow" value={form.eyebrow} onChange={(value) => update('eyebrow', value)} required /><TextField label="Headline" value={form.headline} onChange={(value) => update('headline', value)} required /><TextField label="Unsplash image ID" value={form.image} onChange={(value) => update('image', value)} required placeholder="photo-1504307651254-35680f356dfd" /></>}
    {type === 'location' && <><TextField label="Location name" value={form.name} onChange={(value) => update('name', value)} required /><div className="form-two-col"><TextField label="Street address" value={form.address} onChange={(value) => update('address', value)} required /><TextField label="City, state & ZIP" value={form.city} onChange={(value) => update('city', value)} required /></div><div className="form-two-col"><TextField label="Sample phone" value={form.phone} onChange={(value) => update('phone', value)} required /><TextField label="Operating hours" value={form.hours} onChange={(value) => update('hours', value)} required /></div><TextField label="Services" value={form.service} onChange={(value) => update('service', value)} required /></>}
    <div className="modal-actions"><AppButton variant="outline" onClick={onClose}>Cancel</AppButton><AppButton type="submit"><Save size={15} /> Save {type}</AppButton></div></form></section></div>;
}