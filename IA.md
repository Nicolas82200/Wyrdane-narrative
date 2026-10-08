# Wyrdane Narrative — État du projet

## 1. Vue d'ensemble

**Projet :** Wyrdane Narrative  
**Chemin :** `E:\wyrdane-narrative`  
**Git remote :** `git@github.com:Nicolas82200/Wyrdane-narrative.git`

Wyrdane Narrative est un jeu narratif se déroulant dans l'univers de Wyrdane.

Le joueur incarne **Arven Veyr**, un marchand humain de 35 ans.

Le jeu commence le jour de la première vague de Wyrdane, en **0 AW**.

Arven n'est pas un héros choisi ni un personnage exceptionnel. C'est un marchand ordinaire qui se retrouve pris dans un événement catastrophique.

Les choix du joueur influencent notamment :

- les relations avec les personnages ;
- les flags narratifs ;
- les variables ;
- les scènes accessibles ;
- le contexte dans lequel Arven traverse les événements.

La première vague de Wyrdane se produira quoi qu'il arrive. Les choix précédents modifient le contexte et la situation d'Arven, mais ne peuvent pas empêcher l'événement lui-même.

---

# 2. Technologies

Le projet utilise :

- React
- TypeScript
- Node.js
- MySQL
- Drizzle ORM
- Fastify
- Zod
- Vitest
- Turbo
- npm workspaces

Le projet est organisé en monorepo.

### Utilisation de MySQL

MySQL contient principalement les données statiques :

- personnages ;
- lieux ;
- relations.

### Utilisation des JSON

Les scènes narratives sont actuellement stockées en JSON.

Les scènes ne sont **pas migrées vers MySQL pour le moment**.

L'objectif est de garder le contenu narratif facilement modifiable sans devoir modifier le code du moteur.

---

# 3. Structure du projet

