# Moneybird Time CLI
CLI that makes it easy to add Moneybird time entries

## Installation
- Install Node and NPM
- Execute `npm i`

## Configuration
Copy config.example.yaml to config.yaml

***General warning:***
All administrationId, userId, project, contact values should be within double quotes.

### Setup Moneybird details
Inside the moneybird section, add the following:
- administrationId: Login to your Moneybird administration and check the url, the part after moneybird.com/ is the administrationId.
- userId: Use the Moneybird API to get your userId: https://developer.moneybird.com/api/users/
- token: create a token at https://moneybird.com/user/applications/new

### Presets
Create one or multiple presets, these consist of a unique key and as values:
- description: will be added to the time entry in Moneybird
- project: the project id, get it from the URL by clicking on a project in Administration settings -> projects or get it with the API: https://developer.moneybird.com/api/projects/
- contact: the contact id, get it from the contact detail page URL or with the API: https://developer.moneybird.com/api/contacts/
- billable: true/false, is the project billable
- defaults: one or more default settings, read the Defaults section for more information.

### Preset groups
You can create groups of presets. This makes it easy to create e.g. a default workflow to enter all time entries for a specific working day type. The key should be unique, the value can be the key of a preset or a defaults object.

### Defaults
You can configure defaults on 3 levels in the config:
- top level: the fallback/main defaults
- preset: defaults for a preset
- preset group: defaults for a value of a preset group

Defaults are:
- preset: the identifier of the preset
- startOffset: the offset in minutes from now of the start time
- pausedDuration: the pause duration in minutes
- endOffset: the offset in minutes from now of the end time

### Summary
You can output a summary table for:
- edit: true/false, when you edit an entry
- menu: false, when you enter the menu
- remove: true, when you remove an entry
- send: true, before you confirm sending the entries to Moneybird

## Running
Execute `npm start`
