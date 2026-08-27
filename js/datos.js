/* ==========================================================================
   ZONZEN — datos.js
   Contenido del demo. Sin backend: todo vive aqui y se lee en el navegador.
   Para conectar a una API real, reemplaza cada arreglo por un fetch().
   ========================================================================== */

/* Tonos del eje termico. Cada pilar tiene su color en el circuito. */
const TONOS = {
  reposo: 'var(--salvia)',
  agua:   '#6E93A0',
  mesa:   'var(--oro)',
  ritmo:  '#B98652',
  fuerza: 'var(--brasa)',
};

const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

/* --- Clases --------------------------------------------------------------- */
const DISCIPLINAS = {
  cycling:   { nombre: 'Cycling',   tono: 'var(--brasa)',  sala: 'Sala Brasa' },
  yoga:      { nombre: 'Yoga',      tono: 'var(--salvia)', sala: 'Sala Vapor' },
  zumba:     { nombre: 'Zumba',     tono: '#B98652',       sala: 'Sala Brasa' },
  funcional: { nombre: 'Funcional', tono: 'var(--oro)',    sala: 'Piso de fuerza' },
};

const CLASES = [
  { dia: 'Lunes', hora: '06:30', duracion: 45, disciplina: 'cycling',   titulo: 'Cycling Amanecer',    coach: 'Renata Ibarra',  nivel: 'Intermedio', cupo: 24, tomados: 21 },
  { dia: 'Lunes', hora: '07:30', duracion: 60, disciplina: 'funcional', titulo: 'Funcional Base',      coach: 'Diego Salas',    nivel: 'Todos',      cupo: 18, tomados: 9  },
  { dia: 'Lunes', hora: '12:00', duracion: 50, disciplina: 'yoga',      titulo: 'Yoga Mediodia',       coach: 'Ana Corral',     nivel: 'Todos',      cupo: 20, tomados: 14 },
  { dia: 'Lunes', hora: '18:30', duracion: 45, disciplina: 'cycling',   titulo: 'Cycling Ritmo',       coach: 'Renata Ibarra',  nivel: 'Avanzado',   cupo: 24, tomados: 24 },
  { dia: 'Lunes', hora: '19:30', duracion: 55, disciplina: 'zumba',     titulo: 'Zumba Noche',         coach: 'Karla Mendez',   nivel: 'Todos',      cupo: 30, tomados: 18 },
  { dia: 'Lunes', hora: '20:30', duracion: 60, disciplina: 'yoga',      titulo: 'Yin Yoga',            coach: 'Ana Corral',     nivel: 'Principiante', cupo: 20, tomados: 11 },

  { dia: 'Martes', hora: '06:30', duracion: 60, disciplina: 'funcional', titulo: 'Fuerza Metabolica',  coach: 'Diego Salas',    nivel: 'Intermedio', cupo: 18, tomados: 15 },
  { dia: 'Martes', hora: '08:00', duracion: 50, disciplina: 'yoga',      titulo: 'Vinyasa Fluido',     coach: 'Ana Corral',     nivel: 'Intermedio', cupo: 20, tomados: 7  },
  { dia: 'Martes', hora: '13:00', duracion: 45, disciplina: 'cycling',   titulo: 'Cycling Express',    coach: 'Pablo Rios',     nivel: 'Todos',      cupo: 24, tomados: 12 },
  { dia: 'Martes', hora: '18:00', duracion: 55, disciplina: 'zumba',     titulo: 'Zumba Latino',       coach: 'Karla Mendez',   nivel: 'Todos',      cupo: 30, tomados: 26 },
  { dia: 'Martes', hora: '19:00', duracion: 60, disciplina: 'funcional', titulo: 'Core y Movilidad',   coach: 'Diego Salas',    nivel: 'Todos',      cupo: 18, tomados: 13 },

  { dia: 'Miercoles', hora: '06:30', duracion: 45, disciplina: 'cycling',   titulo: 'Cycling Amanecer', coach: 'Pablo Rios',   nivel: 'Intermedio', cupo: 24, tomados: 19 },
  { dia: 'Miercoles', hora: '09:00', duracion: 50, disciplina: 'yoga',      titulo: 'Hatha Consciente', coach: 'Ana Corral',   nivel: 'Principiante', cupo: 20, tomados: 6 },
  { dia: 'Miercoles', hora: '12:00', duracion: 60, disciplina: 'funcional', titulo: 'Funcional Base',   coach: 'Ivan Cruz',    nivel: 'Todos',      cupo: 18, tomados: 10 },
  { dia: 'Miercoles', hora: '18:30', duracion: 45, disciplina: 'cycling',   titulo: 'Cycling Ritmo',    coach: 'Renata Ibarra',nivel: 'Avanzado',   cupo: 24, tomados: 22 },
  { dia: 'Miercoles', hora: '19:30', duracion: 55, disciplina: 'zumba',     titulo: 'Zumba Noche',      coach: 'Karla Mendez', nivel: 'Todos',      cupo: 30, tomados: 20 },

  { dia: 'Jueves', hora: '07:00', duracion: 60, disciplina: 'funcional', titulo: 'Fuerza Metabolica',  coach: 'Ivan Cruz',     nivel: 'Intermedio', cupo: 18, tomados: 16 },
  { dia: 'Jueves', hora: '12:00', duracion: 50, disciplina: 'yoga',      titulo: 'Yoga Mediodia',      coach: 'Ana Corral',    nivel: 'Todos',      cupo: 20, tomados: 12 },
  { dia: 'Jueves', hora: '18:00', duracion: 45, disciplina: 'cycling',   titulo: 'Cycling Resistencia',coach: 'Pablo Rios',    nivel: 'Avanzado',   cupo: 24, tomados: 17 },
  { dia: 'Jueves', hora: '19:00', duracion: 55, disciplina: 'zumba',     titulo: 'Zumba Latino',       coach: 'Karla Mendez',  nivel: 'Todos',      cupo: 30, tomados: 24 },
  { dia: 'Jueves', hora: '20:00', duracion: 60, disciplina: 'yoga',      titulo: 'Yin Yoga',           coach: 'Ana Corral',    nivel: 'Principiante', cupo: 20, tomados: 9 },

  { dia: 'Viernes', hora: '06:30', duracion: 45, disciplina: 'cycling',   titulo: 'Cycling Amanecer',  coach: 'Renata Ibarra', nivel: 'Intermedio', cupo: 24, tomados: 20 },
  { dia: 'Viernes', hora: '08:00', duracion: 60, disciplina: 'funcional', titulo: 'Funcional Base',    coach: 'Diego Salas',   nivel: 'Todos',      cupo: 18, tomados: 11 },
  { dia: 'Viernes', hora: '13:00', duracion: 50, disciplina: 'yoga',      titulo: 'Vinyasa Fluido',    coach: 'Ana Corral',    nivel: 'Intermedio', cupo: 20, tomados: 8  },
  { dia: 'Viernes', hora: '18:30', duracion: 55, disciplina: 'zumba',     titulo: 'Zumba Fin de Semana',coach: 'Karla Mendez', nivel: 'Todos',      cupo: 30, tomados: 28 },

  { dia: 'Sabado', hora: '08:00', duracion: 60, disciplina: 'funcional', titulo: 'Funcional Outdoor',  coach: 'Diego Salas',   nivel: 'Todos',      cupo: 22, tomados: 17 },
  { dia: 'Sabado', hora: '09:30', duracion: 45, disciplina: 'cycling',   titulo: 'Cycling Largo',      coach: 'Pablo Rios',    nivel: 'Intermedio', cupo: 24, tomados: 14 },
  { dia: 'Sabado', hora: '11:00', duracion: 60, disciplina: 'yoga',      titulo: 'Yoga Restaurativo',  coach: 'Ana Corral',    nivel: 'Todos',      cupo: 20, tomados: 15 },
  { dia: 'Sabado', hora: '12:30', duracion: 55, disciplina: 'zumba',     titulo: 'Zumba Party',        coach: 'Karla Mendez',  nivel: 'Todos',      cupo: 30, tomados: 22 },

  { dia: 'Domingo', hora: '09:00', duracion: 60, disciplina: 'yoga',      titulo: 'Yoga Restaurativo', coach: 'Ana Corral',    nivel: 'Todos',      cupo: 20, tomados: 13 },
  { dia: 'Domingo', hora: '10:30', duracion: 60, disciplina: 'funcional', titulo: 'Movilidad Domingo', coach: 'Ivan Cruz',     nivel: 'Principiante', cupo: 18, tomados: 8 },
];

