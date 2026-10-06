# Wyrdane Narrative — Contexte projet pour IA

> **Document de continuité destiné aux futures conversations avec une IA.**
> Ce fichier décrit l'état actuel du projet, les décisions d'architecture, les conventions et les données déjà établies.
> Il doit être lu avant toute modification importante du projet.

---

# 1. Présentation du projet

**Wyrdane Narrative** est un jeu narratif se déroulant dans l'univers de **Wyrdane**.

Le joueur incarne **Arven Veyr**, un marchand humain ordinaire de 35 ans vivant à Valecendre, dans le royaume d'Aldrenia.

Le jeu commence en **0 AW**, le jour de la première vague de Wyrdane.

Le début du jeu doit volontairement ressembler à une journée normale.

Arven n'est :

* ni un héros choisi ;
* ni un guerrier exceptionnel ;
* ni une figure politique ;
* ni quelqu'un ayant connaissance à l'avance de Wyrdane.

C'est simplement un marchand qui va se retrouver pris dans un événement qui dépasse complètement son quotidien.

## Principe narratif

Le joueur fait des choix qui peuvent modifier :

* les relations avec les personnages ;
* les événements ;
* certaines scènes ;
* les informations découvertes ;
* les possibilités futures ;
* le contexte dans lequel certains événements sont vécus.

Cependant, **la première vague de Wyrdane aura lieu quoi qu'il arrive**.

Les choix du joueur peuvent modifier le déroulement et le contexte, mais pas empêcher l'existence de cet événement majeur.

---

# 2. Technologies

Stack actuelle :

* React
* TypeScript
* Node.js
* Fastify
* MySQL
* Drizzle ORM
* Drizzle Kit
* Vite
* Vitest
* Zustand
* React Router
* TanStack Query
* Zod
* Turborepo

Le projet utilise un **monorepo npm workspaces**.

---

# 3. Repository

Projet local :

```text
E:\wyrdane-narrative
```

GitHub :

```text
git@github.com:Nicolas82200/Wyrdane-narrative.git
```

Branche principale :

```text
main
```

---

# 4. Architecture actuelle

Structure générale :

```text
wyrdane-narrative/
│
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
│   ├── lieux/
│   └── relations/
│
├── docs/
│
├── package.json
├── package-lock.json
├── turbo.json
└── .gitignore
```

Les packages existent comme architecture prévue pour le projet, mais certains ne sont pas encore développés.

---

# 5. Convention importante : français / anglais

Une convention fondamentale a été décidée.

## Les clés techniques sont en anglais

Exemple :

```json
{
  "slug": "arven-veyr",
  "name": "Arven Veyr",
  "age": 35,
  "race": "Humain",
  "kingdom": "Aldrenia",
  "occupation": "Marchand",
  "location": "valecendre",
  "description": "Marchand originaire de Valecendre."
}
```

Les propriétés JSON restent donc en anglais :

```text
slug
name
age
race
kingdom
occupation
location
description
```

## Les données de lore sont en français

Les valeurs destinées au contenu du jeu sont actuellement en français :

```text
"race": "Humain"
"occupation": "Marchand"
"description": "..."
```

Le code et les structures techniques restent en anglais.

Cette convention doit être respectée pour les futurs JSON.

---

# 6. Philosophie des données

Le projet utilise deux couches différentes.

## JSON = source de données/lore

Les fichiers JSON doivent contenir les données statiques du monde :

```text
personnages
lieux
relations
factions
objets
événements
etc.
```

Ils sont versionnés avec Git.

## MySQL = base de données du serveur

MySQL sert à :

* stocker les données ;
* effectuer des recherches ;
* gérer les relations ;
* préparer les données nécessaires au serveur ;
* gérer les données dynamiques des sauvegardes.

Le `seed` doit progressivement devenir un **importeur des JSON vers MySQL**, et non contenir directement tout le lore.

---

# 7. Structure JSON prévue

La structure actuelle est :

```text
data/
├── personnages/
├── lieux/
└── relations/
```

À terme, elle pourra évoluer vers :

```text
data/
├── personnages/
├── lieux/
├── relations/
├── factions/
├── objets/
├── evenements/
├── chapitres/
└── scenes/
```

Ne pas créer toutes ces catégories tant qu'elles ne sont pas nécessaires.

---

# 8. Base de données MySQL

Base :

```text
wyrdane_narrative
```

Charset :

```text
utf8mb4
```

Collation :

```text
utf8mb4_unicode_ci
```

La connexion est définie dans :

```text
apps/server/.env
```

Exemple :

