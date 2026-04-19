const q = ['cuanto vendi este año', 'ventas del 2025', 'cuanto vendi al año'];
Promise.all(q.map(msg =>
    fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, mode: 'simple' })
    })
        .then(r => r.json())
        .then(j => console.log(`\nQ: ${msg}\nIntent: ${j.detectedIntent}\nAnswer: ${j.answer}`))
)).catch(console.error);