/* --- Spa: paradas del circuito termico ------------------------------------ */
const PARADAS = [
  {
    id: 'tinas', grados: 12, nombre: 'Tinas frias',
    tono: '#6E93A0',
    tiempo: '1 a 3 minutos',
    glosa: 'Inmersion corta despues del calor. Cierra el poro, baja la inflamacion y devuelve la alerta al cuerpo. Es la mitad que casi nadie hace y la que hace que el circuito funcione.',
  },
  {
    id: 'hidromasaje', grados: 34, nombre: 'Tinas de hidromasaje',
    tono: '#7F9174',
    tiempo: '10 a 15 minutos',
    glosa: 'Chorros dirigidos a espalda baja, cuello y pantorrillas. Trabaja el tejido sin manos: util despues de pierna o de un dia largo de pie.',
  },
  {
    id: 'jacuzzi', grados: 38, nombre: 'Jacuzzi',
    tono: 'var(--oro)',
    tiempo: '15 a 20 minutos',
    glosa: 'El punto medio del circuito. Sube la temperatura central sin exigirte nada. La mayoria empieza y termina aqui.',
  },
  {
    id: 'vapor', grados: 45, nombre: 'Vapor con eucalipto',
    tono: '#B98652',
    tiempo: '8 a 12 minutos',
    glosa: 'Humedad al 100 % y eucalipto en el aire. Abre la via respiratoria y prepara la piel para el masaje.',
  },
  {
    id: 'sauna', grados: 90, nombre: 'Sauna seco',
    tono: 'var(--brasa)',
    tiempo: '10 a 15 minutos',
    glosa: 'Cedro y calor seco. El extremo caliente del circuito: de aqui se sale directo a las tinas frias, nunca al reves.',
  },
];

