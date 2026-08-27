/* ==========================================================================
   ZONZEN — main.js
   Comportamiento compartido: cabecera, menu movil, revelado por scroll,
   ambiente del circuito, avisos, reservas (localStorage) y modal.
   Sin modulos ES para que el sitio funcione abierto con doble clic (file://).
   ========================================================================== */

/* --- Utilidades ----------------------------------------------------------- */
const $  = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

const menosMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pesos = (n) => '$' + n.toLocaleString('es-MX');

/* Escapa texto antes de meterlo en innerHTML */
const limpiar = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

/* ==========================================================================
   Cabecera
   ========================================================================== */
function iniciarCabecera() {
  const cabecera = $('.cabecera');
  if (!cabecera) return;

  let ultimo = -1;
  const alScroll = () => {
    const y = window.scrollY;
    const encogida = y > 40;
    if (encogida !== ultimo) {
      cabecera.classList.toggle('encogida', encogida);
      ultimo = encogida;
    }
  };

  alScroll();
  window.addEventListener('scroll', alScroll, { passive: true });
}

/* ==========================================================================
   Menu movil
   ========================================================================== */
function iniciarMenuMovil() {
  const boton = $('.hamburguesa');
  const panel = $('.nav-movil');
  if (!boton || !panel) return;

  const alternar = (abrir) => {
    const estado = abrir ?? boton.getAttribute('aria-expanded') !== 'true';
    boton.setAttribute('aria-expanded', String(estado));
    panel.classList.toggle('abierto', estado);
    document.body.style.overflow = estado ? 'hidden' : '';

    if (estado) {
      $$('.nav-movil__enlace', panel).forEach((el, i) => {
        el.style.setProperty('--retardo', `${120 + i * 55}ms`);
      });
    }
  };

  boton.addEventListener('click', () => alternar());

  $$('.nav-movil__enlace', panel).forEach((el) =>
    el.addEventListener('click', () => alternar(false))
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('abierto')) {
      alternar(false);
      boton.focus();
    }
  });
}

/* ==========================================================================
   Revelado por scroll
   ========================================================================== */
function iniciarRevelado() {
  const objetivos = $$('[data-revelar]');
  if (!objetivos.length) return;

  if (menosMovimiento() || !('IntersectionObserver' in window)) {
    objetivos.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  objetivos.forEach((el) => {
    if (el.dataset.observado) return;   // evita duplicar tras un repintado
    el.dataset.observado = '1';

    // Escalona solo dentro de un mismo grupo, no en toda la pagina
    const indice = Number(el.dataset.revelar) || 0;
    el.style.setProperty('--retardo', `${indice * 90}ms`);
    observador.observe(el);
  });
}

/* Aplica retardos a la secuencia de carga y libera las animaciones */
function iniciarCarga() {
  $$('[data-entrada]').forEach((el) => {
    el.style.setProperty('--retardo', `${Number(el.dataset.entrada)}ms`);
  });

  $$('.nodo').forEach((el, i) => el.style.setProperty('--indice', i));

  requestAnimationFrame(() => document.body.classList.add('cargado'));
}

/* ==========================================================================
   El Circuito — el ambiente del hero sigue al nodo enfocado
   ========================================================================== */
function iniciarCircuito() {
  const circuito = $('.circuito');
  const anfitrion = $('.hero') || $('.portico');
  if (!circuito || !anfitrion) return;

  const base = getComputedStyle(anfitrion).getPropertyValue('--ambiente').trim() || 'var(--oro)';

  $$('.nodo__enlace', circuito).forEach((enlace) => {
    const tono = enlace.closest('.nodo').style.getPropertyValue('--tono');

    const encender = () => {
      anfitrion.style.setProperty('--ambiente', tono);
      const campo = $('.hero__campo', anfitrion) || $('.portico__campo', anfitrion);
      if (campo) campo.style.opacity = '.34';
    };

    const apagar = () => {
      anfitrion.style.setProperty('--ambiente', base);
      const campo = $('.hero__campo', anfitrion) || $('.portico__campo', anfitrion);
      if (campo) campo.style.opacity = '';
    };

    enlace.addEventListener('mouseenter', encender);
    enlace.addEventListener('focus', encender);
    enlace.addEventListener('mouseleave', apagar);
    enlace.addEventListener('blur', apagar);
  });
}

/* ==========================================================================
   Avisos flotantes
   ========================================================================== */
function avisar(mensaje, icono = '✓') {
  let pila = $('.avisos');
  if (!pila) {
    pila = document.createElement('div');
    pila.className = 'avisos';
    pila.setAttribute('role', 'status');
    pila.setAttribute('aria-live', 'polite');
    document.body.appendChild(pila);
  }

  const aviso = document.createElement('div');
  aviso.className = 'aviso';
  aviso.innerHTML =
    `<span class="aviso__icono" aria-hidden="true">${limpiar(icono)}</span>` +
    `<span>${limpiar(mensaje)}</span>`;
  pila.appendChild(aviso);

  setTimeout(() => {
    aviso.classList.add('saliendo');
    aviso.addEventListener('animationend', () => aviso.remove(), { once: true });
  }, 3600);
}

/* ==========================================================================
   Reservas — persisten en localStorage. Demo: nada sale del navegador.
   ========================================================================== */
const Reservas = {
  clave: 'zonzen.reservas',

  leer() {
    try {
      const bruto = localStorage.getItem(this.clave);
      const datos = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];   // modo privado o almacenamiento bloqueado
    }
  },

  escribir(lista) {
    try {
      localStorage.setItem(this.clave, JSON.stringify(lista));
    } catch {
      /* Sin almacenamiento la reserva vive solo en esta pagina. */
    }
    this.difundir();
  },

  agregar(reserva) {
    const lista = this.leer();
    lista.push(reserva);
    this.escribir(lista);
    return reserva;
  },

  quitar(folio) {
    this.escribir(this.leer().filter((r) => r.folio !== folio));
  },

  folio() {
    const n = Math.floor(1000 + Math.random() * 9000);
    return `ZN-${n}`;
  },

  difundir() {
    document.dispatchEvent(new CustomEvent('reservas:cambio', { detail: this.leer() }));
  },
};

