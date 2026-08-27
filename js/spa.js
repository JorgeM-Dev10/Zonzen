/* ==========================================================================
   ZONZEN — spa.js
   El termostato: al elegir una parada, el ambiente de la caja migra del
   frio (salvia) al calor (brasa). Es El Circuito aplicado a la temperatura.
   ========================================================================== */

(function () {
  const termas = document.querySelector('[data-termas]');
  if (!termas) return;

  const escala   = termas.querySelector('[data-escala]');
  const grados   = termas.querySelector('[data-grados]');
  const nombre   = termas.querySelector('[data-parada-nombre]');
  const glosa    = termas.querySelector('[data-parada-glosa]');
  const tiempo   = termas.querySelector('[data-parada-tiempo]');

  /* Pinta la escala con el orden sugerido del circuito */
  escala.innerHTML = PARADAS.map(
    (p, i) => `
    <button class="parada" type="button" role="tab"
            aria-selected="${i === 2}" data-parada="${p.id}"
            style="--tono:${p.tono}">
      <span class="parada__grados">${p.grados}&thinsp;°C</span>
      <span class="parada__nombre">${limpiar(p.nombre)}</span>
      <span class="parada__orden">Parada ${i + 1} de ${PARADAS.length}</span>
    </button>`
  ).join('');

  function seleccionar(id) {
    const parada = PARADAS.find((p) => p.id === id);
    if (!parada) return;

    termas.style.setProperty('--ambiente', parada.tono);
    // Cuanto mas caliente la parada, mas fuerte el ambiente
    const fuerza = 0.13 + (parada.grados / 90) * 0.20;
    termas.style.setProperty('--ambiente-fuerza', fuerza.toFixed(3));

    grados.innerHTML = `${parada.grados}<sup>°C</sup>`;
    nombre.textContent = parada.nombre;
    glosa.textContent = parada.glosa;
    tiempo.textContent = `Permanencia sugerida · ${parada.tiempo}`;

    escala.querySelectorAll('.parada').forEach((b) => {
      b.setAttribute('aria-selected', String(b.dataset.parada === id));
    });
  }

  escala.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-parada]');
    if (btn) seleccionar(btn.dataset.parada);
  });

  /* Flechas para recorrer el circuito con el teclado */
  escala.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();

    const botones = Array.from(escala.querySelectorAll('.parada'));
    const actual = botones.findIndex((b) => b.getAttribute('aria-selected') === 'true');
    const paso = e.key === 'ArrowDown' ? 1 : -1;
    const siguiente = botones[(actual + paso + botones.length) % botones.length];

    seleccionar(siguiente.dataset.parada);
    siguiente.focus();
  });

  seleccionar('jacuzzi');   // arranca en el punto medio del circuito
})();

/* ==========================================================================
   Carta de masajes
   ========================================================================== */
(function () {
  const contenedor = document.querySelector('[data-masajes]');
  if (!contenedor) return;

  contenedor.innerHTML = MASAJES.map(
    (m, i) => `
    <article class="ficha" style="--tono:${m.tono}" data-revelar="${i % 3}">
      <div class="ficha__campo campo" style="--tono:${m.tono};--tono-2:var(--oro)" aria-hidden="true"></div>
      <div class="ficha__cuerpo">
        <div class="ficha__alto">
          <h3 class="ficha__titulo">${limpiar(m.nombre)}</h3>
          <span class="ficha__precio">${pesos(m.precio)}</span>
        </div>
        <p class="ficha__texto">${limpiar(m.texto)}</p>
        <div class="ficha__pie">
          <span class="ficha__duracion">${m.duracion} minutos</span>
          <button class="btn btn--fantasma btn--pequeno" type="button"
                  data-reservar data-tipo="Masaje"
                  data-titulo="Masaje ${limpiar(m.nombre)}"
                  data-glosa="${m.duracion} minutos · ${pesos(m.precio)} · cabina individual">
            <span class="btn__texto">Reservar</span>
            <span class="btn__flecha" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>`
  ).join('');

  // Las fichas se crearon despues del arranque: hay que observarlas ahora
  iniciarRevelado();
})();
