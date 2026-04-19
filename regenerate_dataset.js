/**
 * Regenera el dataset sintético para 3 merchants.
 * Rango: 2024-01-01  →  2026-04-19
 * Cargado en memoria, genera ~2K-3K txns por merchant.
 */
const fs = require('fs');

// ── Configuración de merchants ──
const MERCHANTS = [
    {
        merchantId: 'm001',
        merchantName: 'Tienda Don Pepe',
        category: 'abarrotes',
        city: 'Quito',
        customers: [
            { id: 'c001', name: 'María López' },
            { id: 'c002', name: 'Carlos Mendoza' },
            { id: 'c003', name: 'Ana Gutiérrez' },
            { id: 'c004', name: 'Pedro Sánchez' },
            { id: 'c005', name: 'Lucía Herrera' },
            { id: 'c006', name: 'Jorge Ramírez' },
            { id: 'c007', name: 'Rosa Paredes' },
            { id: 'c008', name: 'Fernando Torres' },
            { id: 'c009', name: 'Gabriela Mora' },
            { id: 'c010', name: 'Diego Villacís' },
        ],
        categories: ['granos', 'bebidas', 'lácteos', 'panadería', 'enlatados', 'aceites', 'snacks', 'limpieza'],
        products: {
            granos: ['Arroz 5kg', 'Fideos 500g', 'Azúcar 2kg', 'Lenteja 1kg', 'Fréjol 1kg'],
            bebidas: ['Café 200g', 'Agua 6L', 'Gaseosa 2L', 'Jugo 1L'],
            lácteos: ['Leche 1L', 'Huevos 30u', 'Queso 500g', 'Yogur 1L'],
            panadería: ['Pan', 'Torta casera', 'Empanadas'],
            enlatados: ['Atún en lata', 'Sardina en lata', 'Maíz enlatado'],
            aceites: ['Aceite 1L', 'Mantequilla 250g', 'Manteca 500g'],
            snacks: ['Galletas', 'Chips', 'Chocolates', 'Caramelos'],
            limpieza: ['Jabón líquido', 'Detergente', 'Cloro 1L', 'Escoba'],
        },
        amountRange: [2, 85],
        txnsPerDay: [2, 6],
    },
    {
        merchantId: 'm002',
        merchantName: 'Café Internet Mary',
        category: 'servicios',
        city: 'Quito',
        customers: [
            { id: 'c021', name: 'Andrés Suárez' },
            { id: 'c022', name: 'Valentina Ortiz' },
            { id: 'c023', name: 'Sebastián Reyes' },
            { id: 'c024', name: 'Camila Paredes' },
            { id: 'c025', name: 'Daniel Espinoza' },
            { id: 'c026', name: 'Sofía Valencia' },
            { id: 'c027', name: 'Mateo Guerrero' },
            { id: 'c028', name: 'Isabella Roldán' },
        ],
        categories: ['internet', 'impresiones', 'snacks', 'bebidas', 'copias', 'escaneos', 'gaming'],
        products: {
            internet: ['Internet 1h', 'Internet 2h', 'Paquete WiFi diario'],
            impresiones: ['Impresión B/N', 'Impresión Color', 'Fotos carnet'],
            snacks: ['Galletas', 'Chips', 'Chocolate'],
            bebidas: ['Café', 'Agua', 'Gaseosa'],
            copias: ['Copias B/N', 'Copias Color'],
            escaneos: ['Escaneo documento', 'Escaneo foto'],
            gaming: ['PC Gaming 1h', 'PC Gaming 2h'],
        },
        amountRange: [0.5, 25],
        txnsPerDay: [3, 10],
    },
    {
        merchantId: 'm003',
        merchantName: 'Restaurante Doña Lupita',
        category: 'restaurante',
        city: 'Quito',
        customers: [
            { id: 'c029', name: 'Patricia Zambrano' },
            { id: 'c030', name: 'Roberto Cevallos' },
            { id: 'c031', name: 'Claudia Borja' },
            { id: 'c032', name: 'Ricardo Castro' },
            { id: 'c033', name: 'Monica Salazar' },
            { id: 'c034', name: 'Hernán Delgado' },
            { id: 'c035', name: 'Karina Peña' },
            { id: 'c036', name: 'Oscar Montalvo' },
            { id: 'c037', name: 'Cecilia Trujillo' },
            { id: 'c038', name: 'Julio Andrade' },
        ],
        categories: ['comidas', 'bebidas', 'postres', 'desayunos', 'almuerzos', 'cenas'],
        products: {
            comidas: ['Seco de pollo', 'Encebollado', 'Llapingacho', 'Ceviche de camarón'],
            bebidas: ['Jugo natural', 'Gaseosa', 'Agua', 'Cerveza', 'Batido'],
            postres: ['Tres leches', 'Helado', 'Flan', 'Espumilla'],
            desayunos: ['Desayuno completo', 'Bolón con café', 'Tigrillo'],
            almuerzos: ['Almuerzo ejecutivo', 'Sopa del día + segundo', 'Parrillada'],
            cenas: ['Cena ligera', 'Menestra con carne', 'Sánduche especial'],
        },
        amountRange: [2, 45],
        txnsPerDay: [5, 15],
    }
];

