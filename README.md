# Jon Rio — Portfolio

Portfolio personal de Jon Rio, Data Analyst en Inetum (Bilbao). Sitio estático, sin build ni frameworks: HTML y CSS puros.

🔗 **Demo:** [jonri-portfolio-jonri.vercel.app](https://jonri-portfolio-jonri.vercel.app)

## Estructura

```
.
├── index.html              # Contenido y estructura de la página
├── style.css                # Estilos (layout, colores, componentes)
├── avatar.jpg                # Foto de perfil (barra lateral)
├── proj-eclipse.jpg          # Imagen — proyecto Eclipse Solar España
├── proj-recomendador.jpg     # Imagen — proyecto Recomendador
├── proj-gasolina.jpg         # Imagen — proyecto Gasolina Tracker
└── README.md
```

Sin `package.json`, sin dependencias, sin paso de compilación. Abrir `index.html` en un navegador basta para verlo en local.

## Secciones

- **Barra lateral** — foto, nombre, rol, ubicación, contacto y skills.
- **Proyectos** — tarjetas con imagen, descripción y enlace a cada demo desplegada.
- **Experiencia** — puesto actual.
- **Contacto** — email y LinkedIn.

## Editar contenido

Todo el texto e imágenes están directamente en `index.html` — no hay CMS ni datos externos. Para:

- **Cambiar texto** (bio, descripciones, experiencia): edita el HTML correspondiente en `index.html`.
- **Añadir un proyecto**: duplica un bloque `<article class="project-card">` dentro de `#proyectos`, añade su imagen al repo y referénciala en el `<img class="project-thumb">`.
- **Cambiar colores**: los tokens de color están al principio de `style.css` (`:root`), en formato `--coral-*`.

## Despliegue

Este repo está conectado a Vercel — cualquier push a `main` despliega automáticamente en unos 30 segundos. No hace falta configurar nada más (framework: *Other*, sin build command).

## Pendiente

- [ ] Historial de experiencia completo (fechas y puestos anteriores)
- [ ] Confirmar stack técnico real de cada proyecto para sus etiquetas
