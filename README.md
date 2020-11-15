# CodeChallengeProject

Project developed for skills evaluation as RN Developer.

## Challenge Description

The challenge includes:

* Use Kitsu API used to request and consume data (https://kitsu.docs.apiary.io/).
* Match wireframes described in PDF file.
* Detail view must display image provided by API, information mentioned in wireframes, and list of episodes and characters.
* Search content.
* Redirect to youtube app for video link.

## Environment

* React Native version: 0.63.3
* NodeJS version: 13.7.0


#### Structure

assets:
* fonts : includes ttf files used in project. Ttf files obtained from  google fonts (https://fonts.google.com/).

src:
- colors
  - GlobalColors.js : Color palette used in project UI.
- components
  - RatingDisplay.js : Component to display rating as stars. (Not used, opted for one star and rating number. Kept for future implementation)
  - SerieDisplay.js : Component to display series in home view. (Not used, changed to pure component SerieDisplayPureComponent.js)
  - SerieDisplayPureComponent.js: Pure componment to display serie in home view.
- images
  - applaudo_logo.png : Image used as logo in init and home view.
- utils
  - useApiKitsu.js : Functions for api fetch. Function getAnimeData not used, but keeped for non async use. Function getFromApiAsync used.
- views
  - Details.js : Details of selected series display. Access from Home and Search views.
  - Home.js : Data display in FlatList for anime series, most popular and best average rating anime. Access from Init view. Can Access Details and Search views. When series is selected, fetch additional info (episodes, genres, characters), and pass it as props to Details view.
  - Init.js : Initial view. Fetchs data for anime series from API, and pass it as props to Home view.
  - Search.js : Fetch for data with text input as filter. Displays result in flatlist, if item is pressed, it fetches additional info and pass it as props to Details view. When list end is reached, it fetches for next records (if there are more records).
  
#### Libraries
- react-native-router-flux : used for navigation. (https://github.com/aksonov/react-native-router-flux)
- react-native-vector-icons : used for icons. (https://github.com/oblador/react-native-vector-icons)
