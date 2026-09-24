# Mapa del proyecto — DiaryTasks

> Agenda diaria offline (tareas + notas por día) en **Expo / React Native + SQLite local**.
> Este archivo es el mapa de referencia: consúltalo antes de leer el código.
> **Si cambias la arquitectura, actualiza este archivo.**

---

## 1. Stack y comandos

| | |
|---|---|
| Runtime | Expo SDK 52, React Native 0.76, React 18.3 |
| Lenguaje | TypeScript en modo `strict` |
| Persistencia | `expo-sqlite` (base local, **sin backend ni red**) |
| Navegación | React Navigation (Stack + Bottom Tabs) declarados a mano |
| Estado | 3 React Contexts (no hay Redux/Zustand) |
| Tests | Jest (`jest-expo`) |

```bash
npm start          # Expo dev server
npm run android    # / ios / web
npm run typecheck  # tsc --noEmit
npm run test:ci    # jest sin watch  (npm test abre watch mode)
npm run lint       # expo lint
```

Alias de imports: **`@/*` → raíz del repo** (definido en `tsconfig.json`).

---

## 2. Arquitectura en una pantalla

```
app/index.tsx  ← entry de expo-router; monta providers + navegadores
  └─ GestureHandlerRootView   (necesario para el swipe entre días)
     └─ SafeAreaProvider
        └─ SQLiteProvider
           └─ ThemeProvider     (claro/oscuro, persistido en AsyncStorage)
              └─ GlobalProvider (datos del dominio: user, day, tasks, dayNotes)
                 └─ StatesProvider (flags de UI: modales abiertos, loading)
                    └─ AppBootstrap  ← abre la BD y carga el usuario
                       └─ Stack: [ Home(Tabs), Settings ]
                                  └─ Tabs: Timeline | Map | Gallery | Favorites

  containers/  → bloques con lógica y estado propio
  components/  → piezas de presentación reutilizables
  db/          → única capa que habla con SQLite
  Utils/       → funciones puras (fechas, agrupaciones)
```

**Regla de dependencias:** la UI nunca abre la base de datos.
Siempre pasa por `db/*`, que devuelve un `DbResult` y **nunca lanza excepciones**.

---

## 3. Flujo de datos (el patrón que se repite en todo el proyecto)

1. `GlobalProvider.day` guarda el día seleccionado como string **ISO `YYYY-MM-DD`**.
2. Al cambiar `day`, la pantalla hace fetch (`getTasksByDate` / `getNotesByDate`).
3. El resultado se guarda en `tasks` / `dayNotes` del `GlobalProvider`.
4. Editar/crear/borrar → escribe en SQLite → **re-lee el día** → actualiza el contexto.
5. Los toggles (estado de tarea, favorito) son **optimistas** y hacen *rollback* si la escritura falla.

---

## 4. Índice de archivos

### `db/` — acceso a datos (empieza aquí para cualquier tema de persistencia)

| Archivo | Contenido |
|---|---|
| `client.ts` | **Conexión única compartida** (`getDb`), `DbResult`, y los envoltorios `runQuery` (lecturas) y `runWrite` (escrituras). Todo lo demás se apoya aquí. |
| `migrations.ts` | Migraciones de esquema en orden, versionadas con `PRAGMA user_version`. **Añade nuevas al final del array; nunca reordenes ni edites las ya publicadas.** |
| `db.ts` | `loadDatabase()` copia `assets/db/diaryTasks.db` a disco en el primer arranque y aplica el esquema. Contiene el **SQL del esquema y los índices**. |
| `taskDb.ts` | CRUD de tareas + `updateTaskStatus`. |
| `noteDb.ts` | CRUD de notas + `updateFavorite`, `getFavoritesNotes`. |
| `userDb.ts` | Usuario local único. `getUser()` devuelve `{id, name}` tipado. |
| `mapDb.ts` | Agrega tareas y notas por día para la pestaña Map (`getSortedDaysWithNotesAndTasks`). |
| `mediaDb.ts` | Adjuntos: `getMediaForNote(s)`, `addMedia`, `deleteMedia`, `deleteMediaForNote`, `getDayCovers` (calendario), `getGalleryMedia`, `getOnThisDay`. |
| `timelineDb.ts` | `getDayEntries(date)`: tareas + notas de un día mezcladas y ordenadas por `createdAt`. |

### `context/` — estado global

