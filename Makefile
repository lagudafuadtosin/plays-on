FILES := manifest.json \
         video-bg-play-content.js \
         $(wildcard _locales/*/messages.json) \
         icon.svg \
         LICENSE \
         README.md

plays-on.xpi: $(FILES) Makefile
	rm -f plays-on.xpi
	zip plays-on.xpi $(FILES)