```env
DATABASE_URL=mysql://root:TON_MOT_DE_PASSE@localhost:3306/wyrdane_narrative
```

Ne jamais mettre le mot de passe dans Git.

---

# 9. Schéma actuel

## Table `locations`

Fichier :

```text
apps/server/src/db/schema/locations.ts
```

Structure :

```text
id
slug
name
type
kingdom
description
created_at
updated_at
```

En Drizzle :

```ts
export const locations = mysqlTable("locations", {
  id: int("id").autoincrement().primaryKey(),

  slug: varchar("slug", {
    length: 100
  }).notNull().unique(),

  name: varchar("name", {
    length: 100
  }).notNull(),

  type: varchar("type", {
    length: 50
  }).notNull(),

  kingdom: varchar("kingdom", {
    length: 100
  }),

  description: text("description"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow()
    .notNull()
});
```

---

# 10. Table `characters`

Fichier :

```text
apps/server/src/db/schema/characters.ts
```

Structure :

```text
id
slug
name
age
race
kingdom
occupation
location_id
description
created_at
updated_at
```

`location_id` est une clé étrangère vers :

```text
locations.id
```

---

# 11. Table `character_relationships`

Fichier :

```text
apps/server/src/db/schema/characterRelationships.ts
```

Structure :

```text
id
character_id
related_character_id
type
description
created_at
updated_at
```

Les relations sont actuellement **directionnelles**.

Pour une relation familiale, on prévoit généralement les deux directions.

Exemple :

```text
Arven → Elira = spouse
Elira → Arven = spouse
```

ou :

```text
Arven → Nolen = parent
Nolen → Arven = child
```

---

# 12. Migrations Drizzle

Dossier :

```text
apps/server/drizzle/
```

Migrations actuelles :

```text
0000_crazy_gunslinger.sql
0001_medical_tinkerer.sql
0002_happy_wildside.sql
```

Le dossier :

```text
drizzle/meta/
```

est ignoré par Git.

Les fichiers de migration SQL doivent être commités.

---

# 13. Seed actuel

Le seed se trouve ici :

```text
apps/server/src/db/seed.ts
```

Il contient actuellement les données de :

* Valecendre ;
* Caldrath ;
* Arven ;
* famille Veyr ;
* famille Solmar.

Un fichier de relations existe également :

```text
apps/server/src/db/seed-relationships.ts
```

Les types de seed sont dans :

```text
apps/server/src/db/seed-types.ts
```

## Important

Le projet est actuellement en transition :

```text
ancien système :
seed.ts contient directement les données

nouveau système :
JSON → validation/import → MySQL
```

La prochaine étape est de transformer le seed en importeur des fichiers JSON.

---

# 14. Personnage principal : Arven Veyr

```text
Nom : Arven Veyr
Âge : 35 ans
Race : Humain
Royaume : Aldrenia
Profession : Marchand
Lieu : Valecendre
```

Description :

Arven est un marchand pragmatique et travailleur.

Il est :

* patient ;
* observateur ;
* sociable ;
* prudent avec les inconnus ;
* loyal ;
* bon négociateur ;
* peu intéressé par la politique ;
* peu attiré par la violence.

Il possède une petite activité commerciale à Valecendre.

Il voyage également pour le commerce, notamment vers Caldrath et d'autres régions.

Il est financièrement à l'aise sans être riche.

Il possède :

* une maison ;
* un cheval ;
* une charrette ;
* un stock de marchandises.

---

# 15. Famille d'Arven

## Elira Veyr

```text
Âge : 33
Race : Humaine
Royaume : Aldrenia
Profession : Artisane
Lieu : Valecendre
```

Épouse d'Arven.

Issue d'une famille d'artisans.

Elle aide notamment à gérer les comptes du foyer.

Elle est prudente et fiable.

---

## Nolen Veyr

```text
Âge : 9
Race : Humain
Royaume : Aldrenia
Lieu : Valecendre
```

Fils d'Arven et Elira.

Curieux et énergique.

Il admire son père et aime l'accompagner.

---

## Mara Veyr

```text
Âge : 62
Race : Humaine
Royaume : Aldrenia
Lieu : Valecendre
```

Mère d'Arven.

Veuve.

Traditionnelle et directe.

Elle est restée proche d'Arven et de sa famille.

---

# 16. Famille Veyr à Caldrath

## Edric Veyr

```text
Âge : 58
Race : Humain
Royaume : Aldrenia
Profession : Marchand
Lieu : Caldrath
```

Oncle paternel d'Arven.

Possède un étal permanent sur le marché de Caldrath.