| Archivo | Expone |
|---|---|
| `GlobalProvider.tsx` | `user`, `day`, `tasks`, `dayNotes` + setters. **Datos del dominio.** |
| `StatesProvider.tsx` | `loading`, `dbLoaded`, `settingsOpen`, `createTaskOpen`, `createNoteOpen`, `editTaskOpen`, `editNoteOpen`, `deletingOpen`. **Solo flags de UI.** |
| `ThemeProvider.tsx` | `theme: 'light' \| 'dark'` y `setTheme` (persiste solo en AsyncStorage). |
| `AppBootstrap.tsx` | Abre la BD, aplica migraciones, carga el usuario y maneja el botón atrás. **Va por encima del navegador**: antes esto vivía dentro de Home y solo corría porque era la primera pestaña. |

### `app/` — pantallas

| Archivo | Rol |
|---|---|
| `index.tsx` | Entry point: fuentes, splash, providers, Stack y Tabs. |
| `(tabs)/Timeline/timeline.tsx` | **Pantalla principal.** El día como una sola línea de tiempo: tareas y notas mezcladas por hora. Swipe entre días, captura rápida con cámara, salto a fecha. |
| `(tabs)/Map/map.tsx` | Calendario por año → mes → día, con **miniatura de foto** en los días que la tienen. |
| `(tabs)/Gallery/gallery.tsx` | Rejilla de medios por mes, filtros y «hace un año». |
| `(tabs)/Favorites/favorites.tsx` | Notas marcadas como favoritas (todas las fechas). |
| `screens/settings/settings.tsx` | Nombre de usuario y selector de tema. |

> El directorio `(tabs)` es una convención de nombre heredada: **la navegación NO usa el file-based routing de expo-router**, se declara a mano en `app/index.tsx`.

### `containers/` — bloques con lógica

`createTask/createTask.tsx` · `editTask/editTask.tsx` · `editNote/createNote.tsx` (el compositor; lo monta el timeline) · `editNote/editNote.tsx`.

### `components/` — presentación

`timeline/timelineEntry.tsx` (una fila del día: tarea o nota) · `media/mediaStrip.tsx` (adjuntar) · `media/mediaPreview.tsx` (portada) · `media/mediaViewer.tsx` (pantalla completa) · `favoriteToggle/favToggle.tsx` · `delete/deletingPopUp.tsx` · `loader/loader.tsx` · `linedPaper/linedPaper.tsx` (papel rayado, **un solo SVG con `<Pattern>`** — no vuelvas a renderizar una línea por nodo) · `emptyState/emptyState.tsx`.

### `Utils/`, `interfaces/`, `constants/`

- `Utils/helpFunctions.ts` — **toda la lógica de fechas** + `processTasks`, `getUniqueDates`, `priorityColorHandler`. Cubierto por tests.
- `Utils/renderIcons.tsx` — `<StatusIcon status={...} />`.
- `Utils/mediaStorage.ts` — **archivos en disco**: `persistMedia`, `toAbsoluteUri`, `deleteMediaFile`.
- `Utils/mediaImport.ts` — cámara/galería → adjunto guardado (`pickMedia`), miniaturas.
- `interfaces/` — `TasksInterfaces.ts`, `NotesInterfaces.ts`, `types.ts` (tipos de navegación).
- `constants/Colors.ts` — paleta `text` / `light` / `dark`. **Única fuente de color.**

---

## 5. Esquema de la base de datos

```sql
User (id, name, createdAt, updatedAt)
Task (id, userId→User, title, description, status, priority, date, createdAt, updatedAt)
Note (id, userId→User, title, message, isFavorite, date, createdAt, updatedAt)
NoteMedia (id, noteId→Note ON DELETE CASCADE, kind, path, thumbPath,
           width, height, durationMs, orderIndex, createdAt)
TaskTemplate (id, userId→User, title, description, ...)   -- sin usar todavía
```

Índices: `Task(date)`, `Note(date)`, `Note(isFavorite)`.

- `status`: `'ToDo' | 'Completed'` · `priority`: `'Low' | 'Medium' | 'High'` · `isFavorite`: `0 | 1`.
- `date` es **TEXT en formato ISO `YYYY-MM-DD`**. Ordena alfabéticamente =
  cronológicamente, así que `ORDER BY date` y `BETWEEN` funcionan en SQL.