/* Contador en la cabecera */
function iniciarContador() {
  const botones = $$('[data-contador]');
  if (!botones.length) return;

  const pintar = () => {
    const total = Reservas.leer().length;
    botones.forEach((b) => {
      const num = $('.contador__num', b);
      if (num) num.textContent = total;
      b.dataset.vacio = String(total === 0);
      b.setAttribute('aria-label', `Mis reservas: ${total}`);
    });
  };

  pintar();
  document.addEventListener('reservas:cambio', pintar);
  botones.forEach((b) => b.addEventListener('click', abrirPanelReservas));
}

/* ==========================================================================
   Modal genérico
   ========================================================================== */
const Modal = {
  nodo: null,
  ultimoFoco: null,

  montar() {
    if (this.nodo) return this.nodo;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal__velo" data-cerrar></div>
      <div class="modal__panel">
        <button class="modal__cerrar" type="button" data-cerrar aria-label="Cerrar">✕</button>
        <div class="modal__contenido"></div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-cerrar]')) this.cerrar();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('abierto')) return;
      if (e.key === 'Escape') this.cerrar();
      if (e.key === 'Tab') this.atraparFoco(e);
    });

    this.nodo = modal;
    return modal;
  },

  atraparFoco(e) {
    const focos = $$(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      this.nodo
    ).filter((el) => el.offsetParent !== null);
    if (!focos.length) return;

    const primero = focos[0];
    const ultimo = focos[focos.length - 1];

    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  },

  abrir(html, etiqueta = 'Ventana') {
    const modal = this.montar();
    this.ultimoFoco = document.activeElement;

    $('.modal__contenido', modal).innerHTML = html;
    modal.setAttribute('aria-label', etiqueta);
    modal.classList.add('abierto');
    document.body.style.overflow = 'hidden';

    const primerCampo = $('input, select, textarea, button:not(.modal__cerrar)', modal);
    setTimeout(() => (primerCampo || $('.modal__cerrar', modal)).focus(), 120);

    return $('.modal__contenido', modal);
  },

  cerrar() {
    if (!this.nodo) return;
    this.nodo.classList.remove('abierto');
    document.body.style.overflow = '';
    if (this.ultimoFoco) this.ultimoFoco.focus();
  },
};

/* ==========================================================================
   Reserva: formulario dentro del modal
   ========================================================================== */
function hoyISO(sumaDias = 0) {
  const d = new Date();
  d.setDate(d.getDate() + sumaDias);
  return d.toISOString().slice(0, 10);
}

