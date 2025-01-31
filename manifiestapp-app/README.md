# About

ManiFiesta is a festival that takes place every year in September in Belgium,
the festival of solidarity, with concerts, debates or artistic activities.

Here is the official mobile app allowing first of all to see the programme more 
easily and to put your favourites there. Also used for the selling of the ticket

# Installation
## Setup

Install

* Node: 22+
* npm: ^11.0

## Getting Started

Install the project:

```
npm install
```

## Development

Start the development server:

```bash
npm run start:dev
```

Open [http://localhost:4200](http://localhost:4200) with your browser to see the
result.

See the [app-backend README](https://github.com/manifiesta/app-backend/blob/development/README.md)
for login info.

## Updating and code maintenance

Frequently update packages if they provide no breaking changes, so if there is
a critical and breaking update at some point, the changes are ideally limited to
that package.

Use commands like

```bash
npm update
```

```bash
npm dedupe
```

More info on: https://docs.npmjs.com/cli/v7/commands


# Technical details

The application is made with [Ionic Angular](https://ionicframework.com/docs/angular/overview).

New color to apply? Go to src/theme/variable.scss and there is the color generator
https://ionicframework.com/docs/theming/color-generator.
With that you can change the primary, secondary and other color easily.

The info to change the icon and splashscreen https://capacitorjs.com/docs/guides/splash-screens-and-icons, 
be careful of the size!

For the Play Store, the icon need to be 512x512 pixels, the presentation image
1024x500 pixels and the screenshot of the app for phone need a ratio 16:9 or
9:16.

For Apple Store we need screenshot right from the physical iPhone (no emulator).

## License

[GPL-3](https://choosealicense.com/licenses/gpl-3.0/)

### TODO

* Lot of refactor ...
* Unit Testing
* Any idea of new functionality?
