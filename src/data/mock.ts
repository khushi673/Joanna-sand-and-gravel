export type Category = { id: string; name: string; description: string };
export type Product = {
  id: string; name: string; category: string; description: string; size: string;
  color: string; uses: string[]; image: string; rating: number; reviewCount: number;
};
export type Review = { id: string; productId: string; author: string; rating: number; text: string; date: string; status: 'Pending' | 'Approved' | 'Rejected' };
export type Testimonial = { id: string; author: string; company: string; text: string; featured: boolean; status: 'Pending' | 'Approved' };
export type Location = { id: string; name: string; address: string; city: string; phone: string; hours: string; service: string; x: number; y: number };
export type Banner = { id: string; eyebrow: string; headline: string; image: string; active: boolean };
export type Enquiry = { id: string; name: string; email: string; phone: string; subject: string; type: string; message: string; status: 'New' | 'In Progress' | 'Resolved'; date: string };

export const categories: Category[] = [
  { id: 'sand', name: 'Sand', description: 'Screened sands for masonry, concrete, and site work.' },
  { id: 'gravel', name: 'Gravel', description: 'Washed and natural gravel in a range of sizes.' },
  { id: 'crushed-stone', name: 'Crushed Stone', description: 'Angular stone for dependable structural support.' },
  { id: 'aggregates', name: 'Aggregates', description: 'Consistent aggregates for commercial mixes.' },
  { id: 'base', name: 'Base Materials', description: 'Compacting road and driveway base products.' },
  { id: 'fill', name: 'Fill Materials', description: 'Reliable fill for grading and site preparation.' },
  { id: 'landscape', name: 'Landscape & Specialty', description: 'Finishing materials for outdoor spaces.' },
];

const materialNames: Record<string, string[]> = {
  sand: ['Masonry Sand', 'Concrete Sand', 'Washed Cushion Sand', 'Select Fill Sand', 'Bank Sand', 'Play Sand', 'Pool Filter Sand', 'Utility Sand', 'Fine Screenings Sand', 'Fill Sand', 'White Silica Sand', 'Coarse Concrete Sand'],
  gravel: ['Pea Gravel', '1/2 in. River Gravel', '3/4 in. River Gravel', '1 in. River Gravel', '2 in. River Gravel', 'Washed Limestone Gravel', 'Decomposed Granite', 'Drainage Gravel', 'Tan Pea Gravel', 'Multicolor River Rock'],
  'crushed-stone': ['Crushed Limestone #57', 'Crushed Limestone #4', 'Crushed Limestone #8', 'Crushed Limestone #89', 'Crushed Granite #57', 'Crushed Granite #2', 'White Crushed Stone', 'Black Basalt Chips', 'Limestone Screenings', 'Crushed Concrete'],
  aggregates: ['Fine Concrete Aggregate', 'Coarse Concrete Aggregate', 'Washed Concrete Rock', 'Asphalt Aggregate', 'Screened Rock', 'Lightweight Aggregate', 'Manufactured Sand', 'Concrete Blend Rock', 'DOT Grade Aggregate', 'Recycled Aggregate'],
  base: ['1 1/2 in. Road Base', 'Flex Base Grade 1', 'Flex Base Grade 2', 'Crushed Concrete Base', 'Limestone Road Base', 'Caliche Base', 'Stabilized Base', 'Select Road Base', 'Crusher Run', 'Recycled Flex Base'],
  fill: ['Common Fill Dirt', 'Select Fill Dirt', 'Engineered Fill', 'Sandy Loam Fill', 'Clay Fill', 'Structural Fill', 'Topsoil Blend', 'Sitework Fill', 'Screened Fill Dirt', 'Low-PI Fill'],
  landscape: ['Decomposed Granite Gold', 'Decomposed Granite Red', 'Black Star Gravel', 'Mexican Beach Pebbles', 'Texas Cream Gravel', 'Limestone Cobble', 'River Rock Blend', 'Garden Mulch Rock', 'Flagstone Base', 'Decorative Granite', 'White Marble Chips', 'Breeze Pathway Material'],
};

const imageByCategory: Record<string, string> = {
  sand: 'photo-1504307651254-35680f356dfd', gravel: 'photo-1518709268805-4e9042af9f23',
  'crushed-stone': 'photo-1516937941344-00b4e0337589', aggregates: 'photo-1519608487953-e999c86e7455',
  base: 'photo-1503387762-592deb58ef4e', fill: 'photo-1504917595217-d4dc5ebe6122',
  landscape: 'photo-1484154218962-a197022b5858',
};

export const products: Product[] = Object.entries(materialNames).flatMap(([category, names]) =>
  names.map((name, index) => ({
    id: `${category}-${index + 1}`,
    name,
    category,
    description: `${name} is selected for reliable grading, consistent performance, and dependable results across Texas construction and site projects.`,
    size: ['Fine', '3/8 in. minus', '1/2–3/4 in.', '3/4 in. minus', '1–2 in.', 'Varied, screened'][index % 6],
    color: ['Natural tan', 'Limestone gray', 'Warm cream', 'Mixed earth tones'][index % 4],
    uses: [['Concrete work', 'Masonry'], ['Driveways', 'Drainage'], ['Road construction', 'Site preparation'], ['Landscaping', 'General construction']][index % 4],
    image: `https://images.unsplash.com/${imageByCategory[category]}?auto=format&fit=crop&w=1000&q=85`,
    rating: Number((4.3 + (index % 7) / 10).toFixed(1)),
    reviewCount: 8 + ((index * 11) % 83),
  })),
);