function fechaLarga(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

/*
 * Abre el formulario de reserva.
 * detalle: { tipo, titulo, glosa, horaFija, horas[] }
 */
function abrirReserva(detalle) {
  const {
    tipo = 'Servicio',
    titulo = '',
    glosa = '',
    horaFija = null,
    horas = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
  } = detalle;

  const contenido = Modal.abrir(
    `
    <span class="clave modal__clave">${limpiar(tipo)}</span>
    <h2 class="modal__titulo">${limpiar(titulo)}</h2>
    <p class="modal__glosa">${limpiar(glosa || 'Elige el dia y la hora. Te confirmamos al instante.')}</p>

    <form class="formulario" novalidate>
      <div class="campo-form campo-form--doble">
        <div class="campo-form">
          <label class="etiqueta-form" for="rf-fecha">Fecha</label>
          <input class="entrada" type="date" id="rf-fecha" name="fecha"
                 min="${hoyISO()}" max="${hoyISO(60)}" value="${hoyISO(1)}" required>
          <span class="error-form" data-error="fecha"></span>
        </div>
        <div class="campo-form">
          <label class="etiqueta-form" for="rf-hora">Hora</label>
          ${
            horaFija
              ? `<input class="entrada" type="text" id="rf-hora" name="hora" value="${limpiar(horaFija)}" readonly>`
              : `<select class="entrada" id="rf-hora" name="hora" required>
                   ${horas.map((h) => `<option value="${limpiar(h)}">${limpiar(h)}</option>`).join('')}
                 </select>`
          }
          <span class="error-form" data-error="hora"></span>
        </div>
      </div>

      <div class="campo-form">
        <label class="etiqueta-form" for="rf-nombre">Nombre</label>
        <input class="entrada" type="text" id="rf-nombre" name="nombre"
               placeholder="Como te llamamos" required minlength="2">
        <span class="error-form" data-error="nombre"></span>
      </div>

      <div class="campo-form">
        <label class="etiqueta-form" for="rf-correo">Correo</label>
        <input class="entrada" type="email" id="rf-correo" name="correo"
               placeholder="tu@correo.com" required>
        <span class="error-form" data-error="correo"></span>
      </div>

      <button class="btn btn--primario btn--ancho" type="submit">
        <span class="btn__texto">Confirmar reserva</span>
        <span class="btn__flecha" aria-hidden="true">→</span>
      </button>
    </form>`,
    `Reservar ${titulo}`
  );

  const form = $('form', contenido);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validarFormulario(form)) return;

    const datos = Object.fromEntries(new FormData(form));
    const reserva = {
      folio: Reservas.folio(),
      tipo,
      titulo,
      fecha: datos.fecha,
      hora: datos.hora,
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
    };

    Reservas.agregar(reserva);
    mostrarConfirmacion(reserva);
  });
}

function mostrarConfirmacion(reserva) {
  const contenido = Modal.abrir(
    `
    <div class="sello">
      <div class="sello__anillo" aria-hidden="true">✓</div>
      <p class="sello__folio">Folio ${limpiar(reserva.folio)}</p>
      <h2 class="modal__titulo">Lugar apartado</h2>
      <p class="modal__glosa">Te esperamos. Puedes cancelar desde Mis reservas.</p>

      <dl class="sello__resumen">
        <div class="sello__fila"><dt>Servicio</dt><dd>${limpiar(reserva.titulo)}</dd></div>
        <div class="sello__fila"><dt>Fecha</dt><dd>${limpiar(fechaLarga(reserva.fecha))}</dd></div>
        <div class="sello__fila"><dt>Hora</dt><dd class="dato">${limpiar(reserva.hora)}</dd></div>
        <div class="sello__fila"><dt>A nombre de</dt><dd>${limpiar(reserva.nombre)}</dd></div>
      </dl>

      <button class="btn btn--fantasma btn--ancho" type="button" data-ver-reservas>
        <span class="btn__texto">Ver mis reservas</span>
      </button>
    </div>`,
    'Reserva confirmada'
  );

  $('[data-ver-reservas]', contenido).addEventListener('click', abrirPanelReservas);
  avisar(`Reserva ${reserva.folio} confirmada`);
}

/* ==========================================================================
   Panel: mis reservas
   ========================================================================== */
