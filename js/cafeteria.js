/* ==========================================================================
   ZONZEN — cafeteria.js
   Carta con filtro por categoria y por etiqueta nutricional.
   Los macros se despliegan en hover (ver .macros en components.css).
   ========================================================================== */

(function () {
  const contenedor = document.querySelector('[data-menu]');
  if (!contenedor) return;

  const estado = { cat: 'todo', etiqueta: 'todas' };

  function filtrar() {
    return MENU.filter((p) => {
      const okCat = estado.cat === 'todo' || p.cat === estado.cat;
      const okEtiqueta = estado.etiqueta === 'todas' || p.etiquetas.includes(estado.etiqueta);
      return okCat && okEtiqueta;
    });
  }

  function ficha(p, i) {
    return `
      <article class="ficha" style="--tono:${p.tono}" data-revelar="${i % 4}">
        <div class="ficha__campo campo" style="--tono:${p.tono};--tono-2:var(--salvia)" aria-hidden="true">
          <span class="campo__marca">${limpiar(p.cat)}</span>
        </div>
        <div class="ficha__cuerpo">
          <div class="ficha__alto">
            <h3 class="ficha__titulo">${limpiar(p.nombre)}</h3>
            <span class="ficha__precio">${pesos(p.precio)}</span>
          </div>
          <p class="ficha__texto">${limpiar(p.texto)}</p>

          <div class="etiquetas">
            ${p.etiquetas.map((e) => `<span class="etiqueta">${limpiar(e)}</span>`).join('')}
          </div>

          <div class="macros">
            <div class="macro"><span class="macro__valor">${p.kcal}</span><span class="macro__clave">kcal</span></div>
            <div class="macro"><span class="macro__valor">${p.prot} g</span><span class="macro__clave">proteina</span></div>
            <div class="macro"><span class="macro__valor">${p.carb} g</span><span class="macro__clave">carbos</span></div>
          </div>
        </div>
      </article>`;
  }

  function pintar() {
    const platos = filtrar();
    const cuenta = document.querySelector('[data-menu-cuenta]');
    if (cuenta) {
      cuenta.textContent = `${platos.length} ${platos.length === 1 ? 'producto' : 'productos'}`;
    }

    if (!platos.length) {
      contenedor.innerHTML = `
        <div class="vacio" style="grid-column:1/-1">
          <p class="vacio__titulo">Nada con esa combinacion</p>
          <p class="vacio__texto">Prueba con otra categoria o quita el filtro nutricional.</p>
          <button class="btn btn--fantasma" type="button" data-limpiar-menu>
            <span class="btn__texto">Ver la carta completa</span>
          </button>
        </div>`;

      const btn = contenedor.querySelector('[data-limpiar-menu]');
      if (btn) btn.addEventListener('click', reiniciar);
      return;
    }

    contenedor.innerHTML = platos.map(ficha).join('');
    iniciarRevelado();
  }

  function reiniciar() {
    estado.cat = 'todo';
    estado.etiqueta = 'todas';
    sincronizar();
    pintar();
  }

  function sincronizar() {
    document.querySelectorAll('[data-filtro-cat]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.filtroCat === estado.cat))
    );
    document.querySelectorAll('[data-filtro-etiqueta]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.filtroEtiqueta === estado.etiqueta))
    );
  }

  /* Las etiquetas nutricionales se generan desde los datos */
  const barraEtiquetas = document.querySelector('[data-etiquetas]');
  if (barraEtiquetas) {
    barraEtiquetas.innerHTML = `
      <button class="filtro" type="button" data-filtro-etiqueta="todas" aria-pressed="true">Todas</button>
      ${ETIQUETAS_MENU.map(
        (e) => `<button class="filtro" type="button" data-filtro-etiqueta="${limpiar(e)}" aria-pressed="false">${limpiar(e)}</button>`
      ).join('')}`;
  }

  document.querySelectorAll('[data-filtro-cat]').forEach((b) =>
    b.addEventListener('click', () => {
      estado.cat = b.dataset.filtroCat;
      sincronizar();
      pintar();
    })
  );

  document.querySelectorAll('[data-filtro-etiqueta]').forEach((b) =>
    b.addEventListener('click', () => {
      estado.etiqueta = b.dataset.filtroEtiqueta;
      sincronizar();
      pintar();
    })
  );

  sincronizar();
  pintar();
})();
