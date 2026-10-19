# Jon Rio — Portfolio

Portfolio personal de Jon Rio, Data Analyst en Inetum (Bilbao). Sitio estático, sin build ni frameworks: HTML, CSS y JS puros.
<img width="1898" height="578" alt="image" src="https://github.com/user-attachments/assets/5d08234a-5351-45fd-a0c9-4f69c96fa55e" />

🔗 **Demo:** [portfolio-seven-ashen-52.vercel.app](https://portfolio-seven-ashen-52.vercel.app)

## Estructura

```
.
├── index.html              # Contenido y estructura de la página
├── style.css               # Estilos: tokens de color (claro/oscuro), layout, componentes y animaciones
├── script.js               # Interacción: tema, mini juego, aparición al hacer scroll, confeti, copiar email
├── avatar.jpg              # Foto de perfil (tarjeta del héroe)
├── sprite.png              # Sprite original de Jon caminando (6 fotogramas)
├── sprite-walk.png         # Sprite normalizado (6 × 72×128 px) que usa la animación
├── hero.webp               # Banner pixel art — se usa como imagen al compartir (og:image)
├── proj-eclipse.jpg        # Imagen — proyecto Eclipse Solar España
├── proj-recomendador.jpg   # Imagen — proyecto Recomendador
├── proj-gasolina.jpg       # Imagen — proyecto Gasolina Tracker
└── README.md
```

Sin `package.json`, sin dependencias, sin paso de compilación. Abrir `index.html` en un navegador basta para verlo en local.

## Secciones

| Sección | Contenido |
|---|---|
| **Héroe** | Nombre, rol con efecto máquina de escribir, bio, CTAs y redes. A la derecha, un mini juego pixel: Jon camina por la ciudad (de noche en modo oscuro, de día en claro); al pulsarlo salta y gana XP, con logros a los 10, 30 y 100 saltos |
| **Proyectos** | Tarjetas con imagen, etiquetas, descripción y enlace a cada demo desplegada |
| **Qué hago** | Los cuatro pasos (Análisis → Visualización → Insights → Decisiones) con mini gráficos animados y herramientas |
| **Trayectoria** | Experiencia en línea de tiempo + formación en tarjetas |
| **Contacto** | Botón para copiar el email, LinkedIn y GitHub |

## Editar contenido

Todo el texto está directamente en `index.html` — no hay CMS ni datos externos. Para:

- **Cambiar texto** (bio, descripciones, experiencia): edita el HTML correspondiente en `index.html`.
- **Añadir un proyecto**: duplica un bloque `<article class="project spot" data-reveal>` dentro de `#proyectos`, cambia imagen (640×400), etiquetas, título, enlace, descripción y el número (`04`, `05`…). Sube `--i` en el `style` para que entre escalonado.
- **Cambiar los roles del héroe**: array `roles` en `script.js`.
- **Cambiar colores**: los tokens están al principio de `style.css` (`:root` para el modo oscuro y `:root[data-theme="light"]` para el claro).

## Despliegue

Este repo está conectado a Vercel — cualquier push a `main` despliega automáticamente en unos 30 segundos. No hace falta configurar nada más (framework: *Other*, sin build command).
