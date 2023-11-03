# hupi

Hupi is a simple tool designed to streamline your development workflow by automatically reloading your project in the browser as soon as any changes are detected within your designated project folder. 

## Prerequisites

Before you proceed with the installation, ensure you have the following prerequisites:

1. Node.js
2. npm

## Installation

You could install the application on your machine using the npm command:

```bash
npm -g i @andrianmoroi/hupi
```

## Usage

To serve the desired folder, you need to navigate in a terminal into your working directory and from there just run the hupi command.

```bash
hupi
```

The application will automatically initiate an HTTP server on an available port on your local machine. The serving URL will be displayed in the terminal, allowing you to quickly access the application through your preferred web browser.

To specify specific rules for refreshing the website, you can create a **.hupi-watch** file in the root directory of your project. 

The next example file will refresh the application only when an html or a javascript file will be changed:

```sh
# This is a comment.

**/*.html
**/*.js
```

In absence of a **.hupi-watch** file, the application will track the changes of all the files.
