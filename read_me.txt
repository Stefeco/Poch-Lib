read me!

1) installation de Node.js et de NPM (nodejs package manager)

téléchargez node.js via le site https://nodejs.org/fr/download/

il est conseillé d'utiliser la version LTS. Choisissez votre version selon l'OS.
lancez le fichier d'installation (msi pour windows par exemple) et choisissez votre dossier d'installation.
Durant l'installation laissez les composants par défaut.

pour vérifier l'installation ouvrez une ligne de commande ou un terminal et tapez :
-----------------------------

node -v
la version installée devrait s'afficher.

ensuite entrez la ligne de commande :
-------------------------------------

npm -v
vous devriez voir la version du node package manager.

**************************************************************************************************************

2) installation de sass :
- ici on suit l'installation via node.js dans visual studio code.
Une fois node js installé entrez la commande : ('ctrl ù' pour ouvrir la console sur visual studio code en clavier fr).
----------------------------------------------

npm init

- node.js va créer un package JSON dans le dossier où se trouve votre projet.
pour vérifier que sass est bien installé ouvrez le fichier JSON et vérifiez que sass est bien dans les dépendances avec la version la plus récente.
------------------------------------------

npm install -g sass

- node js vous crée un dossier appelé "node_modules" ou sont stockés tous les fichiers nécessaires au préprocesseur sass.

Ceci est une installation en javascript. Son exécution est plus lente que l'installation directe de sass.
Pour un autre type d'installation vous pouvez consulter le site : https://sass-lang.com/install
où sont listés une série d'outils qui permettent d'installer et d'utiliser sass.

Une fois sass installé il est conseillé d'ajouter deux dossiers "scss" et "css" dans votre projet et d'y inclure dans le dossier approprié
un fichier style.scss et style.css.

pour initialiser sass vous entrez la commande console :
-------------------------------------

sass style.scss style.css

cette commande va "lier" le fichier scss et le fichier css. Tout changement dans le fichier scss va être reproduit dans le fichier css (qui lui reste du simple css).

pour exécuter sass, il vous suffit d'entrer la commande :
------------------------------------------------

sass --watch scss:css

à chaque ouverture de votre projet...
