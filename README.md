# Netfliks Downloads

Public GitHub repository for the Netfliks Windows app download page and public remote configuration.

## Architecture

Netfliks.exe will read public configuration from the GitHub Pages site. The existing streaming website remains untouched.

Public configuration controls:

- streaming website URL
- payment enabled/disabled
- price and currency
- payment URL
- activation verification endpoint
- activation status endpoint
- latest/minimum app version
- forced updates
- download URL
- announcements

## Security

Do not put SquashberryPay private keys, API secrets, activation-code databases, or other credentials in this repository.

GitHub Pages is suitable for public configuration and the download site. Activation/payment verification that requires secrets must run on a secure backend.

## Site

GitHub Pages will publish the files in this repository from the `main` branch root.