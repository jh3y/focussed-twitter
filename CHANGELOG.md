# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [0.9] - 2021-03-10
### Changed
- Fixed Tweet borders
- Allows hiding of Messages Dock
- Hide Metrics for Likes, Retweets, Replies.
- Allow mobile.twitter.com

## [0.8] - 2020-06-23
### Changed
- Fixed the focus on scroll feature by binding event handling to the class.

## [0.7] - 2020-06-23
### Changed
- Updated separator logic to also hide border under page title.
- Added version for Firefox
- Updated README
- Synced implementations into one folder

## [0.6] - 2020-06-23
### Added
- Focussed composition where rest of UI is hidden when composing tweets.
- Relies on MutationObserver to detect DOM structure changes.
- Use visibility toggling on click in the composer.
- Hide separator bars on toggle.


### Removed
- Unnecessary CSS and redundant CSS for thread lines.
- Thread lines attempted featured.