/* --- Masajes -------------------------------------------------------------- */
const MASAJES = [
  { id: 'relajante',   nombre: 'Relajante',        duracion: 60, precio: 890,  tono: 'var(--salvia)', texto: 'Presion ligera y ritmo constante con aceite tibio de almendra. Para bajar revoluciones despues de una semana larga.' },
  { id: 'deportivo',   nombre: 'Deportivo',        duracion: 60, precio: 1050, tono: 'var(--brasa)',  texto: 'Trabajo profundo sobre los grupos que entrenaste. Se agenda el mismo dia o al siguiente de una carga fuerte.' },
  { id: 'descontract', nombre: 'Descontracturante',duracion: 75, precio: 1190, tono: '#B98652',       texto: 'Presion sostenida sobre nudos de trapecio, cuello y lumbar. Incomoda mientras dura, libera despues.' },
  { id: 'reductivo',   nombre: 'Reductivo',        duracion: 60, precio: 980,  tono: 'var(--oro)',    texto: 'Maniobras rapidas de amasamiento sobre abdomen, cadera y muslo. Se recomienda en serie de seis sesiones.' },
  { id: 'linfatico',   nombre: 'Drenaje linfatico',duracion: 75, precio: 1150, tono: '#6E93A0',       texto: 'Presion muy suave siguiendo la ruta linfatica. Baja retencion de liquidos y pesadez en piernas.' },
  { id: 'piedras',     nombre: 'Piedras calientes',duracion: 90, precio: 1390, tono: 'var(--brasa)',  texto: 'Basalto a 52 grados apoyado sobre la columna, combinado con maniobras suecas. El mas largo de la carta.' },
];