Il a enseigné à Arven une grande partie de ce qu'il sait du commerce.

---

## Maela Veyr

```text
Âge : 55
Race : Humaine
Royaume : Aldrenia
Profession : Commerçante
Lieu : Caldrath
```

Épouse d'Edric.

Originaire de Caldrath.

Participe à la gestion des comptes et aux achats de la famille.

---

## Tomas Veyr

```text
Âge : 29
Race : Humain
Royaume : Aldrenia
Profession : Marchand
Lieu : Caldrath
```

Cousin d'Arven.

Fils d'Edric et Maela.

Travaille avec son père.

Ambitieux et désireux de développer le commerce familial.

---

## Lysa Veyr

```text
Âge : 24
Race : Humaine
Royaume : Aldrenia
Profession : Artisane
Lieu : Caldrath
```

Cousine d'Arven.

Fille d'Edric et Maela.

Travaille avec sa famille.

S'intéresse particulièrement aux tissus et à l'artisanat.

---

# 17. Famille Solmar

## Taren Solmar

```text
Âge : 31
Race : Humain
Royaume : Aldrenia
Profession : Forgeron
Lieu : Valecendre
```

Frère d'Elira.

Beau-frère d'Arven.

Forgeron.

Entretient une relation étroite avec Arven.

---

## Oren Solmar

```text
Âge : 61
Race : Humain
Royaume : Aldrenia
Profession : Forgeron
Lieu : Valecendre
```

Père d'Elira et Taren.

Forgeron établi à Valecendre.

---

## Mira Solmar

```text
Âge : 59
Race : Humaine
Royaume : Aldrenia
Lieu : Valecendre
```

Mère d'Elira et Taren.

Participe à la vie de la famille et à la gestion de la forge.

---

# 18. Famille éloignée

## Coren Veyr

```text
Âge : 39
Race : Humain
Royaume : Aldrenia
Profession : Charpentier
Lieu : Valecendre
```

Cousin éloigné d'Arven.

Charpentier de métier.

---

## Hessa Veyr

```text
Âge : 67
Race : Humaine
Royaume : Aldrenia
Lieu : Valecendre
```

Tante éloignée d'Arven.

Connaît de nombreuses histoires et traditions anciennes de la famille Veyr.

---

# 19. Amis et connaissances

## Daren Voss

```text
Âge : 20
Race : Humain
Royaume : Aldrenia
Profession : Apprenti marchand
Lieu : Valecendre
```

Ami et apprenti marchand.

Il considère Arven comme un mentor.

---

## Neria Sol

```text
Âge : 28
Race : Humaine
Royaume : Aldrenia
Profession : Aubergiste
Lieu : Valecendre
```

Aubergiste de **La Couronne Fendue**.

Amie proche d'Arven.

Elle est bien informée sur ce qui se passe dans le village et ses environs.

---

## Joren Hale

```text
Âge : 37
Race : Humain
Royaume : Aldrenia
Profession : Agriculteur et éleveur
Lieu : Valecendre
```

Ami d'enfance d'Arven.

Travaille comme agriculteur et éleveur.

---

## Belan Rusk

```text
Âge : 34
Race : Humain
Royaume : Aldrenia
Profession : Conducteur de charrette
Lieu : Valecendre
```

Ami et contact commercial d'Arven.

Connaît bien les routes de la région.

---

# 20. Rival

## Garran Holt

```text
Âge : 46
Race : Humain
Royaume : Aldrenia
Profession : Marchand
Lieu : Valecendre
```

Principal concurrent commercial d'Arven à Valecendre.

Plus prospère qu'Arven.

Malgré leur rivalité, ils peuvent coopérer lorsque leurs intérêts convergent.

---

# 21. Figures importantes de Valecendre

## Ser Aldren Marr

```text
Âge : 41
Race : Humain
Royaume : Aldrenia
Profession : Garde
Lieu : Valecendre
```

Responsable de la garde locale.

Veille à la sécurité du village.

---

## Père Oren

```text
Âge : 59
Race : Humain
Royaume : Aldrenia
Profession : Prêtre d'Aldrene
Lieu : Valecendre
```

Prêtre d'Aldrene.

S'occupe de la communauté religieuse locale.

### Attention

Il existe deux personnages différents portant le prénom Oren :

```text
Oren Solmar = forgeron, 61 ans
Père Oren = prêtre, 59 ans
```

Leurs slugs doivent rester différents :

```text
oren-solmar
pere-oren
```

---

## Elda Renn

```text
Âge : 52
Race : Humaine
Royaume : Aldrenia
Profession : Herboriste
Lieu : Valecendre
```