- Las filas escritas por versiones antiguas usaban `DD-MM-YYYY`; la migración 1
  de `db/migrations.ts` las convierte en el primer arranque.

---

## 6. Convenciones

- **Temas:** cada archivo con estilos define `createStyles(theme: 'light' | 'dark')` y lo llama con el `theme` del contexto. No uses `StyleSheet.create` estático si el componente cambia de color.
- **Resultados de BD:** `DbResult<T> = { success, data?, message?, error? }`. Comprueba siempre `result.success` y usa `result.data ?? []`.
- **Errores:** `db/` registra con `console.error` y devuelve `success: false`; la UI decide si muestra `Alert`.
- **Fechas:** nunca formatees a mano ni construyas la cadena concatenando. Usa
  `formatDate`, `parseDate`, `addDays`, `getNextDay`, `getBackDay` de
  `Utils/helpFunctions.ts`, y cuando ya tengas la fecha de una fila, pásala tal cual.
- **Cambios de esquema o de datos:** van en `db/migrations.ts`, no en `db.ts`.

---

## 7. Trampas conocidas (lee esto antes de tocar nada)

1. **`id` está tipado como `string` pero en runtime SQLite devuelve `number`.**
   Por eso `findTaskById` / `findNoteById` comparan con `String(a) === String(b)`.
   Si comparas ids de orígenes distintos, normaliza antes.
2. **`(tabs)` no es routing de expo-router.** Añadir un archivo ahí no crea una pestaña;
   hay que registrarla en `app/index.tsx`.
3. **Hay dos conexiones SQLite abiertas**: la de `SQLiteProvider` (`app/index.tsx`, actualmente
   sin uso directo) y la de `db/client.ts` que usan todos los repositorios. Usa siempre `getDb()`.
4. **`Task.userId` y `Note.userId` nunca se rellenan** — existe un solo usuario local.
   La FK está declarada pero se inserta `NULL`.
5. **`TaskTemplate` y `getAllTasks` no se usan todavía.** Son puntos de extensión, no código muerto accidental.
6. `useFocusEffect` cierra los modales al cambiar de pestaña; no dependas de que sigan abiertos.
7. **Las cabeceras usan `useSafeAreaInsets()`**, no alturas fijas. Si pones un
   `height` fijo en una cabecera, vuelves a meter el título bajo el notch.
8. **Medios — las tres reglas que no puedes saltarte:**
   - La URI del picker apunta a **caché** y el sistema la purga. Copia siempre
     con `persistMedia()` antes de guardar nada en la BD.
   - En `NoteMedia.path` se guarda la ruta **relativa** a `documentDirectory`.
     Nunca una URI absoluta: en iOS el contenedor cambia de UUID al actualizar
     la app. Resuelve al pintar con `toAbsoluteUri()`.
   - `ON DELETE CASCADE` borra **filas, no archivos**. Llama a
     `deleteMediaForNote()` *antes* de borrar la nota, o los ficheros se quedan
     ocupando espacio para siempre.
9. Las tarjetas y el calendario pintan **`thumbPath`**, nunca `path`: decodificar
   el original en una miniatura agota la memoria.
10. **El orden del timeline sale de `createdAt`**, que SQLite guarda en UTC. La hora
    se convierte con `strftime('%H:%M', createdAt, 'localtime')` en SQL, no en JS.
11. El swipe entre días necesita `GestureHandlerRootView` en `app/index.tsx`.
    Si lo quitas, el gesto deja de responder sin dar ningún error.

---

## 8. Dónde tocar según la tarea

| Quiero... | Voy a... |
|---|---|
| Cambiar una consulta o el esquema | `db/` (esquema en `db/db.ts`) |
| Añadir un campo a tarea/nota | `interfaces/` → `db/` → formularios en `containers/` |
| Cambiar colores o tema | `constants/Colors.ts` y el `createStyles` del componente |
| Tocar lógica de fechas | `Utils/helpFunctions.ts` (+ tests en `Utils/__tests__/`) |
| Añadir una pestaña | `app/index.tsx` y `interfaces/types.ts` |
| Cambiar qué se ve en el día | `db/timelineDb.ts` + `components/timeline/timelineEntry.tsx` |
| Tocar la galería o «hace un año» | `db/mediaDb.ts` + `app/(tabs)/Gallery/gallery.tsx` |
| Cambiar qué se ve en el calendario | `db/mapDb.ts` + `app/(tabs)/Map/map.tsx` |
