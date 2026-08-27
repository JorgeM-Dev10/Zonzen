/* ==========================================================================
   ZONZEN — membresias.js
   Planes con interruptor mensual/anual y tabla comparativa.
   ========================================================================== */

(function () {
  const contenedor = document.querySelector('[data-planes]');
  if (!contenedor) return;

  let periodo = 'mensual';

  /* --- Planes ------------------------------------------------------------- */
  function pintarPlanes() {
    contenedor.innerHTML = PLANES.map((p, i) => {
      const monto = periodo === 'mensual' ? p.mensual : Math.round(p.anual / 12);
      const ahorro = p.mensual * 12 - p.anual;

      return `
        <article class="plan ${p.destacado ? 'plan--destacado' : ''}" data-revelar="${i}">
          ${p.destacado ? '<span class="plan__insignia">Mas elegido</span>' : ''}
          <h3 class="plan__nombre">${limpiar(p.nombre)}</h3>
          <p class="plan__lema">${limpiar(p.lema)}</p>

          <div class="plan__precio">
            <span class="plan__monto dato" data-monto="${p.id}">${pesos(monto)}</span>
            <span class="plan__periodo">/ mes</span>
          </div>
          <p class="plan__nota" data-nota="${p.id}">${
            periodo === 'anual' ? `Ahorras ${pesos(ahorro)} al año` : 'Sin contrato forzoso'
          }</p>

          <ul class="plan__lista">
            ${p.incluye
              .map(
                (item) => `<li class="plan__item">
                  <span class="plan__marca" aria-hidden="true">+</span>
                  <span>${limpiar(item)}</span></li>`
              )
              .join('')}
            ${p.excluye
              .map(
                (item) => `<li class="plan__item plan__item--no">
                  <span class="plan__marca" aria-hidden="true">−</span>
                  <span>${limpiar(item)}</span></li>`
              )
              .join('')}
          </ul>

          <button class="btn ${p.destacado ? 'btn--primario' : 'btn--fantasma'} btn--ancho" type="button"
                  data-reservar data-tipo="Visita guiada"
                  data-titulo="Plan ${limpiar(p.nombre)}"
                  data-glosa="Agenda un recorrido y activa tu plan ${limpiar(p.nombre)} el mismo dia.">
            <span class="btn__texto">Agendar visita</span>
            <span class="btn__flecha" aria-hidden="true">→</span>
          </button>
        </article>`;
    }).join('');

    iniciarRevelado();
  }

  /* Cambia solo los numeros: evita repintar y perder el hover */
  function actualizarPrecios() {
    PLANES.forEach((p) => {
      const monto = contenedor.querySelector(`[data-monto="${p.id}"]`);
      const nota = contenedor.querySelector(`[data-nota="${p.id}"]`);
      if (!monto) return;

      monto.classList.add('cambiando');

      setTimeout(() => {
        const valor = periodo === 'mensual' ? p.mensual : Math.round(p.anual / 12);
        const ahorro = p.mensual * 12 - p.anual;
        monto.textContent = pesos(valor);
        if (nota) {
          nota.textContent =
            periodo === 'anual' ? `Ahorras ${pesos(ahorro)} al año` : 'Sin contrato forzoso';
        }
        monto.classList.remove('cambiando');
      }, 180);
    });
  }

  /* --- Interruptor -------------------------------------------------------- */
  const interruptor = document.querySelector('[data-interruptor]');

  function moverPastilla() {
    if (!interruptor) return;
    const pastilla = interruptor.querySelector('.interruptor__pastilla');
    const activo = interruptor.querySelector('[aria-pressed="true"]');
    if (!pastilla || !activo) return;

    pastilla.style.width = `${activo.offsetWidth}px`;
    pastilla.style.transform = `translateX(${activo.offsetLeft - 4}px)`;
  }

  if (interruptor) {
    interruptor.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-periodo]');
      if (!btn || btn.dataset.periodo === periodo) return;

      periodo = btn.dataset.periodo;
      interruptor.querySelectorAll('[data-periodo]').forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.periodo === periodo))
      );

      moverPastilla();
      actualizarPrecios();
    });

    window.addEventListener('resize', moverPastilla);
  }

  /* --- Tabla comparativa -------------------------------------------------- */
  function pintarTabla() {
    const cuerpo = document.querySelector('[data-comparativa]');
    if (!cuerpo) return;

    const celda = (v) => {
      if (v === true) return '<span class="si" aria-label="Incluido">✓</span>';
      if (v === false) return '<span class="no" aria-label="No incluido">—</span>';
      return `<span>${limpiar(v)}</span>`;
    };

    cuerpo.innerHTML = COMPARATIVA.map(
      (f) => `
      <tr>
        <td>${limpiar(f.fila)}</td>
        <td>${celda(f.movimiento)}</td>
        <td>${celda(f.circuito)}</td>
        <td>${celda(f.reposo)}</td>
      </tr>`
    ).join('');
  }

  pintarPlanes();
  pintarTabla();
  requestAnimationFrame(moverPastilla);
})();