Herboriste du village.

Connaît les plantes médicinales locales.

---

## Bram Kell

```text
Âge : 48
Race : Humain
Royaume : Aldrenia
Profession : Meunier
Lieu : Valecendre
```

Meunier du village.

Exploite le moulin local.

---

## Sera Dain

```text
Âge : 42
Race : Humaine
Royaume : Aldrenia
Profession : Boulangère
Lieu : Valecendre
```

Boulangère du village.

---

## Halric Dorn

```text
Âge : 57
Race : Humain
Royaume : Aldrenia
Profession : Maire
Lieu : Valecendre
```

Maire et responsable civil de Valecendre.

---

## Mira Fen

```text
Âge : 64
Race : Humaine
Royaume : Aldrenia
Profession : Sage-femme
Lieu : Valecendre
```

Sage-femme du village.

---

## Toren Vale

```text
Âge : 44
Race : Humain
Royaume : Aldrenia
Profession : Maître d'écurie
Lieu : Valecendre
```

Propriétaire des écuries de Valecendre.

---

# 22. Lieu : Valecendre

```text
Slug : valecendre
Nom : Valecendre
Type : Village
Royaume : Aldrenia
Population : environ 400 habitants
```

Valecendre est le village où vivent Arven et sa famille.

Le village comprend notamment :

* un marché ;
* une auberge ;
* une forge ;
* une boulangerie ;
* un moulin ;
* une herboristerie ;
* des écuries ;
* un temple d'Aldrene ;
* des habitations ;
* des exploitations agricoles.

Valecendre est le principal point de départ du jeu.

---

# 23. Lieu : Caldrath

```text
Slug : caldrath
Nom : Caldrath
Type : Ville
Royaume : Aldrenia
Population : non définie
```

Caldrath est la capitale d'Aldrenia.

C'est un centre politique et commercial majeur du royaume.

Edric Veyr y possède un étal permanent sur le marché.

Arven connaît Caldrath grâce à ses voyages commerciaux.

La distance entre Valecendre et Caldrath est d'environ **8 heures à cheval**.

---

# 24. Religion

Le protagoniste est lié à la religion d'**Aldrene**.

Dans **Aldrenia**, la religion officielle/populaire autour du protagoniste est celle d'Aldrene.

Il ne faut pas ajouter arbitrairement de temple ou de pratique de Mydare à Aldrenia.

---

# 25. Lore de Wyrdane pertinent pour le jeu

Le jeu commence en :

```text
0 AW
```

AW signifie :

```text
Après Wyrdane
```

La première vague de Wyrdane est donc le point de départ de cette chronologie.

Wyrdane est un événement mystérieux et incompréhensible.

Sa cause n'est actuellement pas connue.

Il arrive sous forme de vagues dont le rythme n'est pas fixe.

---

# 26. Première vague

La première vague apporte notamment :

* des démons ;
* des morts-vivants ;
* des abominations.

Les humains ne comprennent pas immédiatement ce qui se passe.

Les démons viennent d'un autre monde.

Une cité démoniaque apparaît près de Skeldara.

Les premiers démons mettent environ **un à deux jours** après la vague pour atteindre les zones humaines.

Les morts-vivants ne se répandent pas instantanément.

Leur expansion se produit progressivement sur plusieurs mois.

---

# 27. Position du joueur

Le joueur commence avant que la catastrophe ne devienne évidente.

Il doit avoir l'impression de vivre :

```text
une journée normale
        ↓
des événements étranges
        ↓
la découverte de Wyrdane
        ↓
la catastrophe
```

Le début doit donc éviter de présenter immédiatement Wyrdane comme une catastrophe connue.

---

# 28. Système de choix

Le jeu doit être conçu pour permettre des choix narratifs.

Exemples de conséquences possibles :

```text
Choix
 ↓
relation modifiée
 ↓
drapeau narratif
 ↓
scène différente
 ↓
conséquence future
```

Les choix doivent pouvoir modifier le contexte sans nécessairement modifier les événements historiques majeurs.

---

# 29. Données statiques vs données de sauvegarde

Principe architectural important.

## Données statiques

JSON / lore :

```text
Personnages
Lieux
Relations de base
Histoire
Scènes
Événements
```

## Données dynamiques

MySQL / sauvegarde :

```text
Relations avec le joueur
Choix effectués
Événements déclenchés
Inventaire
Variables
Flags
Progression
```

Il ne faut pas modifier les données canonique d'un personnage à chaque choix du joueur.

Exemple :

```text
character:
    Arven aime Neria
```

est du lore.

Mais :

