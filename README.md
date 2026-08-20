## Alimenter l'archive

Signal est pensé comme une archive vivante : le site n'est pas uniquement destiné à documenter nos propres productions. Chacun peut y ajouter des images, objets, projets ou traces qu'il trouve intéressants et qui lui semblent avoir leur place dans la curation Signal.

Cela peut être une production Signal ou le travail d'un artiste avec qui nous collaborons, mais aussi une affiche trouvée dans la rue, un fanzine, une carte de visite, une pochette, une photographie, une édition, un flyer, un objet graphique, une archive musicale, etc.

L'idée est de continuer progressivement à constituer une archive collective plutôt que de chercher à tout remplir immédiatement.

### Ajouter une image

Les images de l'archive sont placées dans :

`assets/archive/`

Après avoir ajouté de nouvelles images, exécuter depuis la racine du projet :

`python3 scripts/generate_archive.py`

Le script détecte les nouvelles images et crée automatiquement les entrées correspondantes dans :

`data/archive.json`

Attention : le script crée seulement la structure de l'entrée. Il faut ensuite ouvrir `data/archive.json` et compléter manuellement les informations.

Selon le contenu, renseigner autant que possible :

- le type de contenu ;
- l'artiste / auteur·ice ;
- le titre ;
- la date ;
- le crédit ;
- le lien éventuel ;
- le comportement au clic ;
- le `span`.

`span: 1` correspond à une image normale dans la grille.

`span: 2` permet à une image de prendre davantage de place et peut être utilisé pour créer ponctuellement une hiérarchie dans l'archive. À utiliser volontairement plutôt que systématiquement.

Les champs qui ne sont pas pertinents peuvent rester vides.

### Crédits et sources

Toujours essayer d'identifier et créditer correctement les personnes à l'origine d'un contenu.

Lorsqu'une image ou un objet ne vient pas directement de Signal, renseigner autant que possible son auteur·ice, artiste, photographe, designer, studio, projet ou source.

Pour une trace trouvée physiquement — affiche, flyer, fanzine, carte, objet imprimé, etc. — la date et le lieu peuvent également être renseignés lorsqu'ils apportent quelque chose à l'archive.

L'objectif est que l'archive puisse rester compréhensible plusieurs années plus tard et que le travail des personnes représentées soit correctement attribué.

En cas de doute sur un crédit, mieux vaut le signaler ou vérifier avant publication plutôt que d'inventer une attribution.

### Liens

Lorsqu'un contenu renvoie vers un projet accessible ailleurs, son URL peut être renseignée dans `archive.json`.

Cela peut être par exemple :

- le site d'un artiste ;
- YouTube / Vimeo pour une vidéo ou un documentaire ;
- une plateforme musicale ;
- un projet en ligne ;
- une publication ;
- une autre source pertinente.

Toujours utiliser une URL complète commençant par `https://`.

### Radio

La radio utilise actuellement une playlist SoundCloud.

Sa configuration se trouve dans :

`js/radio.js`

Si la playlist SoundCloud change, remplacer uniquement l'URL / l'identifiant de la playlist utilisé par le player, sans modifier le reste du système si ce n'est pas nécessaire.

La radio est susceptible d'évoluer plus tard vers un système plus large de lecture audio. Éviter pour l'instant de complexifier son fonctionnement sans en discuter avec l'équipe.

## Principe éditorial

Il n'est pas nécessaire d'attendre qu'un contenu soit « important » pour l'ajouter.

Signal est aussi un espace de curation et de mémoire collective.

Si vous tombez sur quelque chose qui vous semble graphiquement, musicalement, culturellement ou simplement humainement intéressant, n'hésitez pas à proposer de l'archiver.

L'archive peut mélanger nos propres productions, celles des artistes avec lesquels nous travaillons et des traces extérieures qui nourrissent notre univers.

L'important est surtout de conserver suffisamment de contexte et de crédits pour que ces objets ne deviennent pas, avec le temps, des images anonymes perdues dans la grille.
