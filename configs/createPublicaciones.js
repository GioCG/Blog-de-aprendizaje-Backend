import Categori from "../src/categori/categori.model.js";
import User from "../src/user/user.model.js";
import Publicacion from "../src/publicaciones/publicacion.model.js";
import {existePublicacion}  from "../src/middleware/validate-autoPublicacion.js"; 

export const createPublicaciones = async () => {
    try {
        const admin = await User.findOne({ username: { $regex: /^admin$/i } });
        if (!admin) {
            console.log("Usuario admin no encontrado. Crea el usuario primero.");
            return;
        }

        const categoriasConTareas = [
            {
                name: "practicasupervisada",
                publicaciones: [
                    { 
                        titulo: "Exposición grupal #1",
                        textoprincipal: `
Instrucciones generales para exposición
1. Asignación de temas: Cada grupo presentará sobre un framework para desarrollo de aplicaciones híbridas. El framework será asignado de forma aleatoria por el docente:
a. Xamarin, b. Native Script, c. React Native, d. Flutter, e. Ionic, f. Framework 7, g. Apache Córdova.
2. Trabajo en equipo: Se sugiere dividir responsabilidades por secciones del tema.
3. Duración: 15 a 20 minutos por grupo.
4. Presentación: PowerPoint, Google Slides, Canva, etc.
5. Entrega: Subir la presentación y materiales a la plataforma.

Estructura sugerida:
1. Introducción al framework
2. Lenguaje de programación
3. Funcionalidades principales
4. Compatibilidad y plataformas
5. Ventajas
6. Limitaciones
7. Casos de uso
8. Conclusión y opinión del grupo

Profesores: Josué Noj y Braulio Echeverria
                        `.trim()
                    },
                    { 
                        titulo: "Laboratorio #4",
                        textoprincipal: `
Trabajo en equipo bajo metodología SCRUM con el Stack MERN (MongoDB, Express, React, Node.js).

Objetivo: Crear una aplicación web para administración de una almacenadora con funcionalidades como:
1. Gestión de productos: registrar, editar, eliminar, buscar y filtrar.
2. Entradas y salidas: registrar movimientos y mantener historial.
3. Proveedores y clientes: registro y administración.
4. Informes y estadísticas: inventario, movimientos, productos más movidos.
5. Roles: administrador y empleado con distintos niveles de acceso.
6. Notificaciones: alertas de stock bajo y vencimientos.

Profesores: Josué Noj y Braulio Echeverria
                        `.trim()
                    },
                    { 
                        titulo: "Evaluación Técnica Bimestral",
                        textoprincipal: `
Requisitos de finalización del examen bimestral de práctica supervisada.

Apertura: lunes, 19 de mayo de 2025, 00:00  
Cierre: domingo, 25 de mayo de 2025, 23:00  

Evaluación:  
50% del examen bimestral de Tecnología  
50% del proyecto bimestral de Taller
                        `.trim()
                    }
                ]
            },
            {
                name: "talleriii",
                publicaciones: [
                    { 
                        titulo: "Taller de React",
                        textoprincipal: `
Práctica intensiva en desarrollo con ReactJS.

Objetivos:
- Crear componentes reutilizables
- Manejo de estado con hooks
- Consumo de APIs
- Routing con React Router
- Implementación de autenticación

Duración: 4 semanas
Entrega: Proyecto final funcional

Profesores: Josué Noj y Braulio Echeverria
                        `.trim()
                    },
                    { 
                        titulo: "Taller de MongoDB",
                        textoprincipal: `
Introducción y consulta de bases de datos no relacionales.

Temas cubiertos:
- Modelado de datos en MongoDB
- Operaciones CRUD
- Agregaciones
- Índices y optimización
- Integración con Node.js

Material requerido: MongoDB Atlas cuenta gratuita

Profesores: Josué Noj y Braulio Echeverria
                        `.trim()
                    },
                    {
                        titulo: "Proyecto de Gestión Hotelera",
                        textoprincipal: `
Desarrollo de un sistema completo de gestión hotelera con las siguientes características:

1. Gestión de hoteles y habitaciones:
   - Registro y administración de información detallada
   - Mantenimiento de inventario de habitaciones

2. Gestión de eventos:
   - Programación de conferencias, bodas, reuniones
   - Asignación de recursos y servicios

3. Generación de informes:
   - Estadísticas de demanda
   - Reportes de reservaciones

Tecnologías requeridas: MERN Stack (MongoDB, Express, React, Node.js)

Fecha de entrega: 30 de mayo 2025
                        `.trim()
                    },
                    { 
                        titulo: "Documentación del Sistema",
                        textoprincipal: `
Requisitos para la documentación del proyecto:

1. Manual de Usuario:
   - Guía completa de funcionalidades
   - Instrucciones para cada tipo de usuario
   - Solución de problemas comunes

2. Documentación de API:
   - Descripción de endpoints
   - Ejemplos de solicitudes/respuestas
   - Especificaciones de seguridad

Formato de entrega: PDF o documentación online con Swagger

Fecha límite: 5 de junio 2025
                        `.trim()
                    },
                    { 
                        titulo: "Presentación Final",
                        textoprincipal: `
Preparación para la demostración final del proyecto:

1. Demostración en vivo de 15 minutos mostrando:
   - Funcionalidades principales
   - Flujos de trabajo completos
   - Aspectos técnicos destacables

2. Preparar preguntas frecuentes
3. Mostrar métricas de rendimiento
4. Presentar roadmap de mejoras futuras

Fecha de presentación: 10 de junio 2025
                        `.trim()
                    }
                ]
            },
            { 
                name: "tecnologia",
                publicaciones: [
                    {
                      titulo: "Instrucciones Generales para Infografía sobre ReactJS",
                      textoprincipal: `
1. Trabajo individual: Esta actividad debe realizarse de forma individual.
2. Formato de entrega: La infografía debe presentarse en formato de imagen (PNG o JPEG) o PDF.
3. Claridad y diseño visual: La infografía debe ser visualmente atractiva, organizada y fácil de leer, utilizando elementos gráficos como íconos, colores y tipografías adecuadas.
4. Entrega: Subir la infografía en el formato indicado en la plataforma de entrega, cumpliendo con la fecha límite asignada por el docente.

Tópicos sugeridos:
- Facilidad de Uso y Aprendizaje
- Componentes Reutilizables
- Rendimiento Optimizado
- Ecosistema y Comunidad Activa
- SEO Mejorado con Renderizado del Lado del Servidor
- Actualizaciones y Soporte Constante de Facebook

Consideraciones Adicionales:
- Organización y estructura: Agrupa los beneficios en secciones claras y utiliza subtítulos o íconos para diferenciar cada punto.
- Resumen visual: Usa gráficos, ilustraciones o colores para enfatizar cada beneficio y hacer la información más atractiva.
- Datos adicionales: Añade estadísticas o citas de expertos que refuercen los beneficios descritos.

**Nota**: La infografía debe ofrecer una visión clara y concisa sobre las ventajas principales de ReactJS, logrando captar la atención y facilitando la comprensión de sus beneficios para el desarrollo de interfaces web.
                      `.trim()
                    },
                    {
                      titulo: "Propuesta de Proyecto con Metodología SCRUM y Stack MERN",
                      textoprincipal: `
1. Trabajo en equipo: Esta actividad se realizará en grupos, asignando roles para trabajar colaborativamente.
2. Metodología SCRUM: Aplicar SCRUM desde la planificación hasta la implementación, definiendo roles y plan de trabajo iterativo.
3. Formato de entrega: Documento digital (PDF).
4. Alcance: Proyecto realista con plazo de 5 semanas.

Estructura:
- CARATULA: Título, integrantes y roles, fecha.
- INTRODUCCIÓN: Descripción del problema social, objetivo y tecnologías (Stack MERN).
- DESCRIPCIÓN DEL PROBLEMA SOCIAL: Contexto, impacto, alcance.
- OBJETIVOS: General y específicos.
- SOLUCIÓN PROPUESTA: Funcionalidades, interacción, beneficios.
- JUSTIFICACIÓN TECNOLÓGICA: Uso y ventajas del Stack MERN.
- IMPACTO Y BENEFICIOS: Mejoras sociales, escalabilidad.
- PLAN DE TRABAJO SCRUM: Sprints, roles, actividades.
- CRONOGRAMA: Fases y tiempos.
- CONSIDERACIONES FINALES: Riesgos, recursos.
- CONCLUSIONES Y LLAMADO A LA ACCIÓN.

**Consideraciones**: Enfoque práctico, cumplimiento de SCRUM y claridad en problema y solución.
                      `.trim()
                    },
                    {
                      titulo: "Investigación sobre API, REST y Buenas Prácticas",
                      textoprincipal: `
1. Trabajo individual.
2. Extensión mínima: 4 páginas (sin caratula, índice ni referencias).
3. Formato: Normas APA (caratula, encabezados, citas, referencias).
4. Entrega en PDF o Word.

Estructura:
- Caratula
- Índice
- Introducción
- Desarrollo
- Conclusiones
- Recomendaciones
- Referencias

**Nota**: Investigar detalladamente API, REST, RESTful y buenas prácticas en desarrollo de API, comprendiendo conceptos, diferencias e importancia en software moderno.
                      `.trim()
                    },
                    {
                      titulo: "Objetivo y Requisitos de la Exposición del Proyecto MERN",
                      textoprincipal: `
Objetivo: Presentar clara y convincentemente la propuesta de proyecto del 3er bimestre usando Stack MERN para una problemática social.

Detalles:
- Trabajo en equipo con roles definidos.
- Duración mínima: 15 minutos.
- Estructura: Introducción, objetivo, solución, plataforma, metodología SCRUM, viabilidad, impacto y conclusión.
- Apoyo visual: Presentación atractiva con gráficos y mockups.
- Evaluación: Claridad, organización, dominio y apoyo visual.
- Ronda de preguntas post exposición.

Profesores: Josué Noj y Braulio Echeverria
                      `.trim()
                    }
                ]
            }
        ];

        
        for (const cat of categoriasConTareas) {
            const categoria = await Categori.findOne({ name: { $regex: new RegExp(`^${cat.name}$`, "i") } });
            if (!categoria) {
                console.log(`Categoría '${cat.name}' no encontrada. Omisión de sus publicaciones.`);
                continue;
            }

            for (const pub of cat.publicaciones) {
                const yaExiste = await existePublicacion(pub.titulo, categoria._id);
                if (yaExiste) {
                    console.log(`La publicación '${pub.titulo}' ya existe en la categoría '${cat.name}', omitiendo creación.`);
                    continue;
                }

                const nueva = new Publicacion({
                    titulo: pub.titulo,
                    textoprincipal: pub.textoprincipal,
                    category: categoria._id,
                    user: admin._id,
                    status: true
                });

                await nueva.save();
                console.log(`Publicación '${pub.titulo}' creada en la categoría '${cat.name}'.`);
            }
        }

        console.log("Todas las publicaciones generadas automáticamente con éxito.");
    } catch (err) {
        console.error("Error al crear publicaciones automáticas:", err.message);
    }
};