```text
wyrdane-narrative/
├── apps/
│   ├── client/
│   └── server/
│
├── packages/
│   ├── shared/
│   ├── lore/
│   ├── narrative-engine/
│   ├── content/
│   ├── save-system/
│   └── config/
│
├── data/
│   ├── personnages/
│   ├── locations/
│   ├── relations/
│   └── scenes/
│
├── docs/
├── scripts/
├── package.json
├── package-lock.json
└── turbo.json
4. Lore de départ
Wyrdane

Wyrdane est un événement mystérieux et chaotique dont la véritable nature et l'origine sont inconnues.

Il arrive sous forme de vagues.

La première vague est :

0 AW

Le jeu commence pendant cette première vague.

La première vague fait apparaître :

des démons ;
des morts-vivants ;
des abominations.

Les elfes et les nains ne sont pas connus comme présents lors de la première vague.

Une possibilité prévue pour une extension future est que certains elfes aient également été transportés mais se soient cachés dans les forêts après leur arrivée.

5. Monde actuel
Aldrenia

Aldrenia est le royaume dominant.

Sa capitale est :

Caldrath

Dans Aldrenia, la religion principale et officielle est liée à Aldrene.

Il n'y a actuellement pas de temple ou de pratique de Mydare prévue dans Aldrenia.

Valecendre

Valecendre est un village d'Aldrenia.

C'est le village où vit Arven.

Arven y possède un étal et une maison avec sa famille.

Thelmere

Thelmere est un royaume maritime.

Arven revient de Thelmere au début du jeu après plusieurs jours de voyage commercial.

Le système détaillé de temps de voyage n'est pas implémenté pour le moment.

6. Personnage principal
Arven Veyr
Âge : 35 ans
Race : Humain
Métier : Marchand
Royaume : Aldrenia
Lieu : Valecendre

Arven est un marchand ordinaire.

Il revient de Thelmere avec des marchandises et doit décider où les vendre.

Son histoire commence avant que la situation mondiale ne devienne catastrophique.

7. Personnages principaux

Les personnages actuellement définis comprennent :

Arven Veyr
Elira Veyr
Nolen Veyr
Mara Veyr
Edric Veyr
Maela Veyr
Tomas Veyr
Lysa Veyr
Coren Veyr
Hessa Veyr
Oren Solmar
Mira Solmar
Taren Solmar
Daren Voss
Neria Sol
Joren Hale
Belan Rusk
Garran Holt
Ser Aldren Marr
Père Oren
Elda Renn
Bram Kell
Sera Dain
Halric Dorn
Mira Fen
Toren Vale

Il existe volontairement deux personnages ayant un prénom Oren :

oren-solmar
pere-oren

Ils doivent rester distincts.

8. Données personnages

Répertoire :

data/personnages/

Fichier source :

data/personnages/_characters.json

Générateur :

scripts/create-characters-json.mjs

Les personnages sont générés depuis le fichier maître vers des fichiers JSON individuels.

Le projet possède actuellement 26 personnages.

9. Données lieux

Répertoire :

data/locations/

Fichier source :

data/locations/_locations.json

Générateur :

scripts/create-locations-json.mjs

Lieux actuellement définis :

Valecendre
Rochebrune
Boisclair
Montfaucon
Varenne
Pont-Rouge
Caldrath
Port-Serein
Brumecôte
Valmer
Valecendre
Type : Village
Royaume : Aldrenia
Population : environ 400

Lieu de vie d'Arven.

Caldrath
Type : Ville
Royaume : Aldrenia
Population : environ 25 000

Capitale d'Aldrenia.

Port-Serein
Type : Ville portuaire
Royaume : Thelmere
Population : inconnue
10. Relations

Répertoire :

data/relations/

Chaque relation est stockée dans un fichier JSON.

Une relation contient :

personnage ;
personnage lié ;
type ;
score ;
hasMet ;
description.

Le score va de :

-100 à +100

Il n'y a actuellement qu'une seule valeur de relation.

Il n'y a pas encore de séparation entre :

relation de base

et :

relation actuelle
Personnage inconnu

Un personnage totalement inconnu n'a pas nécessairement de relation enregistrée.

Lors de la première rencontre :

score = 0
hasMet = true

Un personnage connu mais pas encore rencontré peut avoir :

hasMet = false
11. Organisation des scènes

Les scènes sont organisées par arc narratif, pas par lieu.

Structure actuelle :

data/
└── scenes/
    ├── 00-prologue/
    │   ├── _scenes.json
    │   ├── arven-retour-thelmere.json
    │   ├── arven-valecendre.json
    │   ├── arven-caldrath.json
    │   └── arven-maison.json
    │
    └── 01-journee-ordinaire/
        └── ...

Les futurs arcs prévus :

02-premiers-signes/
03-premiere-vague/
04-apres-la-vague/

Le dossier correspond donc à la progression narrative.

Le champ location correspond au lieu réel de la scène.

Il peut être :

"location": null

pour une scène sur une route ou une zone de transition.

12. Génération des scènes

Les scènes sont écrites dans des fichiers :

_scenes.json

Le générateur parcourt récursivement :

data/scenes/

et crée automatiquement un fichier JSON individuel pour chaque scène.

Le générateur :

scripts/create-scenes-json.mjs

Il :

recherche tous les _scenes.json ;
supprime les anciens fichiers JSON générés ;
génère un fichier par scène ;
conserve les _scenes.json.

Cela permet de modifier facilement le contenu narratif sans avoir à maintenir manuellement tous les fichiers individuels.

13. Première scène

La première scène est :

arven-retour-thelmere

Titre :

Le retour

Arven revient de plusieurs jours passés à Thelmere.

Il possède une charrette contenant ses marchandises.

Il arrive à un moment où il doit décider de la suite de sa journée.

Choix 1 — Retourner à Valecendre

Flag :

arven_returned_to_valecendre

Scène suivante :

arven-valecendre
Choix 2 — Vendre à Caldrath

Arven continue vers Caldrath car les prix y sont meilleurs.

Flag :

arven_chose_caldrath

Scène suivante :

arven-caldrath
Choix 3 — Rentrer chez lui

Arven décide de rentrer directement chez lui pour retrouver Elira et Nolen.

Flag :

arven_went_home

Scène suivante :

arven-maison
14. Scène arven-valecendre

Arven revient à Valecendre.

Choix actuellement prévus :

Installer son étal

Flag :

arven_etal_opened

Scène suivante :

arven-etal
Passer chez Neria

Flag :

arven_visited_neria

Scène suivante :

arven-couronne-fendue
Rentrer chez lui

Flag :

arven_returned_home

Scène suivante :

arven-maison
15. Scène arven-caldrath

Arven décide de continuer vers Caldrath.

Choix actuel :

continuer-caldrath

Flag :

arven_heading_to_caldrath

Scène suivante :

arven-marche-caldrath
16. Scène arven-maison

Arven rentre chez lui et retrouve :

Elira ;
Nolen.

Choix actuels :

Rester avec sa famille

Flag :

arven_spent_time_with_family

Scène suivante :

arven-soiree-famille
Parler avec Elira

Flag :

arven_talked_with_elira

Scène suivante :

arven-conversation-elira
Repartir s'occuper de son étal

Flag :

arven_prioritized_work

Scène suivante :

arven-etal
17. Narrative Engine

Package :

packages/narrative-engine/

Architecture :

JSON
 ↓
SceneLoader
 ↓
Zod
 ↓
SceneEngine
 ↓
GameState
 ↓
React

Le contenu narratif reste séparé de la logique du moteur.

18. Structure actuelle du narrative-engine
packages/narrative-engine/
└── src/
    ├── conditions.ts
    ├── effects.ts
    ├── index.ts
    ├── scene-engine.ts
    ├── scene-loader.ts
    ├── scene-schema.ts
    ├── types.ts
    └── _test/
        └── scene-engine.test.ts
19. Types du moteur

Les types principaux sont :

DialogueLine
ConditionOperator
Condition
EffectOperation
Effect
Choice
Scene
GameState
20. GameState
export interface GameState {
  currentScene: string;
  flags: Record<string, boolean>;
  variables: Record<string, number>;
  relationships: Record<string, number>;
  inventory: string[];
  discoveredLocations: string[];
  completedEvents: string[];
}

État initial :

export function createInitialGameState(
  startingScene: string
): GameState {
  return {
    currentScene: startingScene,
    flags: {},
    variables: {
      money: 0
    },
    relationships: {},
    inventory: [],
    discoveredLocations: [
      "valecendre"
    ],
    completedEvents: []
  };
}
21. Conditions

Un choix peut posséder des conditions.

Types :

flag
variable
relationship

Opérateurs disponibles :

equals
not_equals
greater_than
less_than
greater_or_equal
less_or_equal

Exemple :

{
  "type": "flag",
  "key": "helped_neria",
  "operator": "equals",
  "value": true
}

Toutes les conditions du choix doivent être satisfaites.

22. Effets

Un choix peut modifier le GameState.

Types :

flag
variable
relationship

Opérations :

set
add
subtract

Les relations sont automatiquement limitées à :

-100
100
23. SceneEngine

Le SceneEngine possède actuellement :

getScene()
getAvailableChoices()
choose()
getScene()

Retourne une scène par son ID.

Si elle n'existe pas :

Scène introuvable : <id>
getAvailableChoices()

Retourne uniquement les choix dont les conditions sont satisfaites.

choose()

Lorsqu'un choix est sélectionné :

récupère la scène actuelle ;
récupère le choix ;
vérifie les conditions ;
vérifie que la scène suivante existe ;
clone le GameState ;
applique les effets ;
modifie currentScene ;
retourne le nouvel état.

Le GameState original n'est pas modifié.

24. SceneLoader

Le SceneLoader charge récursivement les scènes JSON.

Il :

parcourt les dossiers ;
recherche les fichiers .json ;
ignore les fichiers commençant par _ ;
parse le JSON ;
valide avec Zod ;
détecte les IDs dupliqués ;
retourne une Map<string, Scene>.
25. Zod

Le package contient un schéma Zod pour :

dialogueLine
condition
effect
choice
scene

Important :

Le type Scene existe uniquement dans :

types.ts

Il ne faut pas créer un deuxième :

export type Scene = ...

dans scene-schema.ts.

Cela avait provoqué une erreur d'export en double dans index.ts.

26. Index du package

Le package exporte actuellement les différents modules via :

export * from "./types.js";
export * from "./conditions.js";
export * from "./effects.js";
export * from "./scene-engine.js";
export * from "./scene-loader.js";
export * from "./scene-schema.js";
27. Tests

Les tests utilisent :

Vitest 5.0.3

Fichier :

packages/narrative-engine/src/_test/scene-engine.test.ts

Tests actuels :

récupère une scène ;
refuse une scène inexistante ;
retourne les choix disponibles ;
change de scène ;
applique les effets ;
ne modifie pas l'ancien GameState.
État actuel
6 tests
6 passed
28. Serveur

Package :

@wyrdane/server

Répertoire :

apps/server/

Technologies :

Fastify ;
Drizzle ;
MySQL ;
Zod ;
TypeScript.

Le typecheck serveur passe actuellement.

Une erreur avait été causée par :

apps/server/src/db/schema/index.ts

qui contenait :

export { sceneSchema } from "./scene-schema.js";

alors qu'aucun fichier scene-schema.ts n'existait dans ce répertoire.

Cette exportation a été supprimée.

Les scènes appartiennent au narrative-engine et ne sont pas des schémas DB.

29. État technique actuel

Tout ce qui suit est terminé :

[✓] Monorepo
[✓] React / TypeScript / Node
[✓] MySQL
[✓] Drizzle
[✓] Personnages JSON
[✓] Lieux JSON
[✓] Relations JSON
[✓] Seed DB
[✓] Structure des scènes
[✓] Générateur des scènes JSON
[✓] Types du narrative-engine
[✓] GameState
[✓] createInitialGameState
[✓] Conditions
[✓] Effets
[✓] SceneEngine
[✓] SceneLoader
[✓] Validation Zod
[✓] Tests Vitest
[✓] Typecheck narrative-engine
[✓] Typecheck serveur
30. Problèmes connus / contenu incomplet

Certaines scènes référencées n'existent pas encore.

Actuellement, les IDs suivants sont utilisés comme nextScene :

arven-etal
arven-couronne-fendue
arven-marche-caldrath
arven-soiree-famille
arven-conversation-elira

Ces scènes doivent encore être créées.

C'est volontaire pour le moment : le prologue est encore en construction.

31. Prochaine étape immédiate

Créer un validateur global des données narratives.

Il devra parcourir :

data/scenes/**/*.json

et vérifier automatiquement :

Scènes
JSON valide ;
schéma Zod valide ;
IDs uniques.
Transitions

Chaque :

"nextScene": "..."

doit pointer vers une scène existante.

Personnages

Chaque personnage présent dans :

"characters": []

doit exister dans :

data/personnages/
Lieux

Chaque :

"location": "..."

doit correspondre à un lieu existant dans :

data/locations/
32. Étapes suivantes après le validateur
[ ] Validateur global des scènes
[ ] Vérification des nextScene
[ ] Vérification des personnages référencés
[ ] Vérification des lieux référencés
[ ] Créer les scènes manquantes du prologue
[ ] Finaliser le premier parcours narratif
[ ] Connecter SceneEngine à React
[ ] Afficher une scène dans le client
[ ] Afficher les dialogues
[ ] Afficher les choix
[ ] Gérer les choix du joueur
[ ] Connecter les flags et variables à l'UI
[ ] Système de sauvegarde
[ ] Persistance du GameState
33. Philosophie d'architecture

Le contenu narratif doit rester séparé du code.

Ajouter une scène doit idéalement nécessiter uniquement :

Modifier / ajouter un JSON
        ↓
Le SceneLoader le charge
        ↓
Le SceneEngine l'utilise

et non :

Ajouter une scène
        ↓
Modifier TypeScript
        ↓
Modifier React
        ↓
Modifier le serveur

Le narrative-engine doit rester générique.

Il ne doit pas contenir directement les détails spécifiques de l'histoire de Wyrdane.

34. Situation Git actuelle

Branche actuelle :

0003-feature/first-scene

Le travail actuel correspond à la mise en place du premier parcours narratif et du moteur permettant de l'exécuter.

35. Consigne pour continuer le développement

La prochaine tâche doit être :

Créer le validateur global des scènes JSON.

Il faut éviter de partir directement sur React avant d'avoir cette validation.

Objectif :

data/
   ↓
validation automatique
   ↓
aucune référence cassée
   ↓
narrative-engine fiable
   ↓
React

Une fois le validateur terminé et fonctionnel, continuer avec les scènes manquantes du prologue puis connecter le moteur au client React.