/**
 * Flat lists for machine posting (categories, conditions, brands).
 * Single-level lists as per docs - no hierarchy.
 */

/** Backend machines.type value */
export type MachineCategoryType =
  | 'printing'
  | 'die_cutting'
  | 'folding_gluing'
  | 'rigid_box'
  | 'corrugation'
  | 'lamination'
  | 'converting'
  | 'binding'
  | 'finishing'
  | 'paper_bag_cup'
  | 'auxiliary'
  | 'specialty';

export interface MachineCategoryOption {
  label: string;
  value: MachineCategoryType;
}

/** Flat list: Machine Category dropdown (display label -> API type) */
export const MACHINE_CATEGORY_OPTIONS: MachineCategoryOption[] = [
  { label: 'Printing Machines', value: 'printing' },
  { label: 'Die Cutting & Creasing Machines', value: 'die_cutting' },
  { label: 'Folder Gluers & Carton Machines', value: 'folding_gluing' },
  { label: 'Rigid Box Making Machines', value: 'rigid_box' },
  { label: 'Corrugation Machines', value: 'corrugation' },
  { label: 'Lamination & Coating Machines', value: 'lamination' },
  { label: 'Paper & Board Converting Machines', value: 'converting' },
  { label: 'Binding & Book Finishing Machines', value: 'binding' },
  { label: 'Specialty & Finishing Machines', value: 'finishing' },
  { label: 'Paper Bag & Cup Machines', value: 'paper_bag_cup' },
  { label: 'Auxiliary & Support Machines', value: 'auxiliary' },
  { label: 'Specialty Machines', value: 'specialty' },
];

/** Backend expects exactly these condition strings for post machine */
export const MACHINE_CONDITION_OPTIONS: { label: string; value: string }[] = [
  { label: 'Brand New', value: 'Brand New' },
  { label: 'Excellent', value: 'Excellent' },
  { label: 'Working Condition', value: 'Working Condition' },
  { label: 'Needs Repair', value: 'Needs Repair' },
];

/** Condition preference for Buy form (multi-select) */
export const MACHINE_CONDITION_PREFERENCE_OPTIONS: { label: string; value: string }[] = [
  { label: 'New', value: 'Brand New' },
  { label: 'Used (Excellent)', value: 'Excellent' },
  { label: 'Used (Working)', value: 'Working Condition' },
  { label: 'Any', value: 'Any' },
];

/** Flat list of machine brand names (from doc) - single list, no hierarchy */
export const MACHINE_BRAND_NAMES: string[] = [
  'Heidelberg',
  'Komori',
  'KBA (Koenig & Bauer)',
  'Mitsubishi',
  'Ryobi',
  'Sakurai',
  'Akiyama',
  'Man Roland',
  'Shinohara',
  'HP Indigo',
  'Xerox',
  'Konica Minolta',
  'Ricoh',
  'Canon',
  'Kodak',
  'Xeikon',
  'Bobst',
  'Mark Andy',
  'Nilpeter',
  'Uteco',
  'Comexi',
  'Windmöller & Hölscher',
  'Webtech',
  'Pelican',
  'Kohli Gravure',
  'Yawa',
  'Masterwork',
  'Sanwa',
  'Brausse',
  'SBL',
  'Lishunyuan',
  'Guowang',
  'Jagenberg',
  'DGM',
  'Vega',
  'Bahmueller',
  'Emmeci',
  'Kolbus',
  'Zhongke',
  'Hongming',
  'Fuling',
  'SMT',
  'Sun Automation',
  'BHS',
  'Fosber',
  'Agnati',
  'ISOWA',
  'TCY',
  'Dongfang',
  'Peters',
  'Monotech',
  'Komfi',
  'Autobond',
  'D&K',
  'Nordson',
  'Polar',
  'Wohlenberg',
  'Perfecta',
  'HPM',
  'Pasaban',
  'Jagenberg',
  'Bielomatik',
  'Muller Martini',
  'Horizon',
  'Welbound',
  'Aster',
  'Gietz',
  'Kama',
  'Newlong',
  'Holweg Weber',
  'Curioni',
  'Lemo',
  'UFlex (India)',
];

export const URGENCY_OPTIONS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Urgent (want to offload fast / need immediately)', value: 'urgent' },
];