export const locations: Location[] = [
  { id: 'loc-1', name: 'North Texas Materials Yard', address: '1000 Sample Quarry Road', city: 'Dallas, TX 75201', phone: '(555) 010-2101', hours: 'Mon–Fri, 6:00 AM–5:00 PM', service: 'Aggregates, sand, and scheduled delivery', x: 68, y: 26 },
  { id: 'loc-2', name: 'Central Texas Distribution Yard', address: '2400 Example Ranch Lane', city: 'Austin, TX 78701', phone: '(555) 010-2102', hours: 'Mon–Fri, 6:30 AM–5:00 PM', service: 'Bulk materials and fleet dispatch', x: 56, y: 56 },
  { id: 'loc-3', name: 'Gulf Coast Aggregate Yard', address: '3800 Placeholder Bayou Drive', city: 'Houston, TX 77002', phone: '(555) 010-2103', hours: 'Mon–Fri, 6:00 AM–4:30 PM', service: 'Washed rock, sand, and commercial supply', x: 80, y: 69 },
  { id: 'loc-4', name: 'West Texas Supply Point', address: '420 Sample Mesquite Road', city: 'San Antonio, TX 78205', phone: '(555) 010-2104', hours: 'Mon–Fri, 7:00 AM–4:00 PM', service: 'Road base, fill, and construction aggregates', x: 43, y: 76 },
  { id: 'loc-5', name: 'East Texas Materials Depot', address: '5700 Demo Timber Trail', city: 'Tyler, TX 75702', phone: '(555) 010-2105', hours: 'Mon–Fri, 6:30 AM–4:30 PM', service: 'Sand, gravel, and regional delivery', x: 85, y: 37 },
];

export const banners: Banner[] = [
  { id: 'bn-1', eyebrow: 'Built on reliability', headline: 'Quality materials. Reliable delivery.', image: 'photo-1504307651254-35680f356dfd', active: true },
  { id: 'bn-2', eyebrow: 'Texas-ready service', headline: 'The right material for every mile.', image: 'photo-1516937941344-00b4e0337589', active: true },
  { id: 'bn-3', eyebrow: 'A fleet that shows up', headline: 'Keep your next project moving.', image: 'photo-1504917595217-d4dc5ebe6122', active: true },
  { id: 'bn-4', eyebrow: 'Local knowledge, statewide reach', headline: 'Your Texas materials partner.', image: 'photo-1503387762-592deb58ef4e', active: true },
  { id: 'bn-5', eyebrow: 'Grounded in good work', headline: 'From the ground up, together.', image: 'photo-1518709268805-4e9042af9f23', active: true },
];

export const initialReviews: Review[] = [
  { id: 'rv-1', productId: 'sand-1', author: 'M. Reynolds', rating: 5, text: 'Consistent texture and easy to work with on our latest masonry job.', date: 'Oct 03, 2026', status: 'Approved' },
  { id: 'rv-2', productId: 'gravel-1', author: 'J. Alvarez', rating: 4, text: 'Good clean gravel. The team helped us choose the right size for drainage.', date: 'Sep 21, 2026', status: 'Approved' },
  { id: 'rv-3', productId: 'base-2', author: 'T. Brooks', rating: 5, text: 'Dependable material and a smooth delivery coordination process.', date: 'Sep 17, 2026', status: 'Pending' },
];

export const initialTestimonials: Testimonial[] = [
  { id: 'ts-1', author: 'Morgan R.', company: 'Reynolds Siteworks', text: 'A dependable partner. Their team understands the realities of keeping a jobsite moving.', featured: true, status: 'Approved' },
  { id: 'ts-2', author: 'Javier A.', company: 'Alvarez Masonry', text: 'The material quality is consistent and communication is straightforward from start to finish.', featured: true, status: 'Approved' },
  { id: 'ts-3', author: 'Taylor B.', company: 'Brooks Construction', text: 'Local expertise and a crew that takes pride in getting the details right.', featured: false, status: 'Approved' },
];

export const initialEnquiries: Enquiry[] = [
  { id: 'EN-1048', name: 'Morgan Reynolds', email: 'morgan@example.com', phone: '(555) 010-3401', subject: 'Road base for a commercial site', type: 'Material recommendation', message: 'We are preparing a 2-acre commercial site near Dallas and would like guidance on road base options and delivery coverage.', status: 'New', date: 'Oct 12, 2026' },
  { id: 'EN-1047', name: 'Javier Alvarez', email: 'javier@example.com', phone: '(555) 010-3402', subject: 'Delivery information', type: 'Delivery', message: 'Could you share the lead time and coverage for a gravel delivery near Round Rock?', status: 'In Progress', date: 'Oct 11, 2026' },
  { id: 'EN-1046', name: 'Taylor Brooks', email: 'taylor@example.com', phone: '(555) 010-3403', subject: 'Product feedback', type: 'Feedback', message: 'The last order arrived as scheduled. Thank you to the dispatch team for clear updates.', status: 'Resolved', date: 'Oct 09, 2026' },
];