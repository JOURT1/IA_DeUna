const q = ['cuanto es 100 + 50', 'quien juega hoy futbol', 'hola, como estas', 'ayuda'];
Promise.all(q.map(msg =>
    fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, mode: 'simple' })
    })
        .then(r => r.json())
        .then(j => console.log(`\nQ: ${msg}\nIntent: ${j.detectedIntent}\nAnswer: ${j.answer}\nFollowUps: ${j.suggestedFollowUps.join(' | ')}`))
)).catch(console.error);
