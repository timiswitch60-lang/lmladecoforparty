# LM La Déco for Party — version optimisée

## Contenu
- `index.html` : site vitrine responsive en HTML/CSS/JavaScript, sans framework ni dépendance payante.
- `images/` : visuels du site optimisés en WebP pour réduire le poids des pages.
- `LM LA DECO FOR PARTY VIDEO.mp4` : vidéo de présentation.
- `robots.txt` et `sitemap.xml` : fichiers SEO.
- `google19ee23359089c0cf.html` : fichier de vérification Google existant.

## Tester en local
Ouvrir `index.html` dans un navigateur. Pour un test plus proche de la mise en ligne, lancer un serveur statique dans ce dossier, par exemple :
```bash
python -m http.server 8000
```
Puis ouvrir `http://localhost:8000`.

## Mise en ligne gratuite
Le site est statique et peut être publié sans abonnement ni base de données. Pour un site professionnel, Netlify propose un forfait gratuit avec limites d’usage ; les conditions et plafonds peuvent évoluer :
https://www.netlify.com/pricing/

Déploiement simple : créer un compte, glisser-déposer le dossier du site dans l’interface de déploiement manuel de Netlify, puis suivre les instructions. Un domaine personnalisé est généralement acheté séparément ; l’adresse Netlify fournie peut être utilisée gratuitement.

## Formulaire de devis
Le formulaire utilise FormSubmit (`https://formsubmit.co/lmladecoforparty@gmail.com`). Lors du premier envoi, le service peut demander une confirmation de l’adresse destinataire. Le formulaire nécessite donc une connexion Internet et dépend de la disponibilité du service tiers. Faites un envoi de test avant de publier le lien du site.

## Avis clients
Aucun faux témoignage n’est affiché. Les avis Google en direct ne sont pas connectés, car la configuration d’origine ne contient pas de clé API ni de Place ID. Le site renvoie vers la recherche Google de l’établissement. La section des avis communautaires nécessite encore un formulaire et une feuille de réponses si vous souhaitez l’automatiser.

## À personnaliser avant la publication
- Vérifier le numéro, l’adresse e-mail, les zones desservies et les liens de réseaux sociaux.
- Faire un test complet du formulaire sur téléphone et ordinateur.
- Vérifier que la fiche Google et le lien d’avis pointent vers le bon établissement.
- Consulter les informations de confidentialité et les conditions des services tiers utilisés.

## Gratuité
Le code, les polices Google Fonts et le format WebP ne nécessitent pas de licence payante. L’hébergement peut rester gratuit dans les limites du forfait choisi. Un nom de domaine personnalisé, certaines options tierces ou un trafic important peuvent entraîner des frais.


## Version premium V3 — animations, devis et informations légales

- CTA principal renommé « Demande de devis ».
- Animations et micro-interactions CSS légères, avec prise en compte de `prefers-reduced-motion`.
- États de focus clavier plus visibles, progression de lecture et interactions plus douces.
- Ajout de `mentions-legales.html` et `confidentialite.html`.
- Enrichissement de l’information sur les données personnelles près du formulaire.
- Objet de notification du formulaire plus lisible : « NOUVELLE DEMANDE DE DEVIS | LM LA DÉCO FOR PARTY ».

### À faire impérativement avant publication
1. Compléter les champs entre crochets de `mentions-legales.html` (identité, statut, adresse, immatriculation, hébergeur).
2. Vérifier la configuration et les conditions du prestataire FormSubmit, notamment le destinataire, les transferts éventuels et les modalités de conservation.
3. Vérifier la durée de conservation effectivement appliquée aux demandes.
4. Tester une demande de devis de bout en bout et confirmer l’adresse de réception.
5. Vérifier les droits d’utilisation des photos/vidéos et la présence éventuelle de cookies/traceurs tiers.

Ces changements améliorent l’information et les bonnes pratiques, mais ne constituent pas une certification juridique ni une garantie de conformité légale.
