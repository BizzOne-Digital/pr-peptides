require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const products = [
  {
    name: 'SLU-PP-332',
    shortDescription: 'ERRα agonist for mitochondrial biogenesis research',
    description: 'SLU-PP-332 is a potent ERRα agonist that has shown significant effects on mitochondrial biogenesis and oxidative metabolism in preclinical research models.',
    price: 89.99, dosage: '5mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: true, inStock: true, stockQuantity: 50,
  },
  {
    name: 'Epithalon',
    shortDescription: 'Tetrapeptide studied for telomerase activity',
    description: 'Epithalon (Epitalon) is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) studied for its effects on telomerase activity and telomere elongation in research settings.',
    price: 79.99, dosage: '10mg', category: 'peptide', purity: '99.5%',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: true, inStock: true, stockQuantity: 60,
  },
  {
    name: 'KPV',
    shortDescription: 'Alpha-MSH fragment with anti-inflammatory properties',
    description: 'KPV is a tripeptide fragment (Lys-Pro-Val) derived from the C-terminus of alpha-MSH. Research has focused on its anti-inflammatory properties and gut microbiome interactions.',
    price: 69.99, dosage: '10mg', category: 'peptide', purity: '99.1%',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: true, inStock: true, stockQuantity: 75,
  },
  {
    name: 'Retatrutide',
    shortDescription: 'Triple incretin receptor agonist for metabolic research',
    description: 'Retatrutide is a novel triple agonist (GLP-1/GIP/glucagon receptor) that has demonstrated significant effects on body weight regulation and metabolic parameters in Phase 2 clinical research.',
    price: 149.99, comparePrice: 179.99, dosage: '10mg', category: 'research-compound', purity: '99.3%',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: true, inStock: true, stockQuantity: 30,
  },
  {
    name: 'BPC-157',
    shortDescription: 'Gastric protein-derived peptide for tissue repair research',
    description: 'BPC-157 (Body Protection Compound 157) is a synthetic peptide derived from a protein found in gastric juice. Extensively studied for wound healing, angiogenesis, and tissue repair in animal models.',
    price: 74.99, dosage: '10mg', category: 'peptide', purity: '99.4%',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: true, inStock: true, stockQuantity: 80,
  },
  {
    name: 'TB-500',
    shortDescription: 'Thymosin Beta-4 analogue for cell proliferation studies',
    description: 'TB-500 is a synthetic version of Thymosin Beta-4, a naturally occurring protein found in virtually all human and animal cells. Research has focused on its role in cell proliferation and wound healing.',
    price: 94.99, dosage: '10mg', category: 'peptide', purity: '99.0%',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: true, inStock: true, stockQuantity: 45,
  },
  {
    name: 'MOTS-C',
    shortDescription: 'Mitochondrial-derived peptide for metabolic research',
    description: 'MOTS-C is a mitochondrial-derived peptide encoded in the mitochondrial genome. Research has shown its role in regulating metabolic homeostasis, insulin sensitivity, and exercise capacity.',
    price: 109.99, dosage: '10mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 35,
  },
  {
    name: 'NAD+',
    shortDescription: 'Nicotinamide adenine dinucleotide for cellular energy research',
    description: 'NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in all living cells. Research focuses on its critical role in cellular metabolism, energy production, and DNA repair mechanisms.',
    price: 99.99, dosage: '100mg', category: 'research-compound', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 40,
  },
  {
    name: 'SS-31',
    shortDescription: 'Mitochondria-targeted peptide antioxidant',
    description: 'SS-31 (Elamipretide) is a mitochondria-targeted peptide that selectively concentrates in the inner mitochondrial membrane. Research focuses on its cardioprotective and neuroprotective properties.',
    price: 119.99, dosage: '10mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 25,
  },
  {
    name: '5-Amino-1MQ',
    shortDescription: 'NNMT inhibitor for metabolic and adipogenesis research',
    description: '5-Amino-1MQ is a small molecule inhibitor of nicotinamide N-methyltransferase (NNMT). Preclinical research has explored its effects on adipogenesis, metabolic rate, and fat cell reduction.',
    price: 89.99, dosage: '50mg', category: 'research-compound', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 30,
  },
  {
    name: 'Semax',
    shortDescription: 'Synthetic ACTH analogue for neuroprotection research',
    description: 'Semax is a synthetic heptapeptide analogue of the ACTH(4-7) fragment. Research has focused on its neuroprotective, neurotrophic, and cognitive-enhancing properties in preclinical models.',
    price: 84.99, dosage: '10mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 40,
  },
  {
    name: 'Selank',
    shortDescription: 'Anxiolytic peptide for neurological research',
    description: 'Selank is a synthetic anxiolytic peptide derived from the immunomodulatory peptide tuftsin. Research has studied its anxiolytic, nootropic, and immunomodulatory properties.',
    price: 84.99, dosage: '10mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 40,
  },
  {
    name: 'Ipamorelin',
    shortDescription: 'Selective growth hormone secretagogue',
    description: 'Ipamorelin is a selective growth hormone secretagogue and ghrelin mimetic. Research focuses on its ability to stimulate GH release with high selectivity and minimal side effects in preclinical models.',
    price: 79.99, dosage: '10mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 55,
  },
  {
    name: 'GHK-Cu',
    shortDescription: 'Copper peptide for tissue regeneration research',
    description: 'GHK-Cu (Copper peptide) is a naturally occurring copper complex of the tripeptide glycyl-L-histidyl-L-lysine. Research has focused on its role in wound healing, anti-inflammatory, and tissue remodeling properties.',
    price: 74.99, dosage: '100mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 50,
  },
  {
    name: 'CJC-1295 (No DAC)',
    shortDescription: 'GHRH analogue for growth hormone research',
    description: 'CJC-1295 without DAC is a synthetic analogue of growth hormone-releasing hormone (GHRH). Research studies its effects on GH and IGF-1 levels, body composition, and metabolic function.',
    price: 89.99, dosage: '5mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 45,
  },
  {
    name: 'BAC Water 10mL',
    shortDescription: 'Bacteriostatic water for peptide reconstitution',
    description: 'Bacteriostatic Water (0.9% benzyl alcohol) for research use. Used for reconstitution of lyophilized peptides and research compounds. 10mL vial.',
    price: 14.99, dosage: '10mL', category: 'accessory', purity: 'N/A',
    labTested: true, coaAvailable: false, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 200,
  },
  {
    name: 'Tesamorelin',
    shortDescription: 'Synthetic GHRH analogue for metabolic research',
    description: 'Tesamorelin is a synthetic analogue of growth hormone-releasing hormone (GHRH). Research has studied its effects on visceral adipose tissue reduction and metabolic parameters.',
    price: 129.99, dosage: '5mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 25,
  },
  {
    name: 'BAC Water 3mL',
    shortDescription: 'Bacteriostatic water — small vial for peptide reconstitution',
    description: 'Bacteriostatic Water (0.9% benzyl alcohol) for research use. Used for reconstitution of lyophilized peptides and research compounds. 3mL vial.',
    price: 8.99, dosage: '3mL', category: 'accessory', purity: 'N/A',
    labTested: true, coaAvailable: false, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 200,
  },
  {
    name: 'Kisspeptin-10',
    shortDescription: 'Hypothalamic neuropeptide for reproductive research',
    description: 'Kisspeptin-10 is a 10-amino acid neuropeptide derived from the KISS1 gene product. Research has focused on its role in regulating GnRH secretion and reproductive hormone pathways.',
    price: 114.99, dosage: '10mg', category: 'peptide', purity: '99%+',
    labTested: true, coaAvailable: true, researchUseOnly: true, featured: false, inStock: true, stockQuantity: 20,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  let added = 0, skipped = 0;
  for (const p of products) {
    const exists = await Product.findOne({ name: p.name });
    if (!exists) {
      await Product.create(p);
      console.log(`✓ Added: ${p.name}`);
      added++;
    } else {
      console.log(`— Exists: ${p.name}`);
      skipped++;
    }
  }

  console.log(`\n✅ Done — ${added} added, ${skipped} skipped`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });