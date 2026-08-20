# Signal Music France

Site statique autonome, publié depuis le dossier `signal/`.

## Actualiser l’archive

1. Déposer les nouvelles images dans `assets/archive/`.
2. Depuis la racine du dépôt, lancer :

```sh
python3 signal/scripts/generate_archive.py
```

Le script met à jour `data/archive.json`. Il conserve les entrées et métadonnées existantes, ignore les fichiers déjà référencés et ajoute les nouvelles images sans inventer de contenu éditorial.

Les champs `type`, `artiste`, `titre`, `date`, `credit`, `url`, `comportement` et `span` peuvent ensuite être complétés directement dans le JSON. Une valeur `span: 2` agrandit une œuvre sur les écrans qui le permettent.

## Radio

La radio utilise le Widget API SoundCloud avec la playlist configurée dans `js/radio.js`. Le player reste invisible et les commandes du footer contrôlent lecture, pause et volume.

Le site étant multipage, la lecture s’arrête lors d’un changement de page. Cette limitation évite de transformer le site en application monopage.
