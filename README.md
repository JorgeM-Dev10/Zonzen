# Zonzen · Wellness Center

Sitio de demostración para Zonzen: gimnasio, clases, spa con circuito térmico,
cafetería saludable y salón de eventos.

**Es un demo.** Frontend estático, sin backend y sin base de datos: todo lo
interactivo se resuelve en el navegador y las reservas se guardan en
`localStorage`. Nada sale del equipo del visitante.

## Concepto

Las termas. Zonzen no son cinco negocios, es **un recorrido por el cuerpo**:
calor, agua, movimiento y reposo.

El elemento firma es **El Circuito**: un riel que ordena los cinco espacios por
intensidad real (`reposo → agua → mesa → ritmo → fuerza`). En la portada sirve
como navegación; en la página de Spa se convierte en el circuito térmico
(12 °C tinas frías → 90 °C sauna) y el ambiente de la sección migra de salvia a
brasa según la parada seleccionada.

| | |
|---|---|
| Color | `obsidiana #0E100E` · `basalto #191C19` · `vapor #E9E6DC` · `salvia #7F9174` · `oro #C6A15B` · `brasa #C4703F` |
| Display | Marcellus — romana inscripcional |
| Cuerpo | Karla |
| Datos | JetBrains Mono — temperaturas, horarios, precios, macros |

## Estructura

```
├── index.html          Portada · hero y El Circuito
├── gimnasio.html       Zonas del piso y horario semanal filtrable
├── spa.html            Circuito térmico interactivo y carta de masajes
├── cafeteria.html      Carta con filtros y macros
├── eventos.html        Salones y formulario de cotización
├── membresias.html     Planes con toggle mensual/anual y comparativa
├── contacto.html       Formulario y datos de contacto
├── css/
│   ├── base.css        Tokens, reset, tipografía, animaciones base
│   ├── layout.css      Cabecera, pie, secciones, grillas
│   └── components.css  Botones, El Circuito, tarjetas, modal, formularios
└── js/
    ├── datos.js        Todo el contenido (clases, masajes, menú, planes)
    ├── main.js         Cabecera, revelado, reservas, modal, validación
    ├── horario.js      Horario semanal y tira de "clases de hoy"
    ├── spa.js          Termostato del circuito y carta de masajes
    ├── cafeteria.js    Filtros de la carta
    └── membresias.js   Planes, interruptor y tabla comparativa
```

## Correr en local

No hay build ni dependencias. Abre `index.html` con doble clic, o levanta un
servidor estático:

```bash
npx serve .
```

## Qué funciona en el demo

- Reservar clases, masajes, circuito, salones y visitas guiadas
- "Mis reservas" con cancelación, persistido en `localStorage`
- Horario semanal filtrable por disciplina y nivel
- Circuito térmico interactivo (clic o flechas del teclado)
- Carta de cafetería con filtros por categoría y etiqueta nutricional
- Membresías con precio mensual/anual y comparativa
- Formularios con validación en cliente y confirmación en pantalla

## Qué falta para producción

Reservas y formularios contra una API real, pasarela de pago, mapa interactivo,
fotografía (hoy los visuales son campos de gradiente generados en CSS) y textos
legales.

## Accesibilidad

Navegación completa por teclado, foco visible, `aria-*` en filtros, modal y
circuito, salto al contenido y `prefers-reduced-motion` respetado.