function abrirPanelReservas() {
  const pintar = () => {
    const lista = Reservas.leer().sort(
      (a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)
    );

    const cuerpo = lista.length
      ? `<div class="formulario">${lista
          .map(
            (r) => `
          <div class="reserva-item">
            <div>
              <p class="reserva-item__nombre">${limpiar(r.titulo)}</p>
              <p class="reserva-item__meta">${limpiar(fechaLarga(r.fecha))} · ${limpiar(r.hora)} · ${limpiar(r.folio)}</p>
            </div>
            <button class="quitar" type="button" data-quitar="${limpiar(r.folio)}">Cancelar</button>
          </div>`
          )
          .join('')}</div>`
      : `<div class="vacio">
           <p class="vacio__titulo">Todavia no hay nada agendado</p>
           <p class="vacio__texto">Reserva una clase, un masaje o el circuito de spa y aparecera aqui.</p>
           <a class="btn btn--fantasma" href="gimnasio.html">
             <span class="btn__texto">Ver el horario</span>
             <span class="btn__flecha" aria-hidden="true">→</span>
           </a>
         </div>`;

    const contenido = Modal.abrir(
      `
      <span class="clave modal__clave">Agenda</span>
      <h2 class="modal__titulo">Mis reservas</h2>
      <p class="modal__glosa">${
        lista.length
          ? `${lista.length} ${lista.length === 1 ? 'reserva activa' : 'reservas activas'} · guardadas en este navegador`
          : 'Demo: las reservas se guardan solo en este navegador.'
      }</p>
      ${cuerpo}`,
      'Mis reservas'
    );

    $$('[data-quitar]', contenido).forEach((btn) =>
      btn.addEventListener('click', () => {
        Reservas.quitar(btn.dataset.quitar);
        avisar('Reserva cancelada', '×');
        pintar();
      })
    );
  };

  pintar();
}

/* ==========================================================================
   Validacion de formularios
   ========================================================================== */
function validarFormulario(form) {
  let valido = true;

  $$('[required]', form).forEach((campo) => {
    const contenedor = campo.closest('.campo-form');
    const error = contenedor ? $('.error-form', contenedor) : null;
    let mensaje = '';

    const valor = campo.value.trim();

    if (!valor) {
      mensaje = 'Falta este dato';
    } else if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
      mensaje = 'Revisa el correo';
    } else if (campo.minLength > 0 && valor.length < campo.minLength) {
      mensaje = `Minimo ${campo.minLength} caracteres`;
    } else if (campo.type === 'date' && campo.min && valor < campo.min) {
      mensaje = 'Elige una fecha futura';
    }

    campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
    if (error) {
      error.textContent = mensaje;
      error.classList.toggle('visible', Boolean(mensaje));
    }

    if (mensaje && valido) {
      campo.focus();
      valido = false;
    } else if (mensaje) {
      valido = false;
    }
  });

  return valido;
}

/* Limpia el error de un campo apenas el usuario lo corrige */
function iniciarFormularios() {
  document.addEventListener('input', (e) => {
    const campo = e.target;
    if (!campo.matches('.entrada')) return;
    const contenedor = campo.closest('.campo-form');
    const error = contenedor ? $('.error-form', contenedor) : null;
    if (error && error.classList.contains('visible')) {
      error.classList.remove('visible');
      campo.setAttribute('aria-invalid', 'false');
    }
  });

  // Formularios de pagina (contacto, eventos): confirman sin enviar nada
  $$('[data-form-demo]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validarFormulario(form)) return;

      const nombre = (new FormData(form).get('nombre') || '').toString().trim();
      const destino = $('[data-form-respuesta]', form.closest('[data-form-bloque]') || document);

      if (destino) {
        destino.innerHTML = `
          <div class="sello">
            <div class="sello__anillo" aria-hidden="true">✓</div>
            <h3 class="modal__titulo">Mensaje recibido</h3>
            <p class="modal__glosa">Gracias${nombre ? ', ' + limpiar(nombre.split(' ')[0]) : ''}. Te respondemos en menos de 24 horas habiles.</p>
          </div>`;
        form.hidden = true;
      }

      avisar('Mensaje enviado');
    });
  });
}

/* ==========================================================================
   Botones de reserva declarativos: data-reservar en cualquier pagina
   ========================================================================== */
function iniciarBotonesReserva() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-reservar]');
    if (!btn) return;
    e.preventDefault();

    abrirReserva({
      tipo: btn.dataset.tipo || 'Reserva',
      titulo: btn.dataset.titulo || 'Visita a Zonzen',
      glosa: btn.dataset.glosa || '',
      horaFija: btn.dataset.hora || null,
    });
  });
}

/* ==========================================================================
   Arranque
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  iniciarCabecera();
  iniciarMenuMovil();
  iniciarRevelado();
  iniciarCircuito();
  iniciarContador();
  iniciarFormularios();
  iniciarBotonesReserva();
  iniciarCarga();
});
