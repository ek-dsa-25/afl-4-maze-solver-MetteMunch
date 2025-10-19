# Aflevering 4: Maze Solver

## Opgavebeskrivelse

I denne afleveringsopgave skal du tilføje en graf-søgefunktion til at løse
labyrinten og tegne en sti igennem.

## Opgaven

Der er udleveret en skabelon hvor klassen `MazeSolver` allerede er delvist
lavet. Du mangler bare at tilføje selve algoritmen. Vælg selv om du vil
bruge depth-first search (stak) eller breadth-first search (kø) til at udføre
søgningen.

## Delopgave 1: Lav `connectedNeighbors()`

Ved siden af funktionen `unvisitedNeighbors()` bor en funktion `connectedNeighbors()`.

`unvisitedNeighbors()` bliver brugt af `generate()` til at udgrave labyrinten.
Den tjekker et felt i den enkelte celle om `generate()` har besøgt den, og
returnerer de nabo-celler som er ubesøgt af udgraveren.

`connectedNeighbors()` bliver derimod brugt af `MazeSolver` og returnerer også
en liste af celler, men baseret på om der er en væg nord/syd/højre/venstre for
cellen. I tilfælde af at cellen ligger ud til kanten, er svaret selvfølgelig at
der ikke er en nabo i den retning.

Lav funktionen `connectedNeighbors()`.

## Delopgave 2: Lav `findPath()`

Til at finde stien igennem labyrinten er der lavet en funktion `findPath()`.

Den mangler desværre det meste af sin kode. Den skal benytte en søgefunktion
der tjekker grafen af naboceller vha. `connectedNeighbors()`. Der er ikke tale
om en decideret graf-klasse, men blot en abstraktion oven på den eksisterende
labyrint. Man kan sige at grafen benytter en _dense_ repræsentation (matrix)
hvor hver celle i matricen er en celle, og nabo-pilene er defineret vha.
væggene.

Lav `findPath()`

## Delopgave 3: Personliggør tegning af stien

Til at tegne stien findes en funktion `drawPath()` som bliver kaldt af en anden
funktion `drawPathStepwise()`. Den tegner en rød firkant der hvor stien går.

Det kan gøres bedre.

Tegn en pænere sti.

## Tekniske krav

- Lav `connectedNeighbors()` og `findPath()`
- Sørg for, når labyrinten bliver indlæst, at stien beregnes og tegnes

## Filer

- `index.html` - HTML-siden med canvas elementet
- `maze.js` - JavaScript kode med klasserne Cell, Maze og MazeSolver

## Sådan kører du programmet

Åbn `index.html` i en webbrowser for at se maze solveren i aktion.

Reload siden når du laver ændringer. Måske skal du "hard-reloade" (Ctrl + Shift + R)
hvis JavaScript'en ikke genindlæser, fordi den ligger cachet i sin egen fil.
