# Plan: Eliminar juego "Atrapa los corazones"

## Estado actual
- El juego "catch" (Atrapa los corazones) está presente en el código
- El juego "flash-sequence" (Secuencia relámpago) está presente y debe mantenerse
- No hay rastro del juego de Simon (ya fue eliminado)

## Cambios necesarios

### 1. Eliminar del array `challenges` (script.js)
**Ubicación:** Líneas 55-60
```javascript
{
    type: "catch",
    question: "Atrapa los corazones dorados y evita los rojos",
    targetScore: 20,
    timeLimit: 25
},
```
**Acción:** Eliminar este objeto completo del array

### 2. Eliminar referencia en función `loadChallenge` (script.js)
**Ubicación:** Líneas 158-159
```javascript
} else if (challenge.type === "catch") {
    renderCatchChallenge(challenge, content);
```
**Acción:** Eliminar estas dos líneas

### 3. Eliminar función `renderCatchChallenge` (script.js)
**Ubicación:** Líneas 335-421
**Acción:** Eliminar la función completa (87 líneas)

### 4. Eliminar estilos CSS del juego catch (style.css)
**Ubicación:** Buscar sección "CATCH GAME"
**Acción:** Eliminar todos los estilos relacionados:
- `.catch-info`
- `.catch-timer`
- `.catch-score`
- `.catch-area`
- `.catch-heart`
- `.catch-heart.gold`
- `.catch-heart.red`
- `.catch-heart.clicked`
- `@keyframes pulse`

### 5. Actualizar contador de desafíos (index.html)
**Ubicación:** Línea con `totalChallenges`
**Acción:** Cambiar de 11 a 10 (ya que eliminamos un desafío)

## Resultado final
Después de los cambios, el juego tendrá 10 desafíos:
1. Texto (Paco) - Colegio de Tania
2. Drag - Ordenar películas
3. Texto (Tania) - Comida que odia
4. Memory - Parejas de familiares (35s)
5. Texto - Siglas FBA
6. Texto (Tania) - Manía de Paco
7. Flash-sequence - Secuencia de colores (40s)
8. Reaction - Películas años 90
9. Texto - Año Amazon
10. Cipher - Descifrar mensaje

## Verificación
- No debe haber referencias a "catch" en el código
- El juego "flash-sequence" debe funcionar correctamente
- El contador de desafíos debe mostrar 10
- No debe haber estilos CSS del juego catch