```text
save:
    relationship_arven_neria = 72
```

est une donnée de sauvegarde.

---

# 30. Tables prévues pour les sauvegardes

À terme :

```text
characters
character_relationships
locations

save_games
save_relationships
save_inventory
save_flags
save_variables
```

Ces tables ne sont pas toutes encore créées.

---

# 31. Commandes importantes

Depuis la racine :

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run typecheck
```

```bash
npm run test
```

```bash
npm run lint
```

Pour la BDD :

```bash
npm run db:generate
```

```bash
npm run db:migrate
```

```bash
npm run db:studio
```

Seed actuel :

```bash
npm run db:seed
```

Relations :

```bash
npm run db:seed:relationships
```

---

# 32. État actuel du projet

## Terminé

* [x] Monorepo
* [x] React / TypeScript
* [x] Client Vite
* [x] Serveur Fastify
* [x] MySQL
* [x] Drizzle ORM
* [x] Drizzle Kit
* [x] Connexion BDD
* [x] Table `locations`
* [x] Table `characters`
* [x] Relation personnage → lieu
* [x] Table `character_relationships`
* [x] Valecendre
* [x] Caldrath
* [x] Arven
* [x] Famille d'Arven
* [x] Famille Solmar
* [x] Plusieurs habitants de Valecendre
* [x] Relations familiales principales
* [x] GitHub
* [x] Convention JSON définie

## En cours

* [ ] Migrer les données du seed vers des JSON
* [ ] Créer tous les JSON personnages
* [ ] Créer tous les JSON lieux
* [ ] Créer les JSON relations
* [ ] Créer un importeur JSON → MySQL
* [ ] Supprimer progressivement les données hardcodées du seed

---

# 33. Prochaine étape recommandée

La prochaine tâche doit être :

```text
1. Créer les dossiers data/
2. Créer les JSON des personnages
3. Créer les JSON des lieux
4. Créer les JSON des relations
5. Créer un validateur Zod
6. Créer l'importeur JSON → MySQL
7. Tester le seed complet
8. Supprimer les anciennes données hardcodées du seed
```

Ne pas commencer immédiatement le moteur narratif avant que cette base de données de lore soit suffisamment propre.

---

# 34. Règles pour les futures IA

Une IA reprenant ce projet doit :

1. **Lire ce README avant de proposer une modification architecturale.**
2. Ne pas inventer de lore présenté comme canon.
3. Demander ou signaler lorsqu'une information n'est pas encore définie.
4. Respecter la chronologie actuelle : **0 AW au début du jeu**.
5. Ne pas introduire immédiatement les elfes ou les nains comme éléments connus du début de l'histoire.
6. Respecter le fait que la première vague de Wyrdane est inévitable.
7. Garder les clés techniques des JSON en anglais.
8. Garder actuellement les valeurs de lore en français.
9. Ne pas mettre toutes les données dans `seed.ts`.
10. Utiliser les JSON comme source de données statiques.
11. Utiliser MySQL pour le stockage côté serveur.
12. Séparer les données canoniques des données propres à une sauvegarde.
13. Ne pas créer une migration Drizzle lorsqu'une simple modification de données suffit.
14. Ne pas modifier le lore existant sans validation explicite.

---

# 35. Convention JSON cible

Exemple personnage :

```json
{
  "slug": "arven-veyr",
  "name": "Arven Veyr",
  "age": 35,
  "race": "Humain",
  "kingdom": "Aldrenia",
  "occupation": "Marchand",
  "location": "valecendre",
  "description": "Marchand originaire de Valecendre."
}
```

Exemple lieu :

```json
{
  "slug": "valecendre",
  "name": "Valecendre",
  "type": "Village",
  "kingdom": "Aldrenia",
  "population": 400,
  "description": "Petit village d'Aldrenia où vit Arven Veyr avec sa famille."
}
```

Exemple relation :

```json
{
  "character": "arven-veyr",
  "relatedCharacter": "elira-veyr",
  "type": "épouse",
  "description": "Elira est l'épouse d'Arven."
}
```

---

# 36. Principe général

Le projet doit rester suffisamment modulaire pour que l'univers Wyrdane puisse continuer à évoluer pendant plusieurs années.

Le but n'est pas seulement de créer une histoire linéaire, mais une architecture permettant d'ajouter progressivement :

```text
nouveaux personnages
        ↓
nouveaux lieux
        ↓
nouvelles relations
        ↓
nouvelles scènes
        ↓
nouveaux événements
        ↓
nouveaux chapitres
        ↓
extensions narratives
```

sans devoir réécrire le cœur du jeu.
