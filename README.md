# CardBlanche - Obsidian Plugin

**CardBlanche** is an Obsidian plugin designed to simplify the creation and management of [obsidian-spaced-repetition](https://github.com/st3v3nmw/obsidian-spaced-repetition) flashcards within your vault. 
By integrating seamlessly with Obsidian's workspace, this plugin allows you to generate flashcards based on parameters passed via the Obsidian protocol, organize them by date, and manage them in dedicated decks.

## Features

- **Flashcard Creation**: Automatically create flashcards with a word and its definition.
- **Protocol Integration**: Supports `obsidian://` URIs for seamless automation and external integration.
- **Deck Organization**: Organize flashcards into decks and date-based markdown files.

## Installation

1. Download the latest release from the [Releases](https://github.com/whsv26/card-blanche/releases) section.
2. Extract the contents into your Obsidian plugins folder:
    - `${VAULT_FOLDER}/.obsidian/plugins/card-blanche`
3. Restart Obsidian.
4. Enable "CardBlanche" in **Settings > Community Plugins**.

## Usage

<img src="https://github.com/user-attachments/assets/2222f990-509c-4cde-b3a9-3bf2af418eab" height="100">
<img src="https://github.com/user-attachments/assets/adb9a537-0392-45e4-8067-0d198a9d8334" height="100">
<img src="https://github.com/user-attachments/assets/72cff645-1a4c-42b6-bae4-4f3efb42a328" height="100">
<img src="https://github.com/user-attachments/assets/55961f32-a16d-4352-b988-5b5aec205ffa" height="100">
<img src="https://github.com/user-attachments/assets/3006d95a-5314-44ff-848e-3edaf1ab4a60" height="100">

### Creating a Flashcard
1. Use the following URI format to create a new flashcard:
   ```
   obsidian://card-blanche-add-card?cardQuestion={{question}}&cardAnswer={{answer}}
   ```
    - `folderPath`: (Optional) The name of the deck. Defaults to `flashcards`
    - `fileName`: (Optional) Note name. Defaults to `YYYY-MM`
    - `cardQuestion`: Card question text 
    - `cardAnswer`: (Optional) Card answer text. Defaults to definition from dictionary  
    - `multiline`: (Optional) If true then format cards in `?` style or else in `::` style

2. Example:
   ```
   obsidian://card-blanche-add-card?folderPath=vocabulary&cardQuestion=ephemeral
   ```
   This will add the flashcard to `vocabulary/YYYY-MM.md`.

### Managing Flashcards
- Flashcards are stored in markdown files organized by deck and date.
- Each card follows one of the formats based on `multiline` parameter:
  ```
  - **Word** :: Definition
  ```
  ```
  **Multi
  line
  question**
  ?
  Multi
  line
  answer
  ```

## Contributing
Contributions are welcome! If you encounter any issues or have feature requests, please open an issue or submit a pull request.

## License
This plugin is licensed under the [MIT License](LICENSE).
