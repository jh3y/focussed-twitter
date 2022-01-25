FILES = src/focussed-twitter/icons/ src/focussed-twitter/pages/ src/focussed-twitter/scripts/ src/focussed-twitter/styles/ src/focussed-twitter/manifest.json

help:
	@grep -E '^[a-zA-Z\._-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev-chrome: # Copies manifest.chrome.json to manifest.json
	cp -f src/focussed-twitter/manifest.chrome.json src/focussed-twitter/manifest.json
dev-firefox: # Copies manifest.firefox.dev.json to manifest.json
	cp -f src/focussed-twitter/manifest.firefox.dev.json src/focussed-twitter/manifest.json
prod-firefox: # Copies manifest.firefox.json to manifest.json
	cp -f src/focussed-twitter/manifest.firefox.json src/focussed-twitter/manifest.json
build-chrome: # Builds Chrome version of extension for upload
	make dev-chrome && zip -r focussed-twitter.chrome.zip $(FILES)
build-firefox: # Builds Firefox version of extension for upload
	make prod-firefox && zip -r focussed-twitter.firefox.zip $(FILES)