/* --- Cafeteria ------------------------------------------------------------ */
const MENU = [
  { id:'m1',  nombre:'Bowl de pollo y quinoa',      precio:165, cat:'comida',  tono:'var(--oro)',    texto:'Pechuga asada, quinoa roja, camote, kale masajeado y aderezo de tahini.', kcal:520, prot:42, carb:44, etiquetas:['Alto en proteina','Sin gluten'] },
  { id:'m2',  nombre:'Bowl vegano de lentejas',     precio:145, cat:'comida',  tono:'var(--salvia)', texto:'Lenteja beluga, betabel rostizado, nuez activada y vinagreta de limon.', kcal:430, prot:22, carb:52, etiquetas:['Vegano','Sin gluten'] },
  { id:'m3',  nombre:'Salmon con esparragos',       precio:225, cat:'comida',  tono:'#B98652',       texto:'Salmon sellado, esparrago a la parrilla y pure de coliflor con eneldo.', kcal:490, prot:38, carb:14, etiquetas:['Alto en proteina','Keto'] },
  { id:'m4',  nombre:'Wrap integral de pavo',       precio:135, cat:'comida',  tono:'var(--oro)',    texto:'Pavo horneado en casa, aguacate, espinaca y hummus en tortilla integral.', kcal:410, prot:31, carb:38, etiquetas:['Alto en proteina'] },
  { id:'m5',  nombre:'Batido proteico de cacao',    precio:95,  cat:'bebida',  tono:'var(--brasa)',  texto:'Doble scoop de proteina de suero, cacao crudo, platano y leche de almendra.', kcal:310, prot:32, carb:28, etiquetas:['Alto en proteina','Post-entreno'] },
  { id:'m6',  nombre:'Verde detox',                 precio:85,  cat:'bebida',  tono:'var(--salvia)', texto:'Apio, pepino, espinaca, manzana verde y jengibre. Prensado en frio cada mañana.', kcal:120, prot:3, carb:26, etiquetas:['Vegano','Sin gluten'] },
  { id:'m7',  nombre:'Cafe de olla frio',           precio:65,  cat:'bebida',  tono:'#B98652',       texto:'Extraccion en frio de 18 horas con canela y un toque de piloncillo.', kcal:45, prot:1, carb:10, etiquetas:['Vegano'] },
  { id:'m8',  nombre:'Matcha con avena',            precio:90,  cat:'bebida',  tono:'var(--salvia)', texto:'Matcha ceremonial grado A batido con leche de avena, sin azucar añadida.', kcal:135, prot:4, carb:18, etiquetas:['Vegano'] },
  { id:'m9',  nombre:'Barra de dátil y almendra',   precio:55,  cat:'snack',   tono:'var(--oro)',    texto:'Datil medjool, almendra, cacao nibs y sal de mar. Hecha en casa, sin horno.', kcal:210, prot:6, carb:26, etiquetas:['Vegano','Sin gluten'] },
  { id:'m10', nombre:'Yogur griego con frutos',     precio:80,  cat:'snack',   tono:'var(--oro)',    texto:'Yogur griego natural, zarzamora, granola de amaranto y miel de agave.', kcal:265, prot:18, carb:30, etiquetas:['Alto en proteina'] },
  { id:'m11', nombre:'Hummus con crudites',         precio:75,  cat:'snack',   tono:'var(--salvia)', texto:'Hummus de garbanzo y comino con zanahoria, jicama y pepino.', kcal:190, prot:8, carb:22, etiquetas:['Vegano','Sin gluten'] },
  { id:'m12', nombre:'Huevo y aguacate en centeno', precio:110, cat:'comida',  tono:'#B98652',       texto:'Dos huevos pochados, aguacate, hojuela de chile y pan de centeno tostado.', kcal:380, prot:20, carb:28, etiquetas:['Alto en proteina'] },
];

const ETIQUETAS_MENU = ['Vegano', 'Alto en proteina', 'Sin gluten', 'Keto', 'Post-entreno'];

/* --- Membresias ----------------------------------------------------------- */
const PLANES = [
  {
    id: 'movimiento',
    nombre: 'Movimiento',
    lema: 'Gimnasio y clases, sin limite de horario.',
    mensual: 899,
    anual: 8990,
    destacado: false,
    incluye: [
      'Piso de fuerza y cardio, horario completo',
      'Clases ilimitadas: cycling, yoga, zumba, funcional',
      'Valoracion corporal cada trimestre',
      'Casillero de dia y toalla',
    ],
    excluye: ['Circuito de spa', 'Masajes con descuento', 'Invitados'],
  },
  {
    id: 'circuito',
    nombre: 'Circuito',
    lema: 'El recorrido completo: entrenar, comer, recuperar.',
    mensual: 1499,
    anual: 14990,
    destacado: true,
    incluye: [
      'Todo lo de Movimiento',
      'Circuito de spa ilimitado: sauna, vapor, jacuzzi y tinas',
      '15 % de descuento en masajes y cafeteria',
      'Casillero fijo con nombre',
      'Dos invitados al mes',
    ],
    excluye: ['Masajes incluidos'],
  },
  {
    id: 'reposo',
    nombre: 'Reposo',
    lema: 'Para quien viene por la recuperacion, no por la carga.',
    mensual: 1899,
    anual: 18990,
    destacado: false,
    incluye: [
      'Todo lo de Circuito',
      'Dos masajes de 60 minutos al mes',
      'Plan de recuperacion con terapeuta asignado',
      '25 % de descuento en cafeteria',
      'Reserva prioritaria de clases y cabina',
      'Cuatro invitados al mes',
    ],
    excluye: [],
  },
];

const COMPARATIVA = [
  { fila: 'Piso de fuerza y cardio',        movimiento: true,  circuito: true,  reposo: true },
  { fila: 'Clases ilimitadas',              movimiento: true,  circuito: true,  reposo: true },
  { fila: 'Circuito de spa',                movimiento: false, circuito: true,  reposo: true },
  { fila: 'Masajes incluidos',              movimiento: '—',   circuito: '—',   reposo: '2 / mes' },
  { fila: 'Descuento en cafeteria',         movimiento: '—',   circuito: '15 %', reposo: '25 %' },
  { fila: 'Invitados al mes',               movimiento: '—',   circuito: '2',   reposo: '4' },
  { fila: 'Reserva prioritaria',            movimiento: false, circuito: false, reposo: true },
  { fila: 'Casillero fijo',                 movimiento: false, circuito: true,  reposo: true },
];