const CHANNELS = ['presencial', 'online', 'delivery'];
const DESCRIPTIONS = [
    null, null, null, null,  // most are null
    'Compra semanal de víveres',
    'Pedido habitual',
    'Compra rápida',
    'Reposición de inventario',
    'Compra al por mayor',
    'Pedido para el negocio',
    'Encargo especial del cliente',
    'Compra para evento familiar',
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max) { return +(Math.random() * (max - min) + min).toFixed(2); }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }

// Seasonal multipliers: higher sales around holidays, Dec, etc.
function getSeasonalMultiplier(month, dayOfWeek) {
    const monthMul = {
        0: 0.8, 1: 0.85, 2: 0.9, 3: 1.0, 4: 1.0, 5: 0.95,
        6: 0.9, 7: 0.9, 8: 1.0, 9: 1.05, 10: 1.1, 11: 1.3
    };
    // Sundays have less activity
    const dayMul = dayOfWeek === 0 ? 0.5 : dayOfWeek === 6 ? 0.7 : 1.0;
    return (monthMul[month] || 1.0) * dayMul;
}

// ── Build dataset ──
const START = new Date('2024-01-01T00:00:00');
const END = new Date('2026-04-19T23:59:59');

function generateMerchant(config) {
    let txnId = 0;
    const transactions = [];
    const current = new Date(START);

    while (current <= END) {
        const month = current.getMonth();
        const dow = current.getDay();
        const mul = getSeasonalMultiplier(month, dow);

        const [minTxn, maxTxn] = config.txnsPerDay;
        const numTxns = Math.max(0, Math.round(rand(minTxn, maxTxn) * mul));

        for (let i = 0; i < numTxns; i++) {
            txnId++;
            const cat = pick(config.categories);
            const prods = config.products[cat];
            const product = prods ? pick(prods) : null;
            const customer = pick(config.customers);
            const [minAmt, maxAmt] = config.amountRange;
            const amount = randFloat(minAmt * (0.7 + mul * 0.3), maxAmt * (0.7 + mul * 0.3));

            const hour = rand(7, 21);
            const minute = rand(0, 59);

            const date = new Date(current);
            date.setHours(hour, minute, 0, 0);

            // ~5% chance of cancelled
            const isCancelled = Math.random() < 0.05;

            transactions.push({
                transactionId: `txn-${config.merchantId}-${String(txnId).padStart(5, '0')}`,
                date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`,
                amount,
                status: isCancelled ? 'cancelled' : 'completed',
                customerId: customer.id,
                customerName: customer.name,
                paymentMethod: 'deuna',
                product: Math.random() < 0.3 ? null : product,
                category: cat,
                channel: pick(CHANNELS),
                quantity: rand(1, 8),
                description: pick(DESCRIPTIONS),
            });
        }

        // Next day
        current.setDate(current.getDate() + 1);
    }

    // Sort by date
    transactions.sort((a, b) => a.date.localeCompare(b.date));

    // Make sure TODAY (Apr 19, 2026) has some recent txns
    const todayStr = '2026-04-19';
    const todayTxns = transactions.filter(t => t.date.startsWith(todayStr) && t.status === 'completed');
    if (todayTxns.length < 3) {
        // Add a few for today
        for (let i = 0; i < 4; i++) {
            txnId++;
            const cat = pick(config.categories);
            const prods = config.products[cat];
            const customer = pick(config.customers);
            const [minAmt, maxAmt] = config.amountRange;
            transactions.push({
                transactionId: `txn-${config.merchantId}-${String(txnId).padStart(5, '0')}`,
                date: `2026-04-19T${String(rand(8, 11)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00`,
                amount: randFloat(minAmt, maxAmt),
                status: 'completed',
                customerId: customer.id,
                customerName: customer.name,
                paymentMethod: 'deuna',
                product: prods ? pick(prods) : null,
                category: cat,
                channel: pick(CHANNELS),
                quantity: rand(1, 5),
                description: null,
            });
        }
        transactions.sort((a, b) => a.date.localeCompare(b.date));
    }

    return {
        merchant: {
            merchantId: config.merchantId,
            merchantName: config.merchantName,
            category: config.category,
            city: config.city,
        },
        transactions,
    };
}

console.log('Generating dataset...');
const dataset = {
    merchants: MERCHANTS.map(m => {
        const merchant = generateMerchant(m);
        const completed = merchant.transactions.filter(t => t.status === 'completed');
        console.log(`  ${m.merchantName}: ${merchant.transactions.length} txns (${completed.length} completed)`);
        console.log(`    Range: ${merchant.transactions[0].date.slice(0, 10)} → ${merchant.transactions[merchant.transactions.length - 1].date.slice(0, 10)}`);
        return merchant;
    })
};

const outPath = 'server/src/data/transactions.json';
fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2), 'utf-8');
console.log(`\n✅ Dataset written to ${outPath}`);
console.log(`   File size: ${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB`);
