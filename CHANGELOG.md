# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [0.6] - 2020-06-23
### Added
- Focussed composition where rest of UI is hidden when composing tweets.
- Relies on MutationObserver to detect DOM structure changes.
- Use visibility toggling on click in the composer.
- Hide separator bars on toggle.

### Changed
- Implementation of border hiding to use `rgba` alpha value with CSS variables.

### Removed
- Unnecessary CSS and redundant CSS for thread lines.
- Thread lines attempted featured.