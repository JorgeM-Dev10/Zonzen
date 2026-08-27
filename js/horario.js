/* ==========================================================================
   ZONZEN — horario.js
   Horario semanal con filtros por disciplina y nivel. Todo client-side.
   ========================================================================== */

(function () {
  const contenedor = document.querySelector('[data-horario]');
  if (!contenedor) return;

  const estado = { disciplina: 'todas', nivel: 'todos' };

  /* --- Pintado ------------------------------------------------------------ */
  function filtrar() {
    return CLASES.filter((c) => {
      const okDisciplina = estado.disciplina === 'todas' || c.disciplina === estado.disciplina;
      const okNivel =
        estado.nivel === 'todos' ||
        c.nivel.toLowerCase() === estado.nivel ||
        (estado.nivel !== 'todos' && c.nivel === 'Todos');
      return okDisciplina && okNivel;
    });
  }

  function filaClase(c) {
    const info = DISCIPLINAS[c.disciplina];
    const libres = c.cupo - c.tomados;
    const lleno = libres <= 0;

    return `
      <li class="clase ${lleno ? 'clase--lleno' : ''}" style="--tono:${info.tono}">
        <span class="clase__hora dato">${limpiar(c.hora)}</span>
        <span>
          <span class="clase__nombre">${limpiar(c.titulo)}</span>
          <span class="clase__meta">${limpiar(c.coach)} · ${c.duracion} min · ${limpiar(info.sala)}</span>
        </span>
        <span class="clase__nivel">${limpiar(c.nivel)}</span>
        <span class="clase__cupo">${lleno ? 'Lleno' : `${libres} libres`}</span>
        <span class="clase__accion">
          ${
            lleno
              ? `<button class="btn btn--fantasma btn--pequeno" type="button"
                    data-reservar data-tipo="Lista de espera"
                    data-titulo="${limpiar(c.titulo)} · ${limpiar(c.dia)}"
                    data-hora="${limpiar(c.hora)}"
                    data-glosa="Esta clase esta llena. Te avisamos si se libera un lugar.">
                   <span class="btn__texto">Lista de espera</span>
                 </button>`
              : `<button class="btn btn--fantasma btn--pequeno" type="button"
                    data-reservar data-tipo="Clase"
                    data-titulo="${limpiar(c.titulo)} · ${limpiar(c.dia)}"
                    data-hora="${limpiar(c.hora)}"
                    data-glosa="${limpiar(c.coach)} · ${c.duracion} minutos · ${limpiar(info.sala)}">
                   <span class="btn__texto">Reservar</span>
                   <span class="btn__flecha" aria-hidden="true">→</span>
                 </button>`
          }
        </span>
      </li>`;
  }

  function pintar() {
    const clases = filtrar();
    const cuenta = document.querySelector('[data-horario-cuenta]');
    if (cuenta) {
      cuenta.textContent = `${clases.length} ${clases.length === 1 ? 'clase' : 'clases'}`;
    }

    if (!clases.length) {
      contenedor.innerHTML = `
        <div class="vacio">
          <p class="vacio__titulo">No hay clases con ese filtro</p>
          <p class="vacio__texto">Prueba con otra disciplina o quita el filtro de nivel.</p>
          <button class="btn btn--fantasma" type="button" data-limpiar-filtros>
            <span class="btn__texto">Ver todas</span>
          </button>
        </div>`;

      const limpiarBtn = contenedor.querySelector('[data-limpiar-filtros]');
      if (limpiarBtn) limpiarBtn.addEventListener('click', reiniciar);
      return;
    }

    contenedor.innerHTML = DIAS.map((dia) => {
      const delDia = clases.filter((c) => c.dia === dia);
      if (!delDia.length) return '';

      return `
        <section class="dia">
          <header class="dia__cabecera">
            <h3 class="dia__nombre">${limpiar(dia)}</h3>
            <span class="dia__cuenta">${delDia.length} ${delDia.length === 1 ? 'clase' : 'clases'}</span>
          </header>
          <ul class="dia__clases">${delDia.map(filaClase).join('')}</ul>
        </section>`;
    }).join('');
  }

  function reiniciar() {
    estado.disciplina = 'todas';
    estado.nivel = 'todos';
    sincronizarBotones();
    pintar();
  }

  function sincronizarBotones() {
    document.querySelectorAll('[data-filtro-disciplina]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.filtroDisciplina === estado.disciplina));
    });
    document.querySelectorAll('[data-filtro-nivel]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.filtroNivel === estado.nivel));
    });
  }

  /* --- Eventos ------------------------------------------------------------ */
  document.querySelectorAll('[data-filtro-disciplina]').forEach((b) =>
    b.addEventListener('click', () => {
      estado.disciplina = b.dataset.filtroDisciplina;
      sincronizarBotones();
      pintar();
    })
  );

  document.querySelectorAll('[data-filtro-nivel]').forEach((b) =>
    b.addEventListener('click', () => {
      estado.nivel = b.dataset.filtroNivel;
      sincronizarBotones();
      pintar();
    })
  );

  sincronizarBotones();
  pintar();
})();

/* ==========================================================================
   Tira "clases de hoy" para la portada
   ========================================================================== */
(function () {
  const contenedor = document.querySelector('[data-hoy]');
  if (!contenedor) return;

  const nombreHoy = DIAS[(new Date().getDay() + 6) % 7];   // getDay: 0 = domingo
  const ahora = new Date().getHours() * 60 + new Date().getMinutes();

  const minutos = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  const deHoy = CLASES.filter((c) => c.dia === nombreHoy).sort(
    (a, b) => minutos(a.hora) - minutos(b.hora)
  );

  const proximas = deHoy.filter((c) => minutos(c.hora) >= ahora);
  const mostrar = (proximas.length ? proximas : deHoy).slice(0, 4);

  const etiqueta = document.querySelector('[data-hoy-etiqueta]');
  if (etiqueta) {
    etiqueta.textContent = proximas.length
      ? `${nombreHoy} · quedan ${proximas.length} por delante`
      : `${nombreHoy} · programa completo`;
  }

  if (!mostrar.length) {
    contenedor.innerHTML = `
      <li class="vacio">
        <p class="vacio__titulo">Hoy no hay clases programadas</p>
        <p class="vacio__texto">El piso de fuerza y el circuito de spa siguen abiertos.</p>
      </li>`;
    return;
  }

  contenedor.innerHTML = mostrar
    .map((c) => {
      const info = DISCIPLINAS[c.disciplina];
      const libres = c.cupo - c.tomados;
      const lleno = libres <= 0;

      return `
        <li class="clase ${lleno ? 'clase--lleno' : ''}" style="--tono:${info.tono}">
          <span class="clase__hora dato">${limpiar(c.hora)}</span>
          <span>
            <span class="clase__nombre">${limpiar(c.titulo)}</span>
            <span class="clase__meta">${limpiar(c.coach)} · ${c.duracion} min</span>
          </span>
          <span class="clase__nivel">${limpiar(c.nivel)}</span>
          <span class="clase__cupo">${lleno ? 'Lleno' : `${libres} libres`}</span>
          <span class="clase__accion">
            <button class="btn btn--fantasma btn--pequeno" type="button"
              data-reservar data-tipo="${lleno ? 'Lista de espera' : 'Clase'}"
              data-titulo="${limpiar(c.titulo)} · hoy"
              data-hora="${limpiar(c.hora)}"
              data-glosa="${limpiar(c.coach)} · ${c.duracion} minutos · ${limpiar(info.sala)}">
              <span class="btn__texto">${lleno ? 'Espera' : 'Reservar'}</span>
            </button>
          </span>
        </li>`;
    })
    .join('');
})